const router = require('express').Router();
const { createUser, getUserDetails, getUserRole, updateUser, deleteUser } = require('./controller');
const { authMiddleware } = require('./middleware');

router.post('/createUser', createUser);
router.get('/',authMiddleware, getUserDetails);
router.get('/:userId',authMiddleware, getUserDetails);
router.get('/:userId/role',authMiddleware, getUserRole);
router.put('/:userId', authMiddleware, updateUser);
router.delete('/:userId', deleteUser);

module.exports = router;