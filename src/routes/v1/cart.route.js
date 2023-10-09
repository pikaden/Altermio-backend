/* eslint-disable prettier/prettier */
const express = require('express');
const cartController = require ("../../controllers/cart.controller")

const router = express.Router();

router
  .route('/user/:userId')
  // userId here can be sellerId or buyerId
  .get(cartController.getCartByUserId)
  .post(cartController.addToCart)
  

module.exports = router;