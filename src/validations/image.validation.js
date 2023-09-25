const Joi = require('joi');

const uploadImage = {
    files: Joi.any()
}

module.exports = {
    uploadImage
} 