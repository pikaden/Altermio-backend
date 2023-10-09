const { Image } = require("../models");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

/**
 * Get file from user and upload to cloud
 * @param {*} file 
 * @returns 
 */
const handleUpload = async (file) => {
    const res = await cloudinary.uploader.upload(file, {
        folder: "Altermio",
        resource_type: "auto"
    });
    return res;
}

/**
 * Create an image
 * @param {String} public_id 
 * @param {String} url 
 * @returns 
 */
const handleImageUpload = async (public_id, url) => {
    const image = await Image.create({
        public_id: public_id,
        url: url
    });
    return image;
}

// /**
//  * Delete file on cloud
//  * @param {*} fileToDelete 
//  * @returns 
//  */
// const handleDelete = async (fileToDelete) => {
//     const res = await cloudinary.uploader.destroy(fileToDelete, (err, result) => {
//         console.log(result, err);
//     });
//     return res;
// }

/**
 * Delete file on cloudinary, 
 * then delete on database
 * @param {*} imageId 
 * @returns 
 */
const handleDelete = async (imageId) => {
    const image = await getImageById(imageId);
    const res = await cloudinary.uploader.destroy(image.public_id, (err, result) => {
        console.log(result, err);
    });
    await image.remove();
    return res;
}

/**
 * Get image by id
 * @param {ObjectId} id 
 * @returns {Promise<Image>}
 */
const getImageById = async (id) => {
    return Image.findById(id);
}

module.exports = {
    handleUpload,
    handleImageUpload,
    handleDelete,
    getImageById
}