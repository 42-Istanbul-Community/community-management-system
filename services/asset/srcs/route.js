const router = require("express").Router();
const { getUserAssets, getCommunityAssets, getContentAsset } = require("./controller");

router.get("/users/:assetId", getUserAssets);
router.get("/community/:assetId", getCommunityAssets);
router.get("/content/:assetId", getContentAsset);


module.exports = router;