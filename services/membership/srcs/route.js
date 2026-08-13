const router = require("express").Router();
const {
  sendCommunityRequest,
  getCommunityRequests,
  resolveCommunityRequest,
  getRole,
  getUserCommunities,
  createCommunity,
  deleteCommunity,
  getModeratorPermissions,
  setModeratorPermissions,
  leaveCommunity,
} = require("./controller");
const { authMiddleware } = require("./middleware");

router.post("/communityRequests", authMiddleware, sendCommunityRequest);
router.get(
  "/communityRequests/:communityId",
  authMiddleware,
  getCommunityRequests,
);
router.post(
  "/communityRequests/resolve",
  authMiddleware,
  resolveCommunityRequest,
);
router.get(
  "/moderatorPermissions/:communityId",
  getModeratorPermissions,
);
router.put(
  "/moderatorPermissions/:communityId",
  authMiddleware,
  setModeratorPermissions,
);
router.delete(
  "/leaveCommunity/:communityId",
  authMiddleware,
  leaveCommunity
);


//* Service to Service communication routes //* need to be closed off from public access
router.get("/userRole/:userid/:communityid", getRole);
router.get("/userCommunities/:userId", getUserCommunities);
router.post("/createCommunity", createCommunity);
router.delete("/community/:communityId", deleteCommunity);
router.delete("/user/:userid", deleteUser);
module.exports = router;
