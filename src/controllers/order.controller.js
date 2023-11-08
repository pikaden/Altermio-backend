/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');

const createOrder = catchAsync(async (req, res) => {
    const accessTokenFromHeader = req.headers.access_token;
        if (accessTokenFromHeader === '') {
            throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
        }
    const order = await orderService.createOrder(accessTokenFromHeader, req.body.items);
    if (!order) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cant create order');
      }
  res.send(order);
  });

  const cancelOrder = catchAsync(async (req, res) => {
    const accessTokenFromHeader = req.headers.access_token;
        if (accessTokenFromHeader === '') {
            throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
        }
    const order = await orderService.cancelOrder(accessTokenFromHeader, req.body.orderId);
    if (!order) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cant cancel order');
      }
  res.send(order);
  });

  const getOrderByUserId = catchAsync(async (req, res) => {
    const accessTokenFromHeader = req.headers.access_token;
        if (accessTokenFromHeader === '') {
            throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
        }
    const order = await orderService.getOrderByUserId(accessTokenFromHeader);
  res.send(order);
  });

  const getOrderById = catchAsync(async (req, res) => {
    const accessTokenFromHeader = req.headers.access_token;
        if (accessTokenFromHeader === '') {
            throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
        }
    const order = await orderService.getOrderById(req.params.orderId);
  res.send(order);
  });

module.exports = {
    createOrder,
    cancelOrder,
    getOrderByUserId,
    getOrderById
}