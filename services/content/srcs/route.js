const router = require('express').Router();
const controller = require('./controller');

const createAnnouncement = controller.createAnnouncement;
const listAnnouncements = controller.listAnnouncements;
const getAnnouncement = controller.getAnnouncement;
const updateAnnouncement = controller.updateAnnouncement;
const deleteAnnouncement = controller.deleteAnnouncement;

const createEvent = controller.createEvent;
const listEvents = controller.listEvents;
const getEvent = controller.getEvent;
const updateEvent = controller.updateEvent;
const deleteEvent = controller.deleteEvent;

/* ---------- ANNOUNCEMENTS ---------- */

router.post('/announcements', createAnnouncement);
router.get('/announcements', listAnnouncements);
router.get('/announcements/:id', getAnnouncement);
router.put('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

/* ---------- EVENTS  ---------- */

router.post('/events', createEvent);
router.get('/events', listEvents);
router.get('/events/:id', getEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

module.exports = router;