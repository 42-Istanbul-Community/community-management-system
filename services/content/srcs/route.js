const router = require('express').Router();
const controller = require('./controller');
const createAnnouncement = controller.createAnnouncement;
const listAnnouncements = controller.listAnnouncements;
const getAnnouncement = controller.getAnnouncement;
const updateAnnouncement = controller.updateAnnouncement;
const deleteAnnouncement = controller.deleteAnnouncement;


router.post('/announcements', createAnnouncement);
router.get('/announcements', listAnnouncements);
router.get('/announcements/:id', getAnnouncement);
router.put('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

module.exports = router;