const setUser = (req, res, next) => {
  req.user = {
    id: req.headers["x-user-id"] || null,
    role: req.headers["x-user-role"] || null,
  };
  next();
};

const validateAction = (action) => {
  const validActions = ["approve", "reject"];
  return validActions.includes(action);
}


module.exports = {
  setUser,
  validateAction,
};