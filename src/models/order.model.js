const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    totalPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);

/**
 * @typedef Order
 */
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
