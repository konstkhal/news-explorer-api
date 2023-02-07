const { celebrate, Joi } = require('celebrate');

const getProfileValidate = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string().trim().required(),
    })
    .unknown(true),
});

module.exports = {
  getProfileValidate,
};
