const setUserIdMiddleware = (req,res,next) => {
    const mainUserId = req.headers["x-user-id"];
    const mainUserRole = req.headers["x-user-role"];
    req.user = {};
    req.user.id = mainUserId;
    req.user.role = mainUserRole;
    next();
}

module.exports = {
    setUserIdMiddleware
}