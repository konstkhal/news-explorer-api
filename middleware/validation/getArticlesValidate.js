const { celebrate, Joi } = require('celebrate');

exports.getArticlessValidate = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string().trim().required(),
    })
    .unknown(true),
});
