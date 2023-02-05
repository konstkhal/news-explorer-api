const express = require('express');

const auth = require('../middleware/auth');

const router = express.Router();

const {
  createArticle,
  getArticles,
  deleteArticle,
} = require('../controllers/articles');
const {
  getArticlesValidate,
} = require('../middleware/validation/getArticlesValidate'); //+
const {
  createArticleValidate,
} = require('../middleware/validation/createArticleValidate'); //+
const {
  deleteArticleValidate,
} = require('../middleware/validation/deleteArticleValidate'); //+

router.get('/', auth, getArticlesValidate, getArticles);
router.post('/', auth, createArticleValidate, createArticle);
router.delete('/:articleId', auth, deleteArticleValidate, deleteArticle);

module.exports = router;
