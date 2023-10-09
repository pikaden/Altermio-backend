/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cartService } = require('../services');

const getCartByUserId = catchAsync(async (req, res) => {
    const cart = await cartService.getCartByUserId(req.params.userId);
    if (!cart) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Your cart is empty');
    }
    res.send(cart);
  });

const addToCart = catchAsync(async (req, res) => {
    const cart = await cartService.addToCart(req.params.userId, req.body.productId);
    if (!cart) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Your cart is empty');
    }
    res.send(cart);
  });

module.exports = {
    getCartByUserId,
    addToCart
}