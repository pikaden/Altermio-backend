const mongoose = require('mongoose');

const messSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true }
)

/**
 * @typedef Mess
 */
const Mess = mongoose.model('Mess', messSchema);

module.exports = Mess;