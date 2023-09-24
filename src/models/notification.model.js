const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    referEntityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'notifyModel'
    },
    notifyModel: {
        type: String,
        required: true,
        enum: ['Product', 'Comment', 'Refund']
    },
    type: {
        type: String,
        enum: ['BUY', 'SELL', 'BAN', 'COMMENT'],
        required: true
    },
    status: {
        type: String,
        enum: ['SUCCEED', 'FAILED', 'ACCEPTED', 'DENIED', 'BANNED'],
        required: true
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    icon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }
}, { timestamps: true }
)

/**
 * @typedef Notification
 */
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;