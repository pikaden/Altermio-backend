const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');

const createProduct = catchAsync(async (req, res) => {
    try {
        // must use Multer to receive multipart/form-data

        // get access token from headers
        const accessTokenFromHeader = req.headers.access_token;
        if (accessTokenFromHeader == '') {
            throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
        }

        // await create images in cloudinary,
        // then save returned image id and public_id,
        // then create product with other text field in productBody
        const imageList = await productService.handlerMultipleUploadsProductImages(req, res);
        const product = await productService.createProduct(accessTokenFromHeader, imageList, req.body);
        res.status(httpStatus.CREATED).send(product);
    } catch (error) {
        console.log(error);
        res.status(httpStatus.NO_CONTENT).send({
            message: error.message,
        });
    }
});

const getProducts = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['category', 'state', 'brand']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await productService.queryProducts(filter, options);
    res.send(result);
});

const getProduct = catchAsync(async (req, res) => {
    const product = await productService.getProductById(req.params.productId);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    res.send(product);
});

// TODO: still update text, not update image list
const updateProduct = catchAsync(async (req, res) => {
    // get access token from headers
    const accessTokenFromHeader = req.headers.access_token;
    if (accessTokenFromHeader == '') {
        throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
    }

    const product = await productService.updateProductById(accessTokenFromHeader, req.params.productId, req.body);
    res.send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
    // get access token from headers
    const accessTokenFromHeader = req.headers.access_token;
    if (accessTokenFromHeader == '') {
        throw new ApiError(httpStatus.FORBIDDEN, 'Access token not found');
    }

    await productService.deleteProductById(accessTokenFromHeader, req.params.productId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
};