function setUser(req, res, next) {
  req.user = {
    id: req.headers['X-User-ID'] || null,
    role: req.headers['X-User-Role'] || null,
  };
  next();
}

module.exports = setUser;