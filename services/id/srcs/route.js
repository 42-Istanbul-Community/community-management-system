const router = require("express").Router();
const {
  createUser,
  getUserDetails,
  getUserRole,
  updateUser,
  deleteUser,
} = require("./controller");
const { AuthMiddleware } = require("./middleware");

router.post("/createUser", createUser);
router.get("/", AuthMiddleware, getUserDetails);
router.get("/:userId", AuthMiddleware, getUserDetails);
router.get("/:userId/role", AuthMiddleware, getUserRole);
router.put("/:userId", AuthMiddleware, updateUser);
router.delete("/:userId", deleteUser);

module.exports = router;
