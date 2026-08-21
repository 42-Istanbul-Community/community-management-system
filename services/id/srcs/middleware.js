const AuthMiddleware = (req,res,next) => {
    const mainUserId = req.headers["x-user-id"];
    if (!mainUserId) {
        return res.status(401).json({ error: "Unauthorized: Login required" });
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

const AdminMiddleware = (req,res,next) => {
    const mainUserId = req.headers["x-user-id"];
    const mainUserRole = req.headers["x-user-role"];
    if (!mainUserId) {
        return res.status(401).json({ error: "Unauthorized: Login required" });
    }
    if (mainUserRole !== "admin") {
        return res.status(403).json({ error: "Forbidden: Admin access required" });
    }
    next();
}

module.exports = {
    AuthMiddleware,
    AdminMiddleware,
    setUserIdMiddleware
}
