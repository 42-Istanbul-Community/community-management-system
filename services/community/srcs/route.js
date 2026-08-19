const router = require("express").Router();
const {
  manageCommunityRequests,
  getCommunityByInternal,
  getCommunity,
  getAllCommunities,
  updateCommunity,
  deleteCommunity,
  createCommunityRequest,
  deleteUser,
  getCommunityRequests,
} = require("./controller");
const { authMiddleware } = require("./middleware");

router.get("/communities", getAllCommunities);
router.get("/communityRequests", authMiddleware, getCommunityRequests);
router.get("/communities/:slug", authMiddleware, getCommunity);
router.put("/communities/:slug", authMiddleware, updateCommunity);
router.post("/createCommunity", authMiddleware, createCommunityRequest);

router.get("/internal/communities/:id", getCommunityByInternal);
router.post("/internal/communities", manageCommunityRequests);
router.delete("/internal/user/:userid", deleteUser);
router.delete("/internal/communities/:id", deleteCommunity);

module.exports = router;
