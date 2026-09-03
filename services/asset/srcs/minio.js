const { S3Client } = require("@aws-sdk/client-s3");

const idMinio = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ID_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_ID_SECRET_KEY,
  },
  forcePathStyle: true,
});

const communityMinio = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_COMMUNITY_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_COMMUNITY_SECRET_KEY,
  },
  forcePathStyle: true,
});

const contentMinio = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_CONTENT_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_CONTENT_SECRET_KEY,
  },
  forcePathStyle: true,
});

module.exports = {
  idMinio,
  communityMinio,
  contentMinio,
};
