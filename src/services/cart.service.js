/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Cart } = require('../models');


/**
 * Add to cart
 * @param {ObjectId} customerId 
 * @param {ObjectId} productId 
 * @returns {Promise<Cart>}
 */
// const addToCart = async (customerId, productId) => {
//     if (Cart.find)
// }


/**
 * Get cart by id
 * @param {ObjectId} id 
 * @returns {Promise<Cart>}
 */
const getCartByUserId = async (id) => {
    return Cart.find({ customerId: id});
  }

module.exports = {
    getCartByUserId,
}
  
