const router = require("express").Router();
const {
  createUser,
  getUserDetails,
  getUserRole,
  updateUser,
  deleteUser,
  getUserBatch,
  healthCheck,
} = require("./controller");
const { AuthMiddleware } = require("./middleware");

router.get("/internal/health", healthCheck);

router.get("/", AuthMiddleware, getUserDetails);

router.get("/internal/:userId/role", getUserRole);
router.post("/internal/createUser", createUser);
router.delete("/internal/:userId", deleteUser);

router.get("/users", getUserBatch);
router.get("/:userId", AuthMiddleware, getUserDetails);
router.put("/:userId", AuthMiddleware, updateUser);

module.exports = router;
