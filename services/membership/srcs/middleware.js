exports.authMiddleware = (req, res, next) => {
    if (req.user && req.user.id) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}