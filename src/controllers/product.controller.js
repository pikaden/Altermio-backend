const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService, productListService } = require('../services');

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

        const productListId = req.body.productListId;

        // check product list exist
        const productList = await productListService.getProductListById(productListId);

        if (!productList) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Product list not found');
        }

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
    const filter = pick(req.query, ['category', 'brand']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await productService.queryProducts(filter, options);
    res.send(result);
});

const searchProduct = catchAsync(async (req, res) => {
    const keyword = pick(req.query, ['keyword']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await productService.searchProduct(keyword, options);
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

const getManagedProducts = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['verified', 'activate']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await productService.queryManagedProducts(filter, options);
    res.status(httpStatus.OK).send(result);
})

const reportProduct = catchAsync(async (req, res) => {
    const reportProduct = await productService.reportProduct(req.params.productId);
    res.status(httpStatus.OK).send(reportProduct);
});

const acceptReportedProduct = catchAsync(async (req, res) => {
    const acceptReportedProduct = await productService.acceptReportedProduct(req.params.type, req.params.productId);
    res.status(httpStatus.OK).send(acceptReportedProduct);
})

const denyReportedProduct = catchAsync(async (req, res) => {
    const denyReportedProduct = await productService.denyReportedProduct(req.params.type, req.params.productId);
    res.status(httpStatus.OK).send(denyReportedProduct);
})

const requestVerifyProduct = catchAsync(async (req, res) => {
    const requestVerifyProduct = await productService.requestVerifyProduct(req.params.productId);
    res.status(httpStatus.OK).send(requestVerifyProduct);
});

const acceptVerifyProduct = catchAsync(async (req, res) => {
    const acceptVerifyProduct = await productService.acceptVerifyProduct(req.params.type, req.params.productId);
    res.status(httpStatus.OK).send(acceptVerifyProduct);
})

const denyVerifyProduct = catchAsync(async (req, res) => {
    const denyVerifyProduct = await productService.denyVerifyProduct(req.params.type, req.params.productId);
    res.status(httpStatus.OK).send(denyVerifyProduct);
})

module.exports = {
    createProduct,
    getProducts,
    searchProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getManagedProducts,
    reportProduct,
    acceptReportedProduct,
    denyReportedProduct,
    requestVerifyProduct,
    acceptVerifyProduct,
    denyVerifyProduct
};