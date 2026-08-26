const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const minio = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT}`,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

async function saveAttachment(req) {
  if (!req.files || !req.files.file) return null;

  const uploaded = req.files.file;
  const ext = path.extname(uploaded.name);
  const key = `content/${crypto.randomUUID()}${ext}`;

  await minio.send(
    new PutObjectCommand({
      Bucket: process.env.MINIO_BUCKET,
      Key: key,
      Body: uploaded.data,
      ContentType: uploaded.mimetype,
      Metadata: {
        originalName: uploaded.name,
        service: 'Content Service',
	  },
	}),
  );

  return {
    key: key,
    name: uploaded.name,
    type: uploaded.mimetype,
    size: uploaded.size,
  };
}

async function deleteAttachments(attachments) {
  if (!attachments) return;

  const list = Array.isArray(attachments) ? attachments : [attachments];

  for (const item of list) {
    if (!item || !item.url) continue;
    const fileName = path.basename(item.url);
    const filePath = path.join(UPLOAD_DIR, fileName);
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      if (err.code !== 'ENOENT') console.error("Attachment delete error:", err);
    }
  }
}

module.exports = { saveAttachment, deleteAttachments, UPLOAD_DIR };