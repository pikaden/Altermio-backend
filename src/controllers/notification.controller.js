/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');

  const createNotification = catchAsync(async (req, res) => {
    const accessTokenFromHeader = req.headers.access_token;
        if (accessTokenFromHeader === '') {
            throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
        }
    
    const notification  = await notificationService.createNotification(req.body,accessTokenFromHeader);
    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Cant notify');
    }
    res.send(notification);
  });

  const getNotificationByReceiverId = catchAsync(async (req, res) => {
    const accessTokenFromHeader = req.headers.access_token;
        if (accessTokenFromHeader === '') {
            throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
        }
    
        const notifications  = await notificationService.getNotificationByReceiverId(accessTokenFromHeader);
    if (!notifications) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Cant notify');
    }
    res.send(notifications);
  });
module.exports = {
  createNotification,
  getNotificationByReceiverId
}