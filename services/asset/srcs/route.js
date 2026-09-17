const router = require("express").Router();
const {
  getUserAssets,
  getCommunityAssets,
  getContentAsset,
  healthCheck,
} = require("./controller");

router.get("/internal/health", healthCheck);

router.get("/users/:assetId", getUserAssets);
router.get("/community/:assetId", getCommunityAssets);
router.get("/content/:assetId", getContentAsset);

module.exports = router;
