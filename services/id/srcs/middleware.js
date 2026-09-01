const AuthMiddleware = (req,res,next) => {
    const mainUserId = req.headers["x-user-id"];
    if (!mainUserId) {
        return res.status(401).json({ error: "Unauthorized: Login required", details: "Missing authentication header" });
    }
    next();
}

const setUserIdMiddleware = (req,res,next) => {
    const mainUserId = req.headers["x-user-id"];
    const mainUserRole = req.headers["x-user-role"];
    req.user = {};
    req.user.id = mainUserId;
    req.user.role = mainUserRole;
    next();
}

module.exports = {
    AuthMiddleware,
    setUserIdMiddleware
}
