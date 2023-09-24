const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    url: {
        type: String,
        required: true,
    }
}, { timestamps: true }
)

/**
 * @typedef Image
 */
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;