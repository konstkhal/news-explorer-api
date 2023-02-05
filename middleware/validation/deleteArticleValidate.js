const { celebrate, Joi } = require('celebrate');

exports.deleteArticleValidate = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().length(24).hex().required(),
  }),
  headers: Joi.object()
    .keys({
      authorization: Joi.string().trim().required(),
    })
    .unknown(true),
});
