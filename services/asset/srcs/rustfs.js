const { S3Client } = require("@aws-sdk/client-s3");

const idRustfs = new S3Client({
  endpoint: `http://${process.env.RUSTFS_ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.RUSTFS_ID_ACCESS_KEY,
    secretAccessKey: process.env.RUSTFS_ID_SECRET_KEY,
  },
  forcePathStyle: true,
});

const communityRustfs = new S3Client({
  endpoint: `http://${process.env.RUSTFS_ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.RUSTFS_COMMUNITY_ACCESS_KEY,
    secretAccessKey: process.env.RUSTFS_COMMUNITY_SECRET_KEY,
  },
  forcePathStyle: true,
});

const contentRustfs = new S3Client({
  endpoint: `http://${process.env.RUSTFS_ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.RUSTFS_CONTENT_ACCESS_KEY,
    secretAccessKey: process.env.RUSTFS_CONTENT_SECRET_KEY,
  },
  forcePathStyle: true,
});

module.exports = {
  idRustfs,
  communityRustfs,
  contentRustfs,
};
