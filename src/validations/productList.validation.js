const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createProductList = {
    body: Joi.object().keys({
        categoryName: Joi.string().required()
    }),
};

const getProductList = {
    params: Joi.object().keys({
        productListId: Joi.string().custom(objectId),
    }),
};

const updateProductList = {
    params: Joi.object().keys({
        productListId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            categoryName: Joi.string().required()
        })
        .min(1),
};

const deleteProductList = {
    params: Joi.object().keys({
        productListId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createProductList,
    getProductList,
    updateProductList,
    deleteProductList,
};
