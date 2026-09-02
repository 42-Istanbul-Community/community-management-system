const { isUUID } = require("./utils");

const AuthMiddleware = (req, res, next) => {
  if (!req.headers["x-user-id"]) {
    return res.status(401).json({
      error: "Unauthorized: Login required",
      details: "Missing authentication header",
    });
  }
  next();
};

const setUserIdMiddleware = (req, res, next) => {
  req.user = {};
  if (isUUID(req.headers["x-user-id"])) {
    req.user.id = req.headers["x-user-id"];
  }
  if (
    req.headers["x-user-role"] == "super_admin" ||
    req.headers["x-user-role"] == "normal"
  ) {
    req.user.role = req.headers["x-user-role"];
  }
  next();
};

module.exports = {
  AuthMiddleware,
  setUserIdMiddleware,
};
