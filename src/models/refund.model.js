const mongoose = require('mongoose');

const refundSchema = mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    status: {
        type: String,
        required: true,
    },
}, { timestamps: true }
)

/**
 * @typedef Refund
 */
const Refund = mongoose.model('Refund', refundSchema);

module.exports = Refund;