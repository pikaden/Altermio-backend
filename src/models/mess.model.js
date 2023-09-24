// TODO: do mess model

const mongoose = require('mongoose');

const messSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
    },
    readBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true }
)

/**
 * @typedef Mess
 */
const Mess = mongoose.model('Mess', messSchema);

module.exports = Mess;