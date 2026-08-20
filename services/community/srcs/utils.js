const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
};

const validateStatus = (status) => {
  const validStatuses = ["active", "inactive"];
  return validStatuses.includes(status);
};

const validateVisibility = (visibility) => {
  const validVisibilities = ["public", "private"];
  return validVisibilities.includes(visibility);
};

const validateAccess = (access) => {
  const validAccesses = ["open", "restricted", "closed"];
  return validAccesses.includes(access);
};

const fileNameSlug = (fileName) => {
  const timestamp = Date.now();
  return `${timestamp}_${fileName}`;
};

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

const createAtValidation = (created_at) => {
  if (created_at === "asc" || created_at === "desc") return created_at;
  else return "asc";
};

const validateTags = (tags) => {
  if (!Array.isArray(tags)) return false;
  return tags.every(
    (tag) => typeof tag === "string" && tag.trim() !== "" && tag.length <= 30,
  );
};

const validateCommunityReqHandle = (reqArray) => {
  if (!Array.isArray(reqArray)) return false;
  for (const reqId of reqArray) {
    if (reqId.id === undefined || reqId.id === null) {
      return false;
    }
    if (reqId.status === undefined || reqId.status === null) {
      return false;
    }
  }
  return true;
};

module.exports = {
  slugify,
  validateStatus,
  validateVisibility,
  validateAccess,
  fileNameSlug,
  setUser,
  pageAndLimitValidation,
  createAtValidation,
  validateTags,
  validateCommunityReqHandle,
};
