/* eslint-disable prettier/prettier */
const express = require('express');
const notificationController = require ("../../controllers/notification.controller")

const router = express.Router();

router
  .route('/')
  .post(notificationController.createNotification)
  .get(notificationController.getNotificationByReceiverId)


module.exports = router;