const {
  validateVisibility,
  validateAccess,
  slugify,
  fileNameSlug,
  validateStatus,
  pageAndLimitValidation,
  createAtValidation,
  validateTags,
  validateCommunityReqHandle,
} = require("./utils");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

/**
 * takes array {requestid: id, status: accpeted/rejected}
 */
exports.manageCommunityRequests = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ error: "Access denied" });
    }
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
        if (requestId.status === "rejected") {
          await prisma.communityCreateRequest.update({
            where: { id: requestId.id },
            data: { status: "rejected" },
          });
        } else if (requestId.status === "accepted") {
          const communityRequest =
            await prisma.communityCreateRequest.findUnique({
              where: { id: requestId },
              include: { tags: { include: { tag: true } } },
            });
          if (!communityRequest) {
            return res
              .status(404)
              .json({ error: "Community request not found" });
          }
          const slug = slugify(communityRequest.name);
          const community = await prisma.community.create({
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
            await prisma.communityTags.createMany({
              data: communityRequest.tags.map((t) => ({
                communityId: community.id,
                tagId: t.tagId,
              })),
            });
          }
          successCommunities.push(community);
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
    const community = await prisma.community.findUnique({
      where: { slug },
    });
    const tags = await prisma.communityTags.findMany({
      where: { communityId: community.id },
      include: { tag: true },
    });
    community.tags = tags.map((t) => t.tag.name);
    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }
    if (community.visibility === "private") {
      if (req.user.role !== "superadmin") {
        if (!req.user.id) {
          return res.status(403).json({ error: "Access denied" });
        }
        const isMember = await axios.get(
          `http://membership:3000/isMember/${req.user.id}/${community.id}`,
        );
        if (!isMember.data.isMember) {
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
    if (req.user.role === "superadmin") {
      const communities = await prisma.community.findMany({
        skip: validatedPage * validatedLimit,
        take: validatedLimit,
        orderBy: {
          created_at: validatedCreatedAt,
        },
        where: validatedStatus ? { status: validatedStatus } : {},
      });
      return res.status(200).json({ communities });
    }
    let userCommunities = [];
    if (req.user.id) {
      const userInComms = await axios.get(
        `http://membership:3000/userCommunities/${req.user.id}`,
      );
      userCommunities = userInComms.data.communities;
    }
    const where = {
      OR: [
        { visibility: "public" },
        {
          visibility: "private",
          id: {
            in: userCommunities.map((c) => c.id),
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

    const theCommunities = await prisma.community.findMany({
      where,
      skip: validatedPage * validatedLimit,
      take: validatedLimit,
      orderBy: {
        createdAt: validatedCreatedAt,
      },
    });
    return res.status(200).json({ communities: theCommunities });
  } catch (error) {
    console.error("Error fetching communities:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

//* update community, only superadmin or admin or moderator (need to be implemented membership service before this function) can update the community
exports.updateCommunity = async (req, res) => {
  return res.status(501).json({ error: "Not Implemented" });
};

//* need to be add orchestration service to delete community, membership and content services
exports.deleteCommunity = async (req, res) => {
  const { slug } = req.params;
  try {
    const community = await prisma.community.findUnique({
      where: { slug },
    });
    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }
    if (req.user.role === "superadmin") {
      await prisma.community.delete({
        where: { slug },
      });
      return res
        .status(200)
        .json({ message: "Community deleted successfully" });
    }
    if (req.user.id) {
      const isAdmin = await axios.get(
        `http://membership:3000/isAdmin/${req.user.id}/${community.id}`,
      );
      if (isAdmin.data.isAdmin) {
        await prisma.community.delete({
          where: { slug },
        });
        return res
          .status(200)
          .json({ message: "Community deleted successfully" });
      }
    }
    return res.status(403).json({ error: "Access denied" });
  } catch (error) {
    console.error("Error deleting community:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

exports.createCommunityRequest = async (req, res) => {
  try {
    if (!req.user.id) return res.status(403).json({ error: "Access denied" });
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
    const existingCommunity = await prisma.community.findUnique({
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
        const existingTag = await prisma.tag.findUnique({
          where: { name: tag },
        });
        if (!existingTag) {
          const newTag = await prisma.tag.create({
            data: { name: tag },
          });
          tagIds.push(newTag.id);
        } else {
          tagIds.push(existingTag.id);
        }
      }
    }

    const rulesFile = req.files?.rulesFile;
    //* degistirilecek MinIO servisine bağlanılacak
    if (rulesFile) {
      rulesFile.name = fileNameSlug(rulesFile.name);
      rulesFile.mv(`./uploads/${rulesFile.name}`, (err) => {
        if (err) {
          return res.status(500).json({
            error: "Internal Server Error: Could not save rules file",
          });
        }
      });
    }

    const communityRequest = await prisma.communityCreateRequest.create({
      data: {
        name,
        message,
        description,
        visibility,
        access,
        rulesFile: rulesFile ? rulesFile.name : null,
      },
    });

    if (tagIds.length > 0) {
      await prisma.communityCreateRequestTags.createMany({
        data: tagIds.map((id) => ({
          requestId: communityRequest.id,
          tagId: id,
        })),
      });
    }

    return res.status(201).json({ communityRequest });
  } catch (error) {
    console.error("Error creating community request:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};
