const express = require('express');
const cors = require('cors');
const prisma = require('./prisma');


const PORT = process.env.PORT || 8000;

const CORS_OPTIONS = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-ID', 'X-User-Role'],
};

const app = express();

app.use(cors(CORS_OPTIONS));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ service: 'content', status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Content service is running on port ${PORT}`);
});

prisma.announcement.count()
  .then((n) => console.log(`Veritabani baglantisi OK — su an ${n} duyuru var`))
  .catch((err) => console.error("Veritabani baglanti hatasi:", err));