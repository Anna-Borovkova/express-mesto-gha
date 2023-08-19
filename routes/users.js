const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUserById,
} = require('../controllers/users');

router.get('/users', getUsers);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), updateUserProfile);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateUserAvatar);
router.get('/users/me', getCurrentUserById);
router.get('/users/:userId', celebrate({
  body: Joi.object().keys({
    userId: Joi.string().required().min(24).max(24),
  }),
}), getUserById);

module.exports = router;
