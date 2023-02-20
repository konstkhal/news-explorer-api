const NotFoundError = require('../errors/NotFoundError');
const AuthorizationError = require('../errors/AuthorizationError');

const Article = require('../models/article');

const { APP_STATE } = require('../helpers/constants');

const getSavedArticles = (req, res, next) => {
  Article.find({})
    .select('+owner')
    .then((articles) => {
      const userArticles = articles.filter((article) => {
        const { owner } = article;
        return String(owner) === req.user._id;
      });
      if (userArticles.length === 0) {
        next(
          new NotFoundError(
            APP_STATE.HTTP_NOTHING_FOUND.MESSAGE,
            APP_STATE.HTTP_NOTHING_FOUND.STATUS
          )
        );
        return;
      }
      res.status(APP_STATE.DEFAULT_OK.STATUS).send(userArticles);
    })
    .catch((err) => next(err));
};

// creates an article with the passed keyword, title,
// text, date, source, link, and image in the body

const createArticle = (req, res, next) => {
  Article.create({ ...req.body, owner: req.user._id })
    .then((article) =>
      res.status(APP_STATE.CREATE_CARD_SUCCESS.STATUS).send(article)
    )
    .catch((err) => next(err));
};

// deletes the stored article by _id
const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  Article.findOne({ _id: articleId })
    .orFail(() => {
      throw new NotFoundError(
        APP_STATE.HTTP_NOTHING_FOUND.MESSAGE,
        APP_STATE.HTTP_NOTHING_FOUND.STATUS
      );
    })
    .select('owner')
    .then((foundArticle) => {
      if (!foundArticle || req.user._id !== String(foundArticle.owner)) {
        throw new AuthorizationError(
          APP_STATE.HTTP_FORBIDDEN.MESSAGE,
          APP_STATE.HTTP_FORBIDDEN.STATUS
        );
      }
      Article.findByIdAndRemove(articleId)
        .then(() => {
          Article.find({}).then((allArticles) => res.send(allArticles));
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

module.exports = {
  getSavedArticles,
  createArticle,
  deleteArticle,
};
