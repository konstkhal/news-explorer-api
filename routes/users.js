const express = require('express');

const router = express.Router();

const { getProfile } = require('../controllers/users');

const auth = require('../middleware/auth');

const {
  getProfileValidate,
} = require('../middleware/validation/getProfileValidate');

// console.log('users routers init');

router.get('/me', auth, getProfileValidate, getProfile);

module.exports = router;
