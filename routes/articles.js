const express = require('express');

const auth = require('../middleware/auth');

const router = express.Router();

const getArticlesValidate = require('../middleware/validation/getArticlesValidate'); //+
const createArticleValidate = require('../middleware/validation/createArticleValidate'); //+
const deleteArticleValidate = require('../middleware/validation/deleteArticleValidate'); //+

const {
  createArticle,
  getSavedArticles,
  deleteArticle,
} = require('../controllers/articles');

router.get('/', auth, getArticlesValidate, getSavedArticles);
router.post('/', auth, createArticleValidate, createArticle);
router.delete('/:articleId', auth, deleteArticleValidate, deleteArticle);

module.exports = router;
