const router = require('express').Router();
const controller = require('./controller');
const { isValidUuid } = require('./utils/utils');
const authMiddleware = require('./utils/authMiddleware');

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

router.post('/announcements', authMiddleware, createAnnouncement);
router.get('/announcements', listAnnouncements);
router.get('/announcements/:id', getAnnouncement);
router.put('/announcements/:id', authMiddleware, updateAnnouncement);
router.delete('/announcements/:id', authMiddleware, deleteAnnouncement);

/* ---------- EVENTS  ---------- */

router.post('/events', authMiddleware, createEvent);
router.get('/events', listEvents);
router.get('/events/:id', getEvent);
router.put('/events/:id', authMiddleware, updateEvent);
router.delete('/events/:id', authMiddleware, deleteEvent);

/* ---------- EVENTS PARTICIPANTS ---------- */

router.post('/events/:id/participants', authMiddleware, joinEvent);
router.delete('/events/:id/participants', authMiddleware, leaveEvent);
router.get('/events/:id/participants', listParticipants);

/* ----- INTERNAL (service-to-service) ----- */
router.get('/internal/contents/:id', controller.getContentInternal);
router.delete('/internal/user/:userId', controller.deleteUserContent);
router.delete('/internal/community/:communityId', controller.deleteCommunityContent);

module.exports = router;