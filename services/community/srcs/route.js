const router = require('express').Router();
const { manageCommunityRequests, getCommunity, getAllCommunities, updateCommunity, deleteCommunity, createCommunityRequest } = require('./controller');
const { authMiddleware } = require('./middleware');


router.get('/communities', getAllCommunities);
router.get('/communities/:slug', authMiddleware, getCommunity);
router.put('/communities/:slug', authMiddleware, updateCommunity);

router.post('/createCommunity', authMiddleware, createCommunityRequest);

//* Service to Service communication routes */ // need to be closed off from public access
router.post('/communities', manageCommunityRequests);
router.delete('/user/:userid', deleteUser);
router.delete('/communities/:slug', deleteCommunity);

module.exports = router;