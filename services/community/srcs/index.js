const express = require("express");
const router = require("./route");
const cors = require("cors");
const multer = require("multer");
const { setUser } = require("./utils");

const PORT = process.env.PORT || 3000;
const CORS_OPTIONS = {
  origin: process.env.DOMAIN_NAME ? `.${process.env.DOMAIN_NAME}` : "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-User-ID", "X-User-Role"],
};

const app = express();
app.use(cors(CORS_OPTIONS));
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 10 }, // 10 MB
});
app.use(upload.single("file"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(setUser);
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
