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
        const orders = [];
        for (const productId of items) {
            const pruduct = await Product.findById(productId)
            const newOrder = new Order({
                customerId: id,
                orderDate: new Date(),
                status: "Pending",
                item: productId, 
                totalPrice: pruduct.price
            });
            const savedOrder = await newOrder.save();
            orders.push(savedOrder);
        }
    return orders
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error occurs when create order');
    }
};

const cancelOrder = async (accessTokenFromHeader, orderId, status = 'Canceled') => {
    try {
        const foundOrder = await Order.findById(orderId);
        
        if (!foundOrder) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Order not found1');
        }
        foundOrder.status = status;
        const updatedOrder = await foundOrder.save();
        walletService.addBalance(foundOrder.customerId, foundOrder.totalPrice)
        return updatedOrder;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Order not found2');
    }
};

const getOrderByUserId = async (accessTokenFromHeader) => {
    const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
    const id = payload.sub;
    const orders = await Order.find({ customerId: id }).populate('item').exec();
    return orders
    }
   
const getOrderById = async (orderId) => {
    try {
        const order = await Order.findById(orderId).populate('item').exec();
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    } catch (error) {
        console.error('Error getting order by ID:', error);
        throw error;
    }
};

const getOrderBySellerId = async (accessTokenFromHeader) => {
    try {
        const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
        const id = payload.sub;

        const products = await Product.find({ sellerId: id }, '_id');
        const productIds = products.map(product => product._id);

        const orders = await Order.find({ item: { $in: productIds }, $or: [
            { status: "Pending" },
            { status: "Refund" }
          ]}).populate('item').exec();
        
        return orders;
    } catch (err) {
        console.error(err);
        // Xử lý lỗi ở đây
        throw err;
    }
};

const changeOrderStatus = async (orderId, status = 'Denied') => {
    
    try {
        const foundOrder = await Order.findById(orderId).populate('item').exec();
        if (!foundOrder) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Order not found1');
        }
        foundOrder.status = status;
        if (status === 'Done'){
            walletService.addBalance(foundOrder.item.sellerId, foundOrder.totalPrice)
        }
        const updatedOrder = await foundOrder.save();
        return updatedOrder;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Order not found2');
    }
};

const getOrderForCourier = async (status = 'Accepted') => {
    try {
        const orders = await Order.find({ status }).populate('item').populate('customerId').exec();
        return orders;
    } catch (err) {
        console.error(err);
        // Xử lý lỗi ở đây
        throw err;
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
   getOrderById,
   getOrderBySellerId,
   changeOrderStatus,
   getOrderForCourier
   
}
   



