/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const { Product, Image, ProductList } = require('../models');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { uploadFileMiddleware, multipleUploadsMiddleware } = require('../middlewares/uploadFile');
const { imageService, userService } = require('.');
const { handleUpload } = require('./image.service');
const { activateStatus } = require('../config/activate');

/**
 * Create a product, and add product to productList
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (accessTokenFromHeader, imageList, productBody) => {
    // get userId from token
    const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
    const userId = payload.sub;

    productBody.sellerId = userId;
    productBody.images = imageList;

    const productListCategory = productBody.productListCategory;
    productBody.productListCategory = undefined;
    const product = await Product.create(productBody);

    // add to product list
    await ProductList.findOneAndUpdate(
        { 'categoryName': productListCategory },
        { $addToSet: { 'products': product.id } },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        });
    return product;
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

/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryManagedProducts = async (filter, options) => {
    const products = await Product.paginate(filter, options);
    return products;
};

// report -> product.activate = pending,
// accept -> product.activate = accept, button accept -> product is deactive
// deny -> product.activate = deny, button deny -> product is active

/**
 * report product from user to moderator and admin
 * @param {ObjectId} productId 
 * @returns {Promise<product>}
 */
const reportProduct = async (productId) => {
    const product = await getProductById(productId);

    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
    }
    if (product.activate == activateStatus.PENDING) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'product has been reported');
    }

    product.activate = activateStatus.PENDING;
    await product.save();
    return product;
}

/**
 * accept report product, meaning that product is deactivated
 * @param {string} type 
 * @param {ObjectId} productId 
 * @returns {Promise<product>}
 */
const acceptReportedProduct = async (type, productId) => {
    const product = await getProductById(productId);

    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
    }
    if (product.activate == activateStatus.DENY) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'product has already been deactivated');
    }
    if (type != activateStatus.ACCEPT) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Type report is not right');
    }

    product.activate = activateStatus.DENY;
    await product.save();
    return product;
}

/**
 * deny report product, meaning that product is activated again
 * @param {string} type 
 * @param {ObjectId} productId 
 * @returns {Promise<product>}
 */
const denyReportedProduct = async (type, productId) => {
    const product = await getProductById(productId);

    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
    }
    if (product.activate == activateStatus.ACCEPT) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'product has already been activated');
    }
    if (type != activateStatus.DENY) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Type report is not right');
    }

    product.activate = activateStatus.ACCEPT;
    await product.save();
    return product;
}

// request verify -> product.verify = pending,
// accept -> product.verify = accept, button accept -> product is verified (accept)
// deny -> product.verify = deny, button deny -> product is not verified (deny)

/**
 * request verify product from user to moderator and admin
 * @param {ObjectId} productId 
 * @returns {Promise<product>}
 */
const requestVerifyProduct = async (productId) => {
    const product = await getProductById(productId);

    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
    }
    if (product.verify == activateStatus.PENDING) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'product has been reported');
    }

    product.verify = activateStatus.PENDING;
    await product.save();
    return product;
}

/**
 * accept verify product request, meaning that product is verified
 * @param {string} type 
 * @param {ObjectId} productId 
 * @returns {Promise<product>}
 */
const acceptVerifyProduct = async (type, productId) => {
    const product = await getProductById(productId);

    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
    }
    if (product.verify == activateStatus.ACCEPT) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'product verify request has already been accepted');
    }
    if (type != activateStatus.ACCEPT) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Type is not right');
    }

    product.verify = activateStatus.ACCEPT;
    await product.save();
    return product;
}

/**
 * deny verify product request, meaning that product is not verified again
 * @param {string} type 
 * @param {ObjectId} productId 
 * @returns {Promise<product>}
 */
const denyVerifyProduct = async (type, productId) => {
    const product = await getProductById(productId);

    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
    }
    if (product.verify == activateStatus.DENY) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'product verify request has already been denied');
    }
    if (type != activateStatus.DENY) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Type is not right');
    }

    product.verify = activateStatus.DENY;
    await product.save();
    return product;
}

module.exports = {
    createProduct,
    queryProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    handlerMultipleUploadsProductImages,
    queryManagedProducts,
    reportProduct,
    acceptReportedProduct,
    denyReportedProduct,
    requestVerifyProduct,
    acceptVerifyProduct,
    denyVerifyProduct
};
