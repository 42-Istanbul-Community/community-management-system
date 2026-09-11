const express = require("express");
const router = require("./route");
const cors = require("cors");
const multer = require("multer");
const { setUser } = require("./utils");

const PORT = process.env.PORT || 3000;
const CORS_OPTIONS = {
  origin: process.env.DOMAIN_NAME
    ? new RegExp(
      `^https?:\\/\\/(.*\\.)?${process.env.DOMAIN_NAME.replace(/\./g, "\\.")}$`,
    )
    : "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

const app = express();
app.use(cors(CORS_OPTIONS));
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 1024 },
});
app.use(upload.any());
app.use((req, res, next) => {
  if (req.files && Array.isArray(req.files)) {
    const formattedFiles = {};
    req.files.forEach((file) => {
      if (!formattedFiles[file.fieldname]) {
        formattedFiles[file.fieldname] = [];
      }
      formattedFiles[file.fieldname].push(file);
    });
    req.files = formattedFiles;
  }
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(setUser);
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
