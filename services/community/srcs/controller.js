const {
  validateVisibility,
  validateAccess,
  slugify,
  validateStatus,
  pageAndLimitValidation,
  createAtValidation,
  validateTags,
  validateCommunityReqHandle,
  isUUID,
} = require("./utils");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const path = require("path");

const minio = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

/**
 * takes array {requestid: id, status: accpeted/rejected}
 */
exports.manageCommunityRequests = async (req, res) => {
  try {
    const { requestIds } = req.body;
    if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
      return res
        .status(400)
        .json({ error: "Missing required field: requestIds" });
    }
    if (!validateCommunityReqHandle(requestIds)) {
      return res.status(400).json({
        error:
          "Invalid requestIds format. Each object must have 'id' and 'status' fields.",
      });
    }
    let errorMessages = [];
    let successCommunities = [];
    for (const requestId of requestIds) {
      try {
        const result = await prisma.$transaction(async (tx) => {
          if (requestId.status === "rejected") {
            await tx.community_create_requests.update({
              where: { id: requestId.id },
              data: {
                status: "rejected",
                reviewed_by: req.user.id,
                reviewed_at: new Date(),
              },
            });

            return null;
          }

          if (requestId.status === "approved") {
            const communityRequest =
              await tx.community_create_requests.findUnique({
                where: { id: requestId.id },
                include: {
                  tags: {
                    include: {
                      tag: true,
                    },
                  },
                },
              });

            if (!communityRequest) {
              throw new Error("Community request not found");
            }

            const slug = slugify(communityRequest.name);

            const community = await tx.communities.create({
              data: {
                name: communityRequest.name,
                status: "active",
                description: communityRequest.description,
                visibility: communityRequest.visibility,
                access: communityRequest.access,
                rules_path: communityRequest.rules_path,
                slug,
              },
            });

            if (communityRequest.tags.length > 0) {
              await tx.community_tags.createMany({
                data: communityRequest.tags.map((t) => ({
                  community_id: community.id,
                  tag_id: t.tag_id,
                })),
              });
            }
            return {
              ...community,
              user_id: communityRequest.user_id,
            };
          }
          return null;
        });

        if (result) {
          successCommunities.push(result);
        }
      } catch (error) {
        errorMessages.push(error.message);
      }
    }

    res
      .status(201)
      .json({ communities: successCommunities, errors: errorMessages });
  } catch (error) {
    console.error("Error creating community:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

exports.getCommunity = async (req, res) => {
  const { slug } = req.params;
  try {
    const community = await prisma.communities.findUnique({
      where: { slug },
    });
    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }
    const tags = await prisma.community_tags.findMany({
      where: { community_id: community.id },
      include: { tag: true },
    });
    community.tags = tags.map((t) => t.tag.name);
    if (community.visibility === "private") {
      if (!req.user || !req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      if (req.user.role !== "super_admin") {
        const userRole = await axios.get(
          `http://membership/internal/userRole/${req.user.id}/${community.id}`,
        );
        if (!userRole.data || !userRole.data.role) {
          return res.status(403).json({ error: "Access denied" });
        }
        if (userRole.data && userRole.data.role === "normal") {
          return res.status(403).json({ error: "Access denied" });
        }
      }
      return res.status(200).json({ community });
    }
    return res.status(200).json({ community });
  } catch (error) {
    console.error("Error fetching community:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

exports.getCommunityByInternal = async (req, res) => {
  const { id } = req.params;
  try {
    const community = await prisma.communities.findUnique({
      where: isUUID(id) ? { id: id } : { slug: id },
    });
    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }
    res.status(200).json({ community });
  } catch (error) {
    console.error("Error fetching community:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

exports.getAllCommunities = async (req, res) => {
  try {
    const { page, limit, status, created_at, tags } = req.query;
    const { page: validatedPage, limit: validatedLimit } =
      pageAndLimitValidation(page, limit);
    let validatedStatus = null;
    if (validateStatus(status)) {
      validatedStatus = status;
    }
    const validatedCreatedAt = createAtValidation(created_at);
    let validTags = [];
    if (tags) {
      validTags = tags.split(",").filter((tag) => tag.trim() !== "");
    }
    if (req.user && req.user.role === "super_admin") {
      const communities = await prisma.communities.findMany({
        skip: (validatedPage - 1) * validatedLimit,
        take: validatedLimit,
        orderBy: {
          created_at: validatedCreatedAt,
        },
        where: validatedStatus ? { status: validatedStatus } : {},
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
      communities.forEach((community) => {
        community.tags = community.tags.map((t) => t.tag.name);
      });
      return res.status(200).json({ communities });
    }
    let userCommunities = [];
    if (req.user && req.user.id) {
      const userInComms = await axios.get(
        `http://membership/internal/userCommunities/${req.user.id}`,
      );
      userCommunities = userInComms.data.communities || [];
    }
    const where = {
      OR: [
        { visibility: "public" },
        {
          visibility: "private",
          id: {
            in: userCommunities.map((c) => c.community_id),
          },
        },
      ],
      ...(validatedStatus && { status: validatedStatus }),
      ...(validTags.length > 0 && {
        AND: validTags.map((tag) => ({
          tags: {
            some: {
              tag: {
                name: tag,
              },
            },
          },
        })),
      }),
    };

    const theCommunities = await prisma.communities.findMany({
      where,
      skip: (validatedPage - 1) * validatedLimit,
      take: validatedLimit,
      orderBy: {
        created_at: validatedCreatedAt,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    theCommunities.forEach((community) => {
      community.tags = community.tags.map((t) => t.tag.name);
    });

    return res.status(200).json({ communities: theCommunities });
  } catch (error) {
    console.error("Error fetching communities:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

exports.updateCommunity = async (req, res) => {
  try {
    const { slug } = req.params;
    const { description, visibility, access, status } = req.body;

    //* validate the fields
    if (
      (!!visibility && !validateVisibility(visibility)) ||
      (!!access && !validateAccess(access)) ||
      (!!status && !validateStatus(status)) ||
      (!!description && description.trim() === "" && description.length > 500)
    ) {
      return res.status(400).json({ error: "Invalid field values" });
    }

    const community = await prisma.communities.findUnique({
      where: { slug },
    });
    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    const userRole = await axios.get(
      `http://membership/userRole/${req.user.id}/${community.id}`,
    );
    if (
      (!userRole.data || !userRole.data.role) &&
      req.user.role !== "super_admin"
    ) {
      return res.status(403).json({ error: "Access denied" });
    }
    if (
      req.user.role !== "super_admin" &&
      userRole.data.role !== "admin" &&
      userRole.data.role !== "moderator"
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const modPermissions = await axios.get(
      `http://membership/internal/moderatorPermissions/${community.id}`,
    );
    if (
      (!modPermissions.data || !modPermissions.data.permission) &&
      userRole.data.role === "moderator"
    ) {
      return res.status(403).json({ error: "Access denied" });
    }
    if (userRole.data.role === "moderator") {
      const permissions = modPermissions.data.permission;
      if (
        (!!visibility && !permissions.includes("setVisibility")) ||
        (!!access && !permissions.includes("setAccessibility")) ||
        (!!description && !permissions.includes("setDescription")) ||
        (!!status && !permissions.includes("setStatus")) ||
        (!!req.file && !permissions.includes("setRules"))
      ) {
        return res.status(403).json({ error: "Access denied" });
      }
    }
    let fileName = null;
    //* need to be add MinIO service to upload the rules file and get the path of the file and save it to the database
    if (!!req.file) {
      const ext = path.extname(req.file.originalname);
      fileName = `users/${crypto.randomUUID()}${ext}`;
      if (
        community.rules_path &&
        community.rules_path.startsWith("community/")
      ) {
        await minio
          .send(
            new DeleteObjectCommand({
              Bucket: process.env.MINIO_BUCKET,
              Key: community.rules_path,
            }),
          )
          .catch((err) => {
            console.error("Error deleting old rules file:", err);
          });
      }
      await minio
        .send(
          new PutObjectCommand({
            Bucket: process.env.MINIO_BUCKET,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            Metadata: {
              originalname: req.file.originalname,
              service: "Community Service",
              communityslug: community.slug,
            },
          }),
        )
        .catch((err) => {
          throw new Error(
            "Error uploading new rules file with MinIO: " + err.message,
          );
        });
    }

    const updatedCommunity = await prisma.communities.update({
      where: { slug },
      data: {
        ...(!!description && { description }),
        ...(!!visibility && { visibility }),
        ...(!!access && { access }),
        ...(!!status && { status }),
        ...(!!fileName && { rules_path: fileName }),
      },
    });
    return res.status(200).json({ community: updatedCommunity });
  } catch (error) {
    console.error("Error updating community:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

exports.deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Community ID is required" });
    }

    const files = await prisma.$transaction(async (tx) => {
      const files = await tx.communities.findUnique({
        where: { id: id },
        select: { rules_path: true },
      });
      if (!files) {
        return res.status(404).json({ error: "Community not found" });
      }

      await tx.communities.delete({
        where: { id: id },
      });

      return files;
    });

    if (files.rules_path && files.rules_path.startsWith("community/")) {
      await minio
        .send(
          new DeleteObjectCommand({
            Bucket: process.env.MINIO_BUCKET,
            Key: files.rules_path,
          }),
        )
        .catch((err) => {
          console.error("Error deleting rules file from MinIO:", err);
        });
    }

    res.status(200).json({ message: "Community deleted successfully" });
  } catch (error) {
    console.error("Error deleting community:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

exports.createCommunityRequest = async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(403).json({ error: "Access denied" });
    const { name, message, description, visibility, access, tags } = req.body;

    // Validate required fields
    if (!name || !description || !visibility || !access || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (tags && !validateTags(tags)) {
      return res.status(400).json({ error: "Invalid tags format" });
    }
    if (!validateVisibility(visibility) || !validateAccess(access)) {
      return res.status(400).json({ error: "Invalid field values" });
    }
    if (tags && tags.length > 10) {
      return res.status(400).json({ error: "Too many tags. Maximum is 10." });
    }

    const slug = slugify(name);
    const existingCommunity = await prisma.communities.findUnique({
      where: { slug },
    });

    if (existingCommunity) {
      return res
        .status(409)
        .json({ error: "Community with this name already exists" });
    }

    let tagIds = [];
    //* add tags table if not exists and add tags to the community_tags table
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        const existingTag = await prisma.tags.findUnique({
          where: { name: tag },
        });
        if (!existingTag) {
          const newTag = await prisma.tags.create({
            data: { name: tag },
          });
          tagIds.push(newTag.id);
        } else {
          tagIds.push(existingTag.id);
        }
      }
    }

    let fileName = null;
    if (!!req.file) {
      const ext = path.extname(req.file.originalname);
      fileName = `community/${crypto.randomUUID()}${ext}`;
      await minio.send(
        new PutObjectCommand({
          Bucket: process.env.MINIO_BUCKET,
          Key: fileName,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
          Metadata: {
            originalname: req.file.originalname,
            service: "Community Service",
            communityslug: slug,
          },
        }),
      );
    }

    const communityRequest = await prisma.community_create_requests.create({
      data: {
        name,
        message,
        description,
        visibility,
        access,
        rules_path: fileName ? fileName : null,
        user_id: req.user.id,
      },
    });

    if (tagIds.length > 0) {
      await prisma.community_create_request_tags.createMany({
        data: tagIds.map((id) => ({
          request_id: communityRequest.id,
          tag_id: id,
        })),
      });
    }

    return res.status(201).json({ communityRequest });
  } catch (error) {
    console.error("Error creating community request:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({ error: "Missing required field: userid" });
    }

    const files = await prisma.$transaction(async (tx) => {
      let fileReq = await tx.community_create_requests.findMany({
        where: {
          user_id: userid,
          rules_path: { not: null },
        },
        select: { rules_path: true },
      });

      await tx.community_create_requests.deleteMany({
        where: { user_id: userid },
      });

      const adminCommunities = await axios.get(
        `http://membership/internal/userCommunities/${userid}`,
      );
      const adminCommunityIds = adminCommunities.data.communities
        .filter((c) => c.role === "admin")
        .map((c) => c.id);

      fileReq = [
        ...fileReq,
        ...(await tx.communities.findMany({
          where: { id: { in: adminCommunityIds }, rules_path: { not: null } },
          select: { rules_path: true },
        })),
      ];

      await tx.communities.deleteMany({
        where: { id: { in: adminCommunityIds } },
      });
      fileReq = fileReq.filter(
        (f) => f.rules_path && f.rules_path.startsWith("community/"),
      );
      return fileReq.map((f) => ({ Key: f.rules_path }));
    });

    if (files.length > 0) {
      await minio
        .send(
          new DeleteObjectsCommand({
            Bucket: process.env.MINIO_BUCKET,
            Delete: { Objects: files },
          }),
        )
        .catch((err) => {
          console.error("Error deleting files from MinIO:", err);
        });
    }

    return res
      .status(200)
      .json({ message: "User and related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

exports.getCommunityRequests = async (req, res) => {
  try {
    if (req.user && req.user.role != "super_admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    const { page, limit, status, created_at } = req.query;
    const { page: validatedPage, limit: validatedLimit } =
      pageAndLimitValidation(page, limit);
    let validatedStatus = null;
    if (validateStatus(status)) {
      validatedStatus = status;
    }
    const validatedCreatedAt = createAtValidation(created_at);
    const where = validatedStatus ? { status: validatedStatus } : {};
    const communityRequests = await prisma.community_create_requests.findMany({
      where,
      skip: (validatedPage - 1) * validatedLimit,
      take: validatedLimit,
      orderBy: {
        created_at: validatedCreatedAt,
      },
    });
    return res.status(200).json({ communityRequests });
  } catch (error) {
    console.error("Error fetching community requests:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};
