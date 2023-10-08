const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productListService } = require('../services');

const createProductList = catchAsync(async (req, res) => {
    const product = await productListService.createProductList(req.body);
    res.status(httpStatus.CREATED).send(product);
});

const getProductLists = catchAsync(async (req, res) => {
    const result = await productListService.queryProductList();
    res.send(result);
});

const getProductList = catchAsync(async (req, res) => {
    const productList = await productListService.getProductListById(req.params.productListId);
    if (!productList) {
        throw new ApiError(httpStatus.NOT_FOUND, 'product list not found');
    }
    res.send(productList);
});

const updateProductList = catchAsync(async (req, res) => {
    const productList = await productListService.updateProductListById(req.params.productListId, req.body);
    res.send(productList);
});

const deleteProductList = catchAsync(async (req, res) => {
    await productListService.deleteProductListById(req.params.productListId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createProductList,
    getProductLists,
    getProductList,
    updateProductList,
    deleteProductList
};