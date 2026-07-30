const router = require('express').Router();
const { manageCommunityRequests, getCommunity, getAllCommunities, updateCommunity, deleteCommunity, createCommunityRequest } = require('./controller');

router.post('/communities', manageCommunityRequests);
router.get('/communities', getAllCommunities);
router.get('/communities/:slug', getCommunity);
router.put('/communities/:slug', updateCommunity);
router.delete('/communities/:slug', deleteCommunity);
router.post('/createCommunity', createCommunityRequest);

module.exports = router;