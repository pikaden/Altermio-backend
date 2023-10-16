/* eslint-disable prettier/prettier */
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { Notification } = require('../models');



const createNotification = async (notificationData, accessToken) => {
  const payload = jwt.verify(accessToken, config.jwt.secret);
  const userId = payload.sub;
  notificationData.senderId = userId;
  const notification = await Notification.create(notificationData);
  return notification;
};

const getNotificationByReceiverId = async (accessToken) => {
    const payload = jwt.verify(accessToken, config.jwt.secret);
    const userId = payload.sub;
    const notifications = await Notification.find({ receiverId: userId });
    await Notification.updateMany({ receiverId: userId }, { isRead: true });
    return notifications;
   
  };





module.exports = {
  createNotification,
  getNotificationByReceiverId
};
