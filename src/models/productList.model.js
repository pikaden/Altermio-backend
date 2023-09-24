const mongoose = require('mongoose');

const productListSchema = mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    categoryName: {
        type: String,
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, { timestamps: true }
)

/**
 * @typedef ProductList
 */
const ProductList = mongoose.model('ProductList', productListSchema);

module.exports = ProductList;