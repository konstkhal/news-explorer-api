const jwt = require('jsonwebtoken');
// require('dotenv').config({ path: '../../.env' });
const { APP_STATE } = require('../helpers/constants');

// console.log(process.env.NODE_ENV); // production

const handleAuthError = (res) => {
  res
    .status(APP_STATE.HTTP_NOT_AUTHORIZED.STATUS)
    .send({ message: APP_STATE.HTTP_NOT_AUTHORIZED.MESSAGE });
};

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  // console.log('auth');

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'
    );
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;
  /*  req.user = {}; */
  return next();
};

module.exports = auth;
