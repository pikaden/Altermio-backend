const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cartService } = require('../services');

const getCartByUserId = catchAsync(async (req, res) => {
  const accessTokenFromHeader = req.headers.access_token;
  if (accessTokenFromHeader === '') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
  }
  const cart = await cartService.getCartByUserId(accessTokenFromHeader);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your cart is empty');
  }
  res.send(cart);
});

const addToCart = catchAsync(async (req, res) => {
  const accessTokenFromHeader = req.headers.access_token;
  if (accessTokenFromHeader === '') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
  }
  const cart = await cartService.addToCart(accessTokenFromHeader, req.body.productId);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your cart is empty');
  }
  res.send(cart);
});

const removeFromCart = catchAsync(async (req, res) => {
  const accessTokenFromHeader = req.headers.access_token;
  if (accessTokenFromHeader === '') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
  }

  const removedProductId = req.body.productId;
  const cart = await cartService.removeFromCart(accessTokenFromHeader, removedProductId);
  res.send(cart);
});

const clearCart = catchAsync(async (req, res) => {
  const accessTokenFromHeader = req.headers.access_token;
  if (accessTokenFromHeader === '') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
  }

  const cart = await cartService.clearCart(accessTokenFromHeader);

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your cart is empty');
  }

  res.send(cart);
});

module.exports = {
  getCartByUserId,
  addToCart,
  removeFromCart,
  clearCart,
};
