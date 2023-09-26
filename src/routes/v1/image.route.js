const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const imageController = require('../../controllers/image.controller');
const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/uploadSingleFile', imageController.handler);

module.exports = router;