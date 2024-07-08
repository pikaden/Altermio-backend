const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { activateStatus } = require('../config/activate');

const productSchema = mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'ProductList',
    },
    price: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
      },
    ],
    verify: {
      type: String,
      enum: activateStatus,
      default: 'deny',
    },
    activate: {
      type: String,
      enum: activateStatus,
      default: 'accept',
    },
    state: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

productSchema.pre('remove', function (next) {
  const product = this;
  // Remove all the productList docs that reference the removed product.
  product
    .model('ProductList')
    .update({ products: product._id }, { $pull: { products: product._id } }, { multi: true }, next);
});

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
