const { celebrate, Joi } = require('celebrate');

const getProfileValidate = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).required(),
  }),
});

module.exports = {
  getProfileValidate,
};
