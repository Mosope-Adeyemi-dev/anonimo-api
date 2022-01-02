const Joi = require('joi');

// Event registration validation rules
const userValidation = async (field) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string()
  });

  try {
    return await schema.validateAsync(field, {
      abortEarly: false
    });
  } catch (err) {
    return err;
  }
};
const messageValidation = async (field) => {
  const schema = Joi.object({
    receiverUsername: Joi.string().required(),
    message: Joi.string().required()
  });

  try {
    return await schema.validateAsync(field, {
      abortEarly: false
    });
  } catch (err) {
    return err;
  }
};

module.exports = {
  userValidation,
  messageValidation,
};