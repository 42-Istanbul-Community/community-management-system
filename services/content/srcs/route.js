const router = require('express').Router();
const { createAnnouncement, listAnnouncements } = require('./controller');

router.post('/announcements', createAnnouncement);
router.get('/announcements', listAnnouncements);

module.exports = router;