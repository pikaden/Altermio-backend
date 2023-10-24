const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const walletController = require('../../controllers/wallet.controller');
const walletValidation = require('../../validations/wallet.validation')
const router = express.Router();

router.route('/payment')
.get(walletController.getWalletByUserId)
.post(auth('addBalance'), validate(walletValidation.addBalance), walletController.addBalance);

router.route('/vnpayIpn/:userId').get(validate(walletValidation.returnIpn), walletController.returnIpn);

// router.route('/transfer').post(auth('transfer'), validate(walletValidation.transfer), walletController.transferMoneyById)

// router.route('/claim')

// router.route('/createwallet/:userId').post(walletController.createWallet);

module.exports = router;
