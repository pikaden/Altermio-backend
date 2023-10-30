/* eslint-disable prettier/prettier */
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const { Order, Product, User } = require('../models');
const walletService = require('./wallet.service');

const getTotalPriceOfItems = async (itemIds) => {
    try {
      
      // Fetch items from MongoDB based on the provided item IDs
      const items = await Product.find({ _id: { $in: itemIds } });
  
      // Calculate the total price by summing up the 'price' field
      const totalPrice = items.reduce((acc, item) => acc + item.price, 0);
  
      return totalPrice;
    } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error occurs when calculating total price');
    }
  };

const createOrder = async (accessTokenFromHeader, items) => {
    const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
    const id = payload.sub;
    const totalPrice = await getTotalPriceOfItems(items)
    await walletService.transferMoneyById(id,totalPrice)
    try {
        const newOrder = new Order({
            customerId: id,
            orderDate: new Date(),
            status: "Pending",
            items,
            totalPrice
        });
        await newOrder.save();
        return newOrder;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error occurs when create order');
    }
};

const cancelOrder = async (accessTokenFromHeader, orderId) => {
    const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
    const id = payload.sub;
    const currentUser = await User.findById(id)
    try {
        const foundOrder = await Order.findById(orderId);
        if (id != foundOrder.customerId && currentUser.role != 'admin'){
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Not permitted');
        }
        if (!foundOrder) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Order not found1');
        }
        foundOrder.status = 'canceled';
        const updatedOrder = await foundOrder.save();
        return updatedOrder;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Order not found2');
    }
};

const getOrderByUserId = async (accessTokenFromHeader) => {
    const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
    const id = payload.sub;
      return Order.find({ customerId: id});
    }
   
const getOrderById = async (orderId) => {
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    } catch (error) {
        console.error('Error getting order by ID:', error);
        throw error;
    }
};


// const deleteOrder = async (orderId) => {
//     try {
//         const order = await Order.findByIdAndRemove(orderId);
//         if (!order) {
//             throw new Error('Order not found');
//         }
//         return order;
//     } catch (error) {
//         console.error('Error deleting order:', error);
//         throw error;
//     }
// };


module.exports = {
   createOrder,
   cancelOrder,
   getOrderByUserId,
   getOrderById
}
   



