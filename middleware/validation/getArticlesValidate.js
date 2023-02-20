const { celebrate, Joi } = require('celebrate');

const getArticlesValidate = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string().trim().required(),
    })
    .unknown(true),
});

module.exports = getArticlesValidate;
