const Joi = require('joi');

const userValidation = async (field) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().required()
  });

  try {
    return await schema.validateAsync(field, {
      abortEarly: false
    });
  } catch (err) {
    return err;
  }
};
const userLoginValidation = async (field) => {
  const schema = Joi.object({
    emailOrUsername: Joi.string().required(),
    password: Joi.string().required()
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
    emailOrUsername: Joi.string().required(),
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
const resetPasswordValidation = async (field) => {
  const schema = Joi.object({
    password: Joi.string().required(),
    confirmPassword: Joi.ref('password'),
    id: Joi.string().required()
  });

  try {
    return await schema.validateAsync(field, {
      abortEarly: false
    });
  } catch (err) {
    return err;
  }
};

const forgotPasswordValidation = async (field) => {
  const schema = Joi.object({
    emailOrUsername: Joi.string().required()
  });

  try {
    return await schema.validateAsync(field, {
      abortEarly: false
    });
  } catch (err) {
    return err;
  }
};

const getMessagesValidation = async (field) => {
  const schema = Joi.object({
    id: Joi.string().required()
  });

  try {
    return await schema.validateAsync(field, {
      abortEarly: false
    });
  } catch (err) {
    return err;
  }
};

const messageStatusValidation = async (field) => {
  const schema = Joi.object({
    status: Joi.boolean().required(),
    id: Joi.string().required()
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
  resetPasswordValidation,
  forgotPasswordValidation,
  userLoginValidation,
  getMessagesValidation,
  messageStatusValidation
};