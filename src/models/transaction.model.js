const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    paymentDate: {
        type: Date,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        default: 0,
        required: true,
    },
    type: {
        type: Boolean,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    }
}, { timestamps: true }
)

/**
 * @typedef Transaction
 */
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;