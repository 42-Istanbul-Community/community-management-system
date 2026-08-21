const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const minio = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

exports.createUser = async (req, res) => {
  try {
    const { id, name, picture_url, role } = req.body;
    if (!id || !name) {
      return res
        .status(400)
        .json({ error: "Bad Request: ID and Name are required" });
    }
    let fileName = null;
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      fileName = `users/${crypto.randomUUID()}.${ext}`;
      await minio.send(
        new PutObjectCommand({
          Bucket: process.env.MINIO_BUCKET,
          Key: fileName,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
          Metadata: {
            originalName: req.file.originalname,
            Service: "ID Service",
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
  let userid = req.params.userId;
  if (!userid) {
    userid = mainUserId;
  }
  const user = await prisma.users.findUnique({
    where: { id: userid },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json({ user });
};

exports.getUserRole = async (req, res) => {
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
};

exports.updateUser = async (req, res) => {
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
  if (!!req.file) {
    const ext = path.extname(req.file.originalname);
    fileName = `users/${crypto.randomUUID()}.${ext}`;
    if (user.picture && user.picture.startsWith("users/")) {
      await minio.send(
        new DeleteObjectCommand({
          Bucket: process.env.MINIO_BUCKET,
          Key: user.picture,
        }),
      );
    }
    await minio.send(
      new PutObjectCommand({
        Bucket: process.env.MINIO_BUCKET,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        Metadata: {
          originalName: req.file.originalname,
          Service: "ID Service",
        },
      }),
    );
  }

  const updatedUser = await prisma.users.update({
    where: { id: req.params.userId },
    data: {
      name: req.body.name || user.name,
      picture: fileName ? fileName : user.picture,
    },
  });
  res.status(200).json({ user: updatedUser });
};

exports.deleteUser = async (req, res) => {
  const user = await prisma.users.findUnique({
    where: { id: req.params.userId },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.picture && user.picture.startsWith("users/")) {
    await minio.send(
      new DeleteObjectCommand({
        Bucket: process.env.MINIO_BUCKET,
        Key: user.picture,
      }),
    );
  }

  await prisma.users.delete({
    where: { id: parseInt(req.params.userId) },
  });
  res.status(200).json({ message: "User deleted successfully" });
};
