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
  const acceptOrder = catchAsync(async (req, res) => {
    const accessTokenFromHeader = req.headers.access_token;
        if (accessTokenFromHeader === '') {
            throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
        }
    const order = await orderService.changeOrderStatus(req.body.orderId, 'Accepted');
    if (!order) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cant cancel order');
      }
  res.send(order);
  });

  const courierAcceptOrder = catchAsync(async (req, res) => {
    const accessTokenFromHeader = req.headers.access_token;
        if (accessTokenFromHeader === '') {
            throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
        }
    const order = await orderService.changeOrderStatus(req.body.orderId, 'Delivering');
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
    const orders = await orderService.getOrderByUserId(accessTokenFromHeader);
  res.send(orders);
  });
  
  const getOrderForCourier= catchAsync(async (req, res) => {
    const accessTokenFromHeader = req.headers.access_token;
        if (accessTokenFromHeader === '') {
            throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
        }
    const orders = await orderService.getOrderForCourier();
  res.send(orders);
  });

  const getOrderById = catchAsync(async (req, res) => {
    const accessTokenFromHeader = req.headers.access_token;
        if (accessTokenFromHeader === '') {
            throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
        }
    const order = await orderService.getOrderById(req.params.orderId);
    res.send(order);
  });

  const getOrderForSeller = catchAsync(async (req, res) => {
    const accessTokenFromHeader = req.headers.access_token;
        if (accessTokenFromHeader === '') {
            throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
        }
    const orders = await orderService.getOrderBySellerId(accessTokenFromHeader);
    res.send(orders);
  });



module.exports = {
    createOrder,
    cancelOrder,
    getOrderByUserId,
    getOrderById,
    getOrderForSeller,
    acceptOrder,
    courierAcceptOrder,
    getOrderForCourier
}