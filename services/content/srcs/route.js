const router = require('express').Router();
const controller = require('./controller');
const { isValidUuid } = require('./utils');

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

const joinEvent = controller.joinEvent;
const leaveEvent = controller.leaveEvent;
const listParticipants = controller.listParticipants;

router.param('id', (req, res, next, id) => {
  if (!isValidUuid(id)) return res.status(400).json({ error: "Bad Request: gecersiz id (UUID olmali)" });
  next();
});

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

/* ---------- EVENTS PARTICIPANTS ---------- */

router.post('/events/:id/participants', joinEvent);
router.delete('/events/:id/participants', leaveEvent);
router.get('/events/:id/participants', listParticipants);

module.exports = router;