/* eslint-disable prettier/prettier */
const express = require('express');
const cartController = require ("../../controllers/cart.controller")

const router = express.Router();

router
  .route('/')
  // userId here can be sellerId or buyerId
  .get(cartController.getCartByUserId)
  .post(cartController.addToCart)
  .delete(cartController.removeFromCart);
router
  .route('/clear')
  .delete(cartController.clearCart);

module.exports = router;