const router = require("express").Router();
const {
  sendCommunityRequest,
  getCommunityRequests,
  resolveCommunityRequest,
  getRole,
  getUserCommunities,
  createCommunities,
  deleteCommunity,
  getModeratorPermissions,
  setModeratorPermissions,
  leaveCommunity,
  deleteUser,
  kickMember,
  getCommunityMembers,
} = require("./controller");
const { authMiddleware } = require("./middleware");

router.post("/communityRequests", authMiddleware, sendCommunityRequest);
router.get("/members/:communityId", getCommunityMembers);
router.post(
  "/communityRequests/resolve",
  authMiddleware,
  resolveCommunityRequest,
);

router.get(
  "/communityRequests/:communityId",
  authMiddleware,
  getCommunityRequests,
);

router.get("/moderatorPermissions/:communityId", getModeratorPermissions);
router.put(
  "/moderatorPermissions/:communityId",
  authMiddleware,
  setModeratorPermissions,
);
router.delete("/leaveCommunity/:communityId", authMiddleware, leaveCommunity);
router.post("/kickMember", authMiddleware, kickMember);

router.get("/internal/userRole/:userId/:communityId", getRole);
router.get("/internal/userCommunities/:userId", getUserCommunities);
router.post("/internal/createCommunity", createCommunities);
router.delete("/internal/community/:communityId", deleteCommunity);
router.delete("/internal/user/:userid", deleteUser);
module.exports = router;
