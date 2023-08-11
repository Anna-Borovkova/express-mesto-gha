const httpConstants = require('http2').constants;

const router = require('express').Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use(usersRouter);
router.use(cardsRouter);

router.use('*', (req, res) => {
  res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Route not found' });
});

module.exports = router;
