function authMiddleware(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: giris gerekli" });
  }
  next();
}

module.exports = authMiddleware;