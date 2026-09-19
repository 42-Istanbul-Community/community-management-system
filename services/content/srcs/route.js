const router = require('express').Router();
const controller = require('./controller');
const { isValidUuid } = require('./utils/utils');
const authMiddleware = require('./utils/authMiddleware');
const {
	createAnnouncement,
	listAnnouncements,
	getAnnouncement,
	updateAnnouncement,
	deleteAnnouncement,
	createEvent,
	listEvents,
	getEvent,
	updateEvent,
	deleteEvent,
	joinEvent,
	leaveEvent,
	listParticipants,
} = require('./controller');

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

router.get('/internal/health', controller.healthCheck);
router.get('/internal/communities', controller.listActiveCommunities);

module.exports = router;