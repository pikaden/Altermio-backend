const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true,
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    isVerified: {
        type: Boolean,
        default: false
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
        default: true
    }
}, { timestamps: true }
)

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;