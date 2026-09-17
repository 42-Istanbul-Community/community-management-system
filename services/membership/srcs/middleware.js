exports.authMiddleware = (req, res, next) => {
  if (req.user && req.user.id) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

exports.selfRoute = (req, res, next) => {
  if (req.user && req.user.id === req.params.userId) {
    next();
  } else if (req.user && req.user.role === "super_admin") {
    next();
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
};
