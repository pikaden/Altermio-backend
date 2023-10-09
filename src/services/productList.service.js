const httpStatus = require('http-status');
const { ProductList } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a product list
 * @param {Object} productListBody
 * @returns {Promise<ProductList>}
 */
const createProductList = async (productListBody) => {
    // check productList has been duplicated or not
    const productList = await queryProductList();

    if (productList.categoryName == productListBody.categoryName) {
        throw new ApiError(httpStatus.NOT_FOUND, 'product list has been duplicated');
    }

    return ProductList.create(productListBody);
};

const queryProductList = async () => {
    const productList = await ProductList.find();
    return productList;
};

/**
 * Get productList by id
 * @param {ObjectId} id
 * @returns {Promise<ProductList>}
 */
const getProductListById = async (id) => {
    return ProductList.findById(id);
};

/**
 * Update productList by id
 * @param {ObjectId} productListId
 * @param {Object} updateBody
 * @returns {Promise<ProductList>}
 */
const updateProductListById = async (productListId, updateBody) => {
    const productList = await getProductListById(productListId);
    if (!productList) {
        throw new ApiError(httpStatus.NOT_FOUND, 'product list not found');
    }
    Object.assign(productList, updateBody);
    await productList.save();
    return productList;
};

/**
 * Delete productList by id
 * @param {ObjectId} productListId
 * @returns {Promise<ProductList>}
 */
const deleteProductListById = async (productListId) => {
    const productList = await getProductListById(productListId);
    if (!productList) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product list not found');
    }
    await productList.remove();
    return productList;
};

module.exports = {
    createProductList,
    queryProductList,
    getProductListById,
    updateProductListById,
    deleteProductListById
};
