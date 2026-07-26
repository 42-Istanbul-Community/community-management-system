const router = require('express').Router();
const { createUser, getUserDetails, getUserRole, updateUser, deleteUser } = require('./controller');

router.post('/createUser', createUser);
router.get('/', getUserDetails);
router.get('/:userId', getUserDetails);
router.get('/:userId/role', getUserRole);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

module.exports = router;