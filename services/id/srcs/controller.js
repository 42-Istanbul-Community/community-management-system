const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListBucketsCommand,
} = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const path = require("path");
const { isUUID } = require("./utils");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const rustfs = new S3Client({
  endpoint: `http://${process.env.RUSTFS_ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.RUSTFS_ACCESS_KEY,
    secretAccessKey: process.env.RUSTFS_SECRET_KEY,
  },
  forcePathStyle: true,
});

exports.healthCheck = async (req, res) => {
  try {
    await rustfs.send(new ListBucketsCommand({}));

    console.log("Rustfs Connection Successful.");
  } catch (error) {
    console.error("Health check failed:", error);
    res
      .status(500)
      .json({ status: "ID service is unhealthy with RUSTFS", error });
    return;
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ID service is healthy" });

    console.log("Database Connection Successful.");
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ status: "ID service is unhealthy", error });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { id, name, picture_url, role } = req.body;
    if (!id || !name) {
      return res
        .status(400)
        .json({ error: "Bad Request: ID and Name are required" });
    }
    let fileName = null;
    let backFileName = null;
    if (req.files.picture?.[0]) {
      const ext = path.extname(req.files.picture[0].originalname);
      fileName = `users/${crypto.randomUUID()}${ext}`;
      await rustfs.send(
        new PutObjectCommand({
          Bucket: process.env.RUSTFS_BUCKET,
          Key: fileName.replace("users/", ""),
          Body: req.files.picture[0].buffer,
          ContentType: req.files.picture[0].mimetype,
          Metadata: {
            originalname: req.files.picture[0].originalname,
            service: "ID Service",
          },
        }),
      );
    }

    if (req.files.background_picture?.[0]) {
      const ext = path.extname(req.files.background_picture[0].originalname);
      backFileName = `users/${crypto.randomUUID()}${ext}`;
      await rustfs.send(
        new PutObjectCommand({
          Bucket: process.env.RUSTFS_BUCKET,
          Key: backFileName.replace("users/", ""),
          Body: req.files.background_picture[0].buffer,
          ContentType: req.files.background_picture[0].mimetype,
          Metadata: {
            originalname: req.files.background_picture[0].originalname,
            service: "ID Service",
          },
        }),
      );
    }

    const existingUser = await prisma.users.findUnique({
      where: { id },
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Conflict: User with this ID already exists" });
    }
    const newUser = await prisma.users.create({
      data: {
        id,
        name,
        picture: fileName ? fileName : picture_url ? picture_url : null,
        background_picture: backFileName ? backFileName : null,
        role: role || "normal", // default role is "normal"
      },
    });
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    let userid = req.params.userId;
    if (!userid) {
      userid = req.user.id;
    }
    if (!isUUID(userid)) {
      return res
        .status(400)
        .json({ error: "Bad Request: Invalid UUID format" });
    }
    const user = await prisma.users.findUnique({
      where: { id: userid },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

exports.getUserRole = async (req, res) => {
  try {
    if (!isUUID(req.params.userId)) {
      return res
        .status(400)
        .json({ error: "Bad Request: Invalid UUID format" });
    }
    let userid = req.params.userId;
    if (!userid) {
      userid = req.user.id;
    }
    const user = await prisma.users.findUnique({
      where: { id: userid },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ role: user.role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      if (req.user.role !== "super_admin") {
        return res
          .status(403)
          .json({ error: "Forbidden: You can only update your own profile" });
      }
    }
    if (req.body.role && req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ error: "Forbidden: Only super_admin can change role" });
    }
    //* input validation
    if (req.body.name && typeof req.body.name !== "string") {
      return res
        .status(400)
        .json({ error: "Bad Request: Name must be a string" });
    }
    if (req.body.role && typeof req.body.role !== "string") {
      return res
        .status(400)
        .json({ error: "Bad Request: Role must be a string" });
    }
    const user = await prisma.users.findUnique({
      where: { id: req.params.userId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let fileName = null;
    let backFileName = null;
    if (!!req.files.picture?.[0]) {
      const ext = path.extname(req.files.picture[0].originalname);
      fileName = `users/${crypto.randomUUID()}${ext}`;
      if (user.picture && user.picture.startsWith("users/")) {
        await rustfs.send(
          new DeleteObjectCommand({
            Bucket: process.env.RUSTFS_BUCKET,
            Key: user.picture.replace("users/", ""),
          }),
        );
      }
      await rustfs.send(
        new PutObjectCommand({
          Bucket: process.env.RUSTFS_BUCKET,
          Key: fileName.replace("users/", ""),
          Body: req.files.picture[0].buffer,
          ContentType: req.files.picture[0].mimetype,
          Metadata: {
            originalname: req.files.picture[0].originalname,
            service: "ID Service",
          },
        }),
      );
    }

    if (!!req.files.background_picture?.[0]) {
      const ext = path.extname(req.files.background_picture[0].originalname);
      backFileName = `users/${crypto.randomUUID()}${ext}`;
      if (
        user.background_picture &&
        user.background_picture.startsWith("users/")
      ) {
        await rustfs.send(
          new DeleteObjectCommand({
            Bucket: process.env.RUSTFS_BUCKET,
            Key: user.background_picture.replace("users/", ""),
          }),
        );
      }
      await rustfs.send(
        new PutObjectCommand({
          Bucket: process.env.RUSTFS_BUCKET,
          Key: backFileName.replace("users/", ""),
          Body: req.files.background_picture[0].buffer,
          ContentType: req.files.background_picture[0].mimetype,
          Metadata: {
            originalname: req.files.background_picture[0].originalname,
            service: "ID Service",
          },
        }),
      );
    }
    const updatedUser = await prisma.users.update({
      where: { id: req.params.userId },
      data: {
        name: req.body.name || user.name,
        picture: fileName ? fileName : user.picture,
        background_picture: backFileName ? backFileName : null,
      },
    });
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.params.userId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.picture && user.picture.startsWith("users/")) {
      await rustfs.send(
        new DeleteObjectCommand({
          Bucket: process.env.RUSTFS_BUCKET,
          Key: user.picture.replace("users/", ""),
        }),
      );
    }

    if (
      user.background_picture &&
      user.background_picture.startsWith("users/")
    ) {
      await rustfs.send(
        new DeleteObjectCommand({
          Bucket: process.env.RUSTFS_BUCKET,
          Key: user.background_picture.replace("users/", ""),
        }),
      );
    }

    await prisma.users.delete({
      where: { id: req.params.userId },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

exports.getUserBatch = async (req, res) => {
  try {
    const { ids, page, limit, text } = req.query;
    let idArray, validatedPage, validatedLimit;
    if (!!ids) {
      idArray = ids.split(",").map((id) => id.trim());
      if (!idArray.every(isUUID)) {
        return res
          .status(400)
          .json({ error: "Bad Request: Invalid UUID format" });
      }
    }

    if (!!text && typeof text !== "string") {
      return res
        .status(400)
        .json({ error: "Bad Request: Text must be a string" });
    }

    if (!!page && (typeof page !== "string" || isNaN(page))) {
      return res
        .status(400)
        .json({ error: "Bad Request: Page must be a valid number" });
    }

    if (!!limit && (typeof limit !== "string" || isNaN(limit))) {
      return res
        .status(400)
        .json({ error: "Bad Request: Limit must be a valid number" });
    }
    try {
      validatedPage = page ? parseInt(page) : 1;
      validatedLimit = limit ? parseInt(limit) : 10;
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Bad Request: Page and Limit must be valid numbers" });
    }

    if (validatedPage < 1 || validatedLimit < 1) {
      return res.status(400).json({
        error: "Bad Request: Page and Limit must be positive numbers",
      });
    }

    if (!!idArray) {
      validatedLimit = idArray.length; // Override limit if ids are provided
      validatedPage = 1; // Override page if ids are provided
    }

    const users = await prisma.users.findMany({
      where: {
        ...(idArray && { id: { in: idArray } }),
        ...(text && {
          name: { contains: text, mode: "insensitive" },
        }),
      },
      select: {
        id: true,
        name: true,
        picture: true,
        background_picture: true,
      },
      skip: (validatedPage - 1) * validatedLimit,
      take: validatedLimit,
      orderBy: [
        {
          role: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    const totalCount = await prisma.users.count({
      where: {
        ...(idArray && { id: { in: idArray } }),
        ...(text && {
          name: { contains: text, mode: "insensitive" },
        }),
      },
    });
    const maxPage = Math.ceil(totalCount / validatedLimit);
    res
      .status(200)
      .json({
        users,
        page: validatedPage,
        limit: validatedLimit,
        maxPage,
        totalCount,
      });
  } catch (error) {
    console.error("Error fetching user batch:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

exports.deletePics = async (req, res) => {
  try{
    const userId = req.params.userId;
    let { pic, back_pic } = req.query;

    if (!isUUID(userId)) {
      return res
        .status(400)
        .json({ error: "Bad Request: Invalid UUID format" });
    }

    if (req.user.id !== userId) {
      if (req.user.role !== "super_admin") {
        return res
          .status(403)
          .json({ error: "Forbidden: You can only delete your own pictures" });
      }
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!pic && !back_pic) {
      pic = true;
      back_pic = true;
    }

    if (!!pic && user.picture && user.picture.startsWith("users/")) {
      await rustfs.send(
        new DeleteObjectCommand({
          Bucket: process.env.RUSTFS_BUCKET,
          Key: user.picture.replace("users/", ""),
        }),
      );
      await prisma.users.update({
        where: { id: userId },
        data: { picture: null },
      });
    }

    if (!!back_pic && user.background_picture && user.background_picture.startsWith("users/")) {
      await rustfs.send(
        new DeleteObjectCommand({
          Bucket: process.env.RUSTFS_BUCKET,
          Key: user.background_picture.replace("users/", ""),
        }),
      );
      await prisma.users.update({
        where: { id: userId },
        data: { background_picture: null },
      });
    }

    await prisma.users.update({
      where: { id: userId },
      data: {
        picture: !!pic ? null : user.picture,
        background_picture: !!back_pic ? null : user.background_picture,
      },
    });

    return res.status(200).json({ message: "User pictures deleted successfully" });
  }catch (error) {
    console.error("Error deleting user pictures:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
}
