const setUser = (req, res, next) => {
  req.user = {
    id: req.headers["x-user-id"] || null,
    role: req.headers["x-user-role"] || null,
  };
  next();
};

const pageAndLimitValidation = (page, limit) => {
  let theobj = {
    page: 1,
    limit: 10,
  };

  if (page && Number.isInteger(Number(page)) && Number(page) >= 1) {
    theobj.page = Number(page);
  }

  if (limit && Number.isInteger(Number(limit)) && Number(limit) >= 1) {
    theobj.limit = Number(limit);
  }
  return theobj;
};

const validateAction = (action) => {
  const validActions = ["approve", "reject"];
  return validActions.includes(action);
}

const isUUID = (str) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

module.exports = {
  setUser,
  validateAction,
  isUUID,
  pageAndLimitValidation,
};