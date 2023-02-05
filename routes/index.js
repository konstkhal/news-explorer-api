const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

const { APP_STATE } = require('../helpers/constants');

const { createUser, login } = require('../controllers/users');

const {
  createUserValidate,
} = require('../middleware/validation/createUserValidate'); //+
const { loginValidate } = require('../middleware/validation/loginValidate');

const usersRouter = require('./users');
const articlesRouter = require('./articles');

router.post('/signup', createUserValidate, createUser);

router.post('/signin', loginValidate, login);

router.use('/users', usersRouter);
router.use('/articles', articlesRouter);

router.use('*', (req, res, next) => {
  next(
    new NotFoundError(
      APP_STATE.HTTP_NO_SUCH_ROUTE.MESSAGE,
      APP_STATE.HTTP_NO_SUCH_ROUTE.STATUS
    )
  );
});

module.exports = router;
