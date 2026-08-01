const router = require('express').Router();
const { manageCommunityRequests, getCommunity, getAllCommunities, updateCommunity, deleteCommunity, createCommunityRequest } = require('./controller');
const { authMiddleware } = require('./middleware');

router.post('/communities',authMiddleware, manageCommunityRequests);
router.get('/communities', getAllCommunities);
router.get('/communities/:slug', getCommunity);
router.put('/communities/:slug', authMiddleware, updateCommunity);
router.delete('/communities/:slug', authMiddleware, deleteCommunity);
router.post('/createCommunity', authMiddleware, createCommunityRequest);

module.exports = router;