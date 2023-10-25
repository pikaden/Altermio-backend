const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');

const router = express.Router();

// everyone can get all products and specific product
// sellerId (owner), moderator and admin can delete product
// sellerId (owner) can update product

// only user can create product => send access token through header, should have images and must have text field
// user can report product, admin and moderator can accept, deny, get all reported products
// user can request verify product, admin and moderator can accept, deny, get all verify products

router
    .route('/')
    .post(auth('createProduct'), validate(productValidation.createProduct), productController.createProduct)
    .get(validate(productValidation.getProducts), productController.getProducts)

router
    .route('/search')
    .get(validate(productValidation.searchProduct), productController.searchProduct)

router
    .route('/:productId')
    .get(validate(productValidation.getProduct), productController.getProduct)
    .put(auth('updateProduct'), validate(productValidation.updateProduct), productController.updateProduct)
    .delete(auth('deleteProduct'), validate(productValidation.deleteProduct), productController.deleteProduct)

router
    .route('/manageProducts/all')
    .get(auth('manageProducts'), validate(productValidation.getManagedProducts), productController.getManagedProducts)

router
    .route('/reportProducts/:productId')
    .patch(auth('reportProduct'), validate(productValidation.reportProduct), productController.reportProduct)

router
    .route('/manageReportedProducts/:productId/:type')
    .put(auth('manageProducts'), validate(productValidation.acceptReportedProduct), productController.acceptReportedProduct)
    .patch(auth('manageProducts'), validate(productValidation.denyReportedProduct), productController.denyReportedProduct)

// same with report product
router
    .route('/requestVerifyProduct/:productId')
    .patch(auth('reportProduct'), validate(productValidation.reportProduct), productController.requestVerifyProduct)

router
    .route('/manageVerifyProducts/:productId/:type')
    .put(auth('manageProducts'), validate(productValidation.acceptReportedProduct), productController.acceptVerifyProduct)
    .patch(auth('manageProducts'), validate(productValidation.denyReportedProduct), productController.denyVerifyProduct)

module.exports = router;