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

router
    .route('/')
    .post(auth('createProduct'), validate(productValidation.createProduct), productController.createProduct)
    .get(validate(productValidation.getProducts), productController.getProducts)

router
    .route('/:productId')    
    .get(validate(productValidation.getProduct), productController.getProduct)
    .put(auth('updateProduct'), validate(productValidation.updateProduct), productController.updateProduct)
    .delete(auth('deleteProduct'), validate(productValidation.deleteProduct), productController.deleteProduct)

module.exports = router;