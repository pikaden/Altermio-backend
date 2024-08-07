const mongoose = require('mongoose');
const { toJSON, paginateRefArrays } = require('./plugins');

const productListSchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
productListSchema.plugin(toJSON);
productListSchema.plugin(paginateRefArrays);

productListSchema.pre('remove', async function (next) {
  const oldProductList = this;

  // push products in old product list to new product list named 'Other'
  ProductList.findOneAndUpdate(
    { categoryName: 'Other' },
    { $push: { products: oldProductList.products } },
    function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log(success);
      }
    }
  );
  next();
});

/**
 * @typedef ProductList
 */
const ProductList = mongoose.model('ProductList', productListSchema);

module.exports = ProductList;
