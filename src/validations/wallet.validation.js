const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addBalance = {
  body: Joi.object().keys({
    amount: Joi.number().integer(),
    bankCode: Joi.string().required(),
  }),
};

const returnIpn = {
  body: Joi.object().keys({
    RspCode: Joi.number().integer,
    Message: Joi.string(),
  }),
};
const transfer = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    amount: Joi.number().integer()
  }),
};

module.exports = {
  addBalance,
  returnIpn,
  transfer,
};
