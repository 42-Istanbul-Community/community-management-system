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
} = require("./controller");
const { authMiddleware } = require("./middleware");

router.get("/communities", getAllCommunities);
router.get("/communities/:slug", authMiddleware, getCommunity);
router.put("/communities/:slug", authMiddleware, updateCommunity);
router.post("/createCommunity", authMiddleware, createCommunityRequest);

router.get("/internal/communities/:slug", getCommunityByInternal);
router.post("/internal/communities", manageCommunityRequests);
router.delete("/internal/user/:userid", deleteUser);
router.delete("/internal/communities/:slug", deleteCommunity);

module.exports = router;
