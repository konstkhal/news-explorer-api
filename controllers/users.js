const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoServerError } = require('mongoose');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const AuthorizationError = require('../errors/AuthorizationError');

const { APP_STATE } = require('../helpers/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

/* const getUsers = (req, res, next) => {
    console.log('getUsers');
  User.find({})
    .orFail(() => {
      throw new NotFoundError(
        APP_STATE.HTTP_USER_LIST_EMPTY.MESSAGE,
        APP_STATE.HTTP_USER_LIST_EMPTY.STATUS
      );
    })
    .then((users) => {
      res.status(APP_STATE.DEFAULT_OK.STATUS).send({ data: users });
    })
    .catch((err) => next(err));
}; */

// returns information about the logged-in user (email and name)
const getProfile = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError(
        APP_STATE.HTTP_USER_NOT_FOUND.MESSAGE,
        APP_STATE.HTTP_USER_NOT_FOUND.STATUS
      );
    })
    .then((user) => {
      const { email, name } = user;
      res.status(APP_STATE.DEFAULT_OK.STATUS).send({ email, name });
    })
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!password)
    throw new ValidationError(
      APP_STATE.HTTP_BAD_REQUEST.MESSAGE,
      APP_STATE.HTTP_BAD_REQUEST.STATUS
    );
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(
          APP_STATE.REQUEST_CONFLICT_USER_EXISTS.MESSAGE,
          APP_STATE.REQUEST_CONFLICT_USER_EXISTS.STATUS
        );
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      })
    )
    .then((user) => {
      res.status(APP_STATE.CREATE_USER_SUCCESS.STATUS).send({
        data: {
          name: user.name,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000 && err instanceof MongoServerError) {
        next(
          new ConflictError(
            APP_STATE.REQUEST_CONFLICT_USER_EXISTS.MESSAGE,
            APP_STATE.REQUEST_CONFLICT_USER_EXISTS.STATUS
          )
        );
      } else next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findOne(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError(
        APP_STATE.HTTP_USER_NOT_FOUND.MESSAGE,
        APP_STATE.HTTP_USER_NOT_FOUND.STATUS
      );
    })
    .then((user) => {
      if (user._id !== req.user._id) {
        throw new AuthorizationError(
          APP_STATE.HTTP_FORBIDDEN.MESSAGE,
          APP_STATE.HTTP_FORBIDDEN.STATUS
        );
      }
      return User.findByIdAndUpdate(
        req.user._id,
        { name, about },
        { new: true, runValidators: true }
      ).then((userUpdated) => {
        res.send({ data: userUpdated });
      });
    })
    .catch((err) => next(err));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return (
    User.findUserByCredentials({ email, password })
      /*   .orFail(() => {
      throw new AuthorizationError(
        APP_STATE.HTTP_USER_NOT_FOUND_MALICIOUS.MESSAGE,
        APP_STATE.HTTP_USER_NOT_FOUND_MALICIOUS.STATUS
      );
    }) */
      .then((user) => {
        bcrypt.compare(password, user.password).then((match) => {
          if (!match) {
            throw new AuthorizationError(
              APP_STATE.HTTP_USER_NOT_FOUND_MALICIOUS.MESSAGE,
              APP_STATE.HTTP_USER_NOT_FOUND_MALICIOUS.STATUS
            );
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            {
              expiresIn: '1w',
            }
          );
          res.send({ token });
        });
      })
      .catch((err) => next(err))
  );
};

module.exports = {
  // getUsers,
  getProfile,
  createUser,
  updateProfile,
  // updateProfileAvatar,
  login,
};
