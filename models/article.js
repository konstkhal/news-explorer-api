/* eslint-disable comma-dangle */
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    minlength: 2,
    maxlength: 2048,
    required: true,
    validate: {
      validator(v) {
        return /https?:\/\/(www\.)?[-a-z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-z0-9@:%_+.~#?&//=]*)?/gi.test(
          v
        );
      },
      message: 'invalid URL',
    },
  },
  image: {
    type: String,
    minlength: 2,
    maxlength: 2048,
    required: true,
    validate: {
      validator(v) {
        return /https?:\/\/(www\.)?[-a-z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-z0-9@:%_+.~#?&//=]*)?/gi.test(
          v
        );
      },
      message: 'invalid URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

});

module.exports = mongoose.model('article', articleSchema);