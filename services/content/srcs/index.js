const express = require('express');
const cors = require('cors');
const prisma = require('./prisma');
const router = require('./route');
const fileUpload = require('express-fileupload');
const path = require('path');
const setUser = require('./utils/setUser');


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

app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
  abortOnLimit: true,
}));

//Test içindir. MinIO gelince kalkacak
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(setUser);

app.get('/', (req, res) => {
  res.status(200).json({ service: 'content', status: 'ok' });
});

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Content service is running on port ${PORT}`);
});
