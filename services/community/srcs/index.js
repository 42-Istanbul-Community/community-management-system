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
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-User-ID", "X-User-Role"],
};

const app = express();
app.use(cors(CORS_OPTIONS));
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 1024 },
});
app.use(
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "pic", maxCount: 1 },
    { name: "back_pic", maxCount: 1 },
  ]),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(setUser);
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
