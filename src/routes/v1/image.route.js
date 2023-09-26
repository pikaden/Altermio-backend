const express = require('express');
const validate = require('../../middlewares/validate');
const imageController = require('../../controllers/image.controller');
const router = express.Router();

router.post('/uploadSingleFile', imageController.handlerSingleUpload);
router.post('/uploadMultipleFiles', imageController.handlerMultipleUploads);

module.exports = router;