const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUserById,
} = require('../controllers/users');

router.get('/users', getUsers);

router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', updateUserAvatar);
router.get('/users/me', getCurrentUserById);
router.get('/users/:userId', getUserById);

module.exports = router;
