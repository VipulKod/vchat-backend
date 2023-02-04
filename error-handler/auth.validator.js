const { Joi } = require("express-validation");

const registerValidation = {
  body: Joi.object({
    username: Joi.string()
      .regex(/^[A-Za-z0-9_-]*$/)
      .required()
      .min(3)
      .max(15),
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .min(6)
      .max(15),
  }),
};

module.exports = {registerValidation};
