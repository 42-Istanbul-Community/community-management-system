const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

async function saveAttachment(req) {
  if (!req.files || !req.files.file) return null;

  const uploaded = req.files.file;
  const ext = path.extname(uploaded.name);
  const storedName = crypto.randomUUID() + ext;
  const savePath = path.join(UPLOAD_DIR, storedName);

  await uploaded.mv(savePath);   // MinIO gelince sadece bu satır değişecek

  return {
    url: `/uploads/${storedName}`,
    name: uploaded.name,
    type: uploaded.mimetype,
    size: uploaded.size,
  };
}

module.exports = { saveAttachment, UPLOAD_DIR };