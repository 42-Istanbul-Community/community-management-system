const router = require("express").Router();
const {
  createUser,
  getUserDetails,
  getUserRole,
  updateUser,
  deleteUser,
  getUserBatch,
} = require("./controller");
const { AuthMiddleware } = require("./middleware");


router.get("/", AuthMiddleware, getUserDetails);
router.get("/:userId", AuthMiddleware, getUserDetails);
router.put("/:userId", AuthMiddleware, updateUser);
router.get("/users", getUserBatch)

router.get("/internal/:userId/role", getUserRole);
router.post("/internal/createUser", createUser);
router.delete("/internal/:userId", deleteUser);

module.exports = router;
