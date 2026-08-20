const express = require('express');
const router = require('./route');
const cors = require('cors');
const fileupload = require('express-fileupload');
const { setUser } = require('./utils');

const PORT = process.env.PORT || 3000;
const CORS_OPTIONS = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-ID', 'X-User-Role'],
};

const app = express();
app.use(cors(CORS_OPTIONS));
app.use(fileupload({
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1 GB
  abortOnLimit: true,
  responseOnLimit: 'File size limit has been reached',
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(setUser);
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});