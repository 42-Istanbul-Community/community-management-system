const path = require('path');
const crypto = require('crypto');

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const rustfs = new S3Client({
  endpoint: `http://${process.env.RUSTFS_ENDPOINT}`,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.RUSTFS_ACCESS_KEY,
    secretAccessKey: process.env.RUSTFS_SECRET_KEY,
  },
  forcePathStyle: true,
});

async function saveAttachment(req, contentId) {
  if (!req.files || !req.files.file) return null;

  const uploaded = req.files.file;
  const ext = path.extname(uploaded.name);
  const objectKey = `${crypto.randomUUID()}${ext}`;
  const key = `content/${objectKey}`;

  await rustfs.send(
    new PutObjectCommand({
      Bucket: process.env.RUSTFS_BUCKET,
      Key: objectKey,
      Body: uploaded.data,
      ContentType: uploaded.mimetype,
      Metadata: {
        originalName: uploaded.name,
        Service: 'Content Service',
        ContentId: contentId,
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
    if (!item || !item.key) continue;
    try {
		const objectName = item.key.slice("content/".length);
        await rustfs.send(
            new DeleteObjectCommand({
              Bucket: process.env.RUSTFS_BUCKET,
              Key: objectName,
            }),
        );
    } catch (err) {
      console.error("Attachment delete error:", err);
    }
  }
}

module.exports = { saveAttachment, deleteAttachments };