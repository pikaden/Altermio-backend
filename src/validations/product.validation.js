const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createProduct = {
  FormData: Joi.object().keys({
    name: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number(),
    description: Joi.string().required(),
    state: Joi.string().required(),
    brand: Joi.string().required(),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    category: Joi.string(),
    state: Joi.string(),
    brand: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      category: Joi.string(),
      price: Joi.number(),
      description: Joi.string(),
      state: Joi.string(),
      brand: Joi.string()
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const getManagedProducts = {
  query: Joi.object().keys({
    verify: Joi.string(),
    activate: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const reportProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const acceptReportedProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
    type: Joi.string().required()
  }),
};

const denyReportedProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
    type: Joi.string().required()
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getManagedProducts,
  reportProduct,
  acceptReportedProduct,
  denyReportedProduct
};
