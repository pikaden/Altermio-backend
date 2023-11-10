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
  .route('/courierAccept')
  .post(orderController.courierAcceptOrder);
router
  .route('/courierDelivered')
  .post(orderController.deliveredOrder);
router
  .route('/acceptOrder')
  .post(orderController.acceptOrder);
router
  .route('/refundOrder')
  .post(orderController.refundOrder);
router
  .route('/acceptRefund')
  .post(orderController.acceptRefund);
router
  .route('/denyRefund')
  .post(orderController.denyRefund);
router
  .route('/completeOrder')
  .post(orderController.completeOrder);
router
  .route('/deliveringOrder')
  .get(orderController.getDeliveringOrder);
router
  .route('/forSeller')
  .get(orderController.getOrderForSeller)
router
  .route('/:orderId')
  .get(orderController.getOrderById)

module.exports = router;