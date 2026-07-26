const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

exports.createUser = async (req, res) => {
    const { id, name, role } = req.body;
    if (!name || !role) {
        return res.status(400).json({ error: "Bad Request: Name and role are required" });
    }
    const picture = req.files?.picture;
    //* create pic name with timestamp to avoid overwriting
    if (picture) {
        const timestamp = Date.now();
        picture.name = `${timestamp}_${picture.name}`;
        //* degistirilecek: resim kaydetme islemi
        picture.mv(`./uploads/${picture.name}`, (err) => {
            if (err) {
                return res.status(500).json({ error: "Internal Server Error: Could not save picture" });
            }
        });
    }
    const existingUser = await prisma.user.findUnique({
        where: { name },
    });
    if (existingUser) {
        return res.status(409).json({ error: "Conflict: User with this name already exists" });
    }
    const newUser = await prisma.user.create({
        data: { id, name, role, picture: picture ? picture.name : null },
    });
    res.status(201).json({ user: newUser });
};

exports.getUserDetails = async (req, res) => {
  const mainUserId = req.headers["x-user-id"];
  if (!mainUserId) {
    return res.status(401).json({ error: "Unauthorized: Login required" });
  }
  let userid = req.params.userId;
  if (!userid) {
    userid = mainUserId;
  }
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userid) },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json({ user });
};

exports.getUserRole = async (req, res) => {
  const mainUserId = req.headers["x-user-id"];
  if (!mainUserId) {
    return res.status(401).json({ error: "Unauthorized: Login required" });
  }
  let userid = req.params.userId;
  if (!userid) {
    userid = mainUserId;
  }
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userid) },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json({ role: user.role });
}

exports.updateUser = async (req, res) => {
    const mainUserId = req.headers["x-user-id"];
    if (!mainUserId) {
        return res.status(401).json({ error: "Unauthorized: Login required" });
    }
    if (parseInt(mainUserId) !== parseInt(req.params.userId)) {
        if (req.headers["x-user-role"] !== "admin") {
            return res.status(403).json({ error: "Forbidden: You can only update your own profile" });
        }
    }
    if (req.body.role && req.headers["x-user-role"] !== "admin") {
        return res.status(403).json({ error: "Forbidden: Only admin can change role" });
    }
    //* input validation
    if (req.body.name && typeof req.body.name !== "string") {
        return res.status(400).json({ error: "Bad Request: Name must be a string" });
    }
    if (req.body.role && typeof req.body.role !== "string") {
        return res.status(400).json({ error: "Bad Request: Role must be a string" });
    }
    const user = await prisma.user.findUnique({
        where: { id: parseInt(req.params.userId) },
    });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    if (req.files?.picture) {
        const picture = req.files.picture;
        const timestamp = Date.now();
        picture.name = `${timestamp}_${picture.name}`;
        if (user.picture)
        {
            //* degistirilecek: resim silme islemi
            const fs = require('fs');
            fs.unlink(`./uploads/${user.picture}`, (err) => {
                if (err) {
                    console.error("Could not delete old picture:", err);
                }
            });
        }
        //* degistirilecek: resim kaydetme islemi
        picture.mv(`./uploads/${picture.name}`, (err) => {
            if (err) {
                return res.status(500).json({ error: "Internal Server Error: Could not save picture" });
            }
        });
        req.body.picture = picture.name;
    }

    const updatedUser = await prisma.user.update({
        where: { id: parseInt(req.params.userId) },
        data: req.body,
    });
    res.status(200).json({ user: updatedUser });
}

exports.deleteUser = async (req, res) => {
    const mainUserId = req.headers["x-user-id"];
    if (!mainUserId) {
        return res.status(401).json({ error: "Unauthorized: Login required" });
    }
    if (parseInt(mainUserId) !== parseInt(req.params.userId)) {
        if (req.headers["x-user-role"] !== "admin") {
            return res.status(403).json({ error: "Forbidden: You can only delete your own profile" });
        }
    }
    const user = await prisma.user.findUnique({
        where: { id: parseInt(req.params.userId) },
    });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    if (user.picture) {
        //* degistirilecek: resim silme islemi
        const fs = require('fs');
        fs.unlink(`./uploads/${user.picture}`, (err) => {
            if (err) {
                console.error("Could not delete picture:", err);
            }
        });
    }

    await prisma.user.delete({
        where: { id: parseInt(req.params.userId) },
    });
    res.status(200).json({ message: "User deleted successfully" });
}