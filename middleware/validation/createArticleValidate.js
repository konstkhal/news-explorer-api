const { celebrate, Joi } = require('celebrate');

const { validateURL } = require('../../helpers/validateURL');

const createArticleValidate = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().min(2).max(1024).required(),
    text: Joi.string().required(),
    image: Joi.string().custom(validateURL).required(),
    link: Joi.string().custom(validateURL).required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
  }),
});

module.exports = createArticleValidate;
