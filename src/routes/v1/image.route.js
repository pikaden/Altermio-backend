const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const imageController = require('../../controllers/image.controller');
const router = express.Router();

router
    .route('/:imageId')
    .get(imageController.getImageById)

router
    .route('/singleFile/upload')
    .post(auth('uploadSingleFile'), imageController.handlerSingleUpload);

router
    .route('/multipleFiles/upload')
    .post(auth('uploadMultipleFiles'), imageController.handlerMultipleUploads);

router
    .route('/multipleFiles/delete')
    .delete(auth('deleteMultipleFiles'), imageController.handlerDeleteMultipleFile);

router
    .route('/singleFile/delete/:imageId')
    .delete(auth('deleteImage'), imageController.handlerDeleteSingleFile);

module.exports = router;