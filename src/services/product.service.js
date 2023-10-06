const httpStatus = require('http-status');
const { Product, Image } = require('../models');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { uploadFileMiddleware, multipleUploadsMiddleware } = require('../middlewares/uploadFile');
const { imageService, userService } = require('.');
const { handleUpload } = require('./image.service');

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (accessTokenFromHeader, imageList, productBody) => {
    // get userId from token
    const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
    const userId = payload.sub;

    productBody.sellerId = userId;
    productBody.images = imageList;
    return Product.create(productBody);
};

/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (filter, options) => {
    const products = await Product.paginate(filter, options);
    return products;
};

/**
 * Get product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
    return Product.findById(id);
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (accessTokenFromHeader, productId, updateBody) => {
    const product = await getProductById(productId);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }

    // get userId from token
    const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
    const userId = payload.sub;

    // only seller can update their own product
    if (userId == product.sellerId) {
        Object.assign(product, updateBody);
        await product.save();
        return product;
    } else throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to do this command');
};

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (accessTokenFromHeader, productId) => {
    const product = await getProductById(productId);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }

    // get userId from token
    const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
    const userId = payload.sub;

    const user = await userService.getUserById(userId);
    const userRole = user.role;

    // compare role product.sellerId and userId to delete
    if (userRole == 'admin' || userRole == 'moderator' || (userRole == 'user' && userId == product.sellerId)) {
        // get images to delete, query to get public_id
        const imageList = product.images;

        // map through images and create a promise array using cloudinary delete function
        await Promise.all(imageList.map(async (imageId) => {
            await imageService.handleDelete(imageId);
            await product.remove();
        }));
        return product;
    } else throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to do this command');
};

/**
 * upload multiple images to cloudinary,
 * then return imageList contains images id
 * @param {*} req 
 * @param {*} res 
 * @returns {List<Image>}
 */
const handlerMultipleUploadsProductImages = async (req, res) => {
    try {
        await uploadFileMiddleware(req, res, multipleUploadsMiddleware);

        let pictureFiles = req.files;
        if (!pictureFiles) return res.status(400).json({ message: "No picture attached!" });

        var imageList = [];

        // map through images and create a promise array using cloudinary upload function
        await Promise.all(pictureFiles.map(async (picture) => {
            const b64 = Buffer.from(picture.buffer).toString("base64");
            let dataURI = "data:" + picture.mimetype + ";base64," + b64;
            const cldRes = await handleUpload(dataURI);
            const image = await imageService.handleImageUpload(cldRes.public_id, cldRes.secure_url);
            imageList.push(image);
        }));

        return imageList;
    } catch (error) {
        console.log(error);
        res.status(httpStatus.NO_CONTENT).send({
            message: error.message,
        });
    }
}

module.exports = {
    createProduct,
    queryProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    handlerMultipleUploadsProductImages
};
