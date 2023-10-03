const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    public_id: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
}, { timestamps: true }
)

// imageSchema.pre('remove', function (next) {
//     const image = this;
//     // Remove all the Product docs that reference the removed image.
//     image.model('User').update(
//         { images: image._id },
//         { $pull: { images: image._id } },
//         { multi: true },
//         next
//     );
// })

/**
 * @typedef Image
 */
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;