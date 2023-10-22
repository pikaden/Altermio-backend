const Joi = require('joi');

const addBalance = {
  body: Joi.object().keys({
    amount: Joi.number().integer(),
    bankCode: Joi.string().required()
  }),
};

module.exports = {
    addBalance
  };
  