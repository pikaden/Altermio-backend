/* eslint-disable prettier/prettier */
const express = require('express');
const orderController = require ("../../controllers/order.controller")

const router = express.Router();

router
  .route('/')
  .post(orderController.createOrder)
  .get(orderController.getOrderByUserId)
router
  .route('/cancelOrder')
  .post(orderController.cancelOrder);
router
  .route('/courier')
  .get(orderController.getOrderForCourier);
router
  .route('/acceptOrder')
  .post(orderController.acceptOrder);
router
  .route('/forSeller')
  .get(orderController.getOrderForSeller)
router
  .route('/:orderId')
  .get(orderController.getOrderById)

module.exports = router;