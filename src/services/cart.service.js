const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { Cart } = require('../models');

/**
 * Get cart by id
 * @param {ObjectId} id
 * @returns {Promise<Cart>}
 */
const getCartByUserId = async (accessTokenFromHeader) => {
  const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
  const id = payload.sub;
  return Cart.find({ customerId: id });
};

/**
 * Add to cart
 * @param {ObjectId} productId
 * @returns {Promise<Cart>}
 */
const addToCart = async (accessTokenFromHeader, productId) => {
  const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
  const customerId = payload.sub;
  try {
    const existingCart = await Cart.findOne({ customerId });

    if (existingCart) {
      // Kiểm tra xem productId đã có trong mảng productIds chưa
      if (!existingCart.productId.includes(productId)) {
        existingCart.productId.push(productId);
        await existingCart.save();
      }
      return existingCart;
    }

    const newCart = new Cart({
      customerId,
      productId: [productId],
    });
    await newCart.save();
    return newCart;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Remove from cart
 * @param {ObjectId} productId
 * @returns {Promise<Cart>}
 */
const removeFromCart = async (accessTokenFromHeader, productId) => {
  const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
  const customerId = payload.sub;
  try {
    const existingCart = await Cart.findOne({ customerId });

    if (!existingCart) {
      throw new Error('Cart not found');
    }

    // Check if the productId exists in the productIds array
    const index = existingCart.productId.indexOf(productId);
    if (index !== -1) {
      // Remove the productId from the array
      existingCart.productId.splice(index, 1);
      await existingCart.save();
    } else {
      throw new Error('Product not found in the cart');
    }
    return existingCart;
  } catch (error) {
    throw new Error(error.message);
  }
};

const clearCart = async (accessTokenFromHeader) => {
  const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
  const customerId = payload.sub;

  try {
    const existingCart = await Cart.findOne({ customerId });

    if (!existingCart) {
      throw new Error('Cart not found');
    }

    // Clear the productIds array (set it to an empty array)
    existingCart.productId = [];
    await existingCart.save();
    return existingCart;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getCartByUserId,
  addToCart,
  removeFromCart,
  clearCart,
};
