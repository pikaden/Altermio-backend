const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productListController = require('../../controllers/productList.controller');
const productListValidation = require('../../validations/productList.validation');

const router = express.Router();

// only admin can create, update productList,
// if admin delete productList, push products in old product list to new product list named 'Other'
// everyone can get productLists, productList

router
  .route('/')
  .post(
    auth('manageProductList'),
    validate(productListValidation.createProductList),
    productListController.createProductList
  )
  .get(productListController.getProductLists);

router
  .route('/manage/:productListId')
  .get(validate(productListValidation.getProductList), productListController.getProductsByProductListId)
  .patch(
    auth('manageProductList'),
    validate(productListValidation.updateProductList),
    productListController.updateProductList
  )
  .delete(
    auth('manageProductList'),
    validate(productListValidation.deleteProductList),
    productListController.deleteProductList
  );

router
  .route('/:productListName')
  .get(validate(productListValidation.getProductListByName), productListController.getProductListByName);

module.exports = router;
