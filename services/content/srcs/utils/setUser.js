req.user = { id, role }
function setUser(req, res, next) {
  req.user = {
    id: req.headers['x-user-id'] || null,
    role: req.headers['x-user-role'] || null,
  };
  next();
}

module.exports = setUser;