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
  getTags,
} = require("./controller");
const { authMiddleware } = require("./middleware");

router.get("/communities", getAllCommunities);
router.get("/communityRequests", authMiddleware, getCommunityRequests);
router.get("/communities/:slug", getCommunity);
router.put("/communities/:slug", authMiddleware, updateCommunity);
router.post("/createCommunity", authMiddleware, createCommunityRequest);
router.get("/tags", getTags);

router.post("/internal/communities", manageCommunityRequests);
router.get("/internal/communities/:id", getCommunityByInternal);
router.delete("/internal/user/:userid", deleteUser);
router.delete("/internal/communities/:id", deleteCommunity);

module.exports = router;
