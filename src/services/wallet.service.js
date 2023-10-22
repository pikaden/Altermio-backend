let express = require('express');
const httpStatus = require('http-status');
const userService = require('./user.service');
const request = require('request');
const moment = require('moment');
const ApiError = require('../utils/ApiError');
const { Wallet } = require('../models');
const jwt = require('jsonwebtoken');
const configVNP = require('../config/default.json');
const config = require('../config/config');

const createWallet = async (userId) => {
  return Wallet.create({ coin: '0', userId: userId });
};

const getWalletById = async (userId) => {
  return Wallet.findOne({ userId: userId });
};

const addBalance = async (userId, amount) => {
  console.log(userId, amount);
  const userCoin = await getWalletById(userId);
  const update = {
    $inc: {
      coin: amount,
    },
  };
  const wallet = await Wallet.findByIdAndUpdate({ _id: userCoin._id }, update);
  return wallet;
};

const addBalanceByBank = async (accessTokenFromHeader, req, res) => {

  const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
  const userId = payload.sub;
  
  process.env.TZ = 'Asia/Ho_Chi_Minh';

  let date = new Date();
  let createDate = moment(date).format('YYYYMMDDHHmmss');

  let ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let tmnCode = configVNP.vnp_TmnCode;
  let secretKey = configVNP.vnp_HashSecret;
  let vnpUrl = configVNP.vnp_Url;
  let returnUrl = configVNP.vnp_ReturnUrl;

  let orderId = moment(date).format('DDHHmmss');
  let amount = req.body.amount;
  let bankCode = req.body.bankCode;

  let locale = 'vn';
  let currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl+`/${userId}`;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require('crypto');
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

  console.log(vnpUrl);
  res.redirect(vnpUrl);
};

const returnIpn = async (req, res) => {

  const userId = req.params.userId

  let vnp_Params = req.query;
  let secureHash = vnp_Params['vnp_SecureHash'];
  let secretKey = configVNP.vnp_HashSecret;
  let orderId = vnp_Params['vnp_TxnRef'];
  let rspCode = vnp_Params['vnp_ResponseCode'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require('crypto');
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

  let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if (secureHash === signed) {
    //kiểm tra checksum
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus == '0') {
          //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
          if (rspCode == '00') {
            // get user ID by token right here

            const wallet = addBalance(userId, vnp_Params.vnp_Amount/100);
            res.status(200).json({ RspCode: '00', Message: 'Success' });
          } else {
            //that bai
            //paymentStatus = '2'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
            res.status(200).json({ RspCode: '00', Message: 'Success' });
          }
        } else {
          res.status(200).json({
            RspCode: '02',
            Message: 'This order has been updated to the payment status',
          });
        }
      } else {
        res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
      }
    } else {
      res.status(200).json({ RspCode: '01', Message: 'Order not found' });
    }
  } else {
    res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
  }
};



function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

module.exports = {
  createWallet,
  getWalletById,
  addBalance,
  addBalanceByBank,
  returnIpn,
};
