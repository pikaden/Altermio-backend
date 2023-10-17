const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const walletController = require('../../controllers/wallet.controller');
const router = express.Router();

router.route('/payment').get(walletController.getWalletByUserId).post(walletController.addBalance);

router.route('/vnpayIpn').get(walletController.returnIpn);

router.route('/createwallet/:userId').post(walletController.createWallet);

module.exports = router;
