const express = require("express");
const router = require("./route");
const cors = require("cors");

const { setUserIdMiddleware } = require("./middleware");

const PORT = process.env.PORT || 3000;
const CORS_OPTIONS = {
  origin: process.env.DOMAIN_NAME ? new RegExp(`^https?:\\/\\/(.*\\.)?${process.env.DOMAIN_NAME.replace(/\./g, '\\.')}$`) : "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-User-ID", "X-User-Role"],
};

const app = express();
app.use(cors(CORS_OPTIONS));
app.use(setUserIdMiddleware);
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
