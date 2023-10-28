/* eslint-disable global-require */
const moment = require('moment');
const jwt = require('jsonwebtoken');
const { Wallet } = require('../models');
const configVNP = require('../config/default.json');
const config = require('../config/config');

const createWallet = async (userId) => {
  return Wallet.create({ coin: '0', userId });
};

const claimMoneyById = async (accessTokenFromHeader, req) => {
  const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
  const sellerId = payload.sub;
  // eslint-disable-next-line no-use-before-define
  const sellerWallet = await getWalletById(sellerId);
  const { amount } = req.body;
  const increaseSeller = {
    $inc: {
      coin: amount,
    },
  };
  // eslint-disable-next-line no-return-assign, no-undef
  return (increateSellerBalance = await Wallet.findByIdAndUpdate({ _id: sellerWallet._id }, increaseSeller));
};

const transferMoneyById = async (accessTokenFromHeader, req, res) => {
  const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
  const buyerId = payload.sub;
  const { amount } = req.body;
  // eslint-disable-next-line no-use-before-define
  const buyerWallet = await getWalletById(buyerId);
  if (buyerWallet.coin < amount) {
    res.status(400).json({ message: 'Insufficient balance' });
    return;
  }
  const subtractBuyer = {
    $inc: {
      coin: -amount,
    },
  };
  // eslint-disable-next-line no-return-assign, no-undef
  return (subtractBuyerBalance = await Wallet.findByIdAndUpdate({ _id: buyerWallet._id }, subtractBuyer));
};

const getWalletByToken = async (accessTokenFromHeader) => {
  const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
  const userId = payload.sub;
  return Wallet.findOne({ userId });
};

const getWalletById = async (userId) => {
  return Wallet.findOne({ userId });
};

const addBalance = async (userId, amount) => {
  const userWallet = await getWalletById(userId);
  const update = {
    $inc: {
      coin: amount,
    },
  };
  const wallet = await Wallet.findByIdAndUpdate({ _id: userWallet._id }, update);
  return wallet;
};

const addBalanceByBank = async (accessTokenFromHeader, req, res) => {
  const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
  const userId = payload.sub;

  process.env.TZ = 'Asia/Ho_Chi_Minh';

  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');

  const ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const tmnCode = configVNP.vnp_TmnCode;
  const secretKey = configVNP.vnp_HashSecret;
  let vnpUrl = configVNP.vnp_Url;
  const returnUrl = configVNP.vnp_ReturnUrl;

  const orderId = moment(date).format('DDHHmmss');
  const { amount } = req.body;
  const { bankCode } = req.body;

  const locale = 'vn';
  const currCode = 'VND';
  // eslint-disable-next-line camelcase
  let vnp_Params = {};
  vnp_Params.vnp_Version = '2.1.0';
  vnp_Params.vnp_Command = 'pay';
  vnp_Params.vnp_TmnCode = tmnCode;
  vnp_Params.vnp_Locale = locale;
  vnp_Params.vnp_CurrCode = currCode;
  vnp_Params.vnp_TxnRef = orderId;
  vnp_Params.vnp_OrderInfo = `Thanh toan cho ma GD:${orderId}`;
  vnp_Params.vnp_OrderType = 'other';
  vnp_Params.vnp_Amount = amount * 100;
  vnp_Params.vnp_ReturnUrl = `${returnUrl}/${userId}`;
  vnp_Params.vnp_IpAddr = ipAddr;
  vnp_Params.vnp_CreateDate = createDate;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params.vnp_BankCode = bankCode;
  }

  // eslint-disable-next-line no-use-before-define, camelcase
  vnp_Params = sortObject(vnp_Params);

  const querystring = require('qs');
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
  vnp_Params.vnp_SecureHash = signed;
  vnpUrl += `?${querystring.stringify(vnp_Params, { encode: false })}`;

  console.log(vnpUrl);
  res.redirect(200, vnpUrl);
};

const returnIpn = async (req, res) => {
  const { userId } = req.params;

  let vnp_Params = req.query;
  const secureHash = vnp_Params.vnp_SecureHash;
  const secretKey = configVNP.vnp_HashSecret;
  const rspCode = vnp_Params.vnp_ResponseCode;

  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  vnp_Params = sortObject(vnp_Params);

  // eslint-disable-next-line import/no-extraneous-dependencies
  const querystring = require('qs');
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha512', secretKey);
  // eslint-disable-next-line security/detect-new-buffer, no-buffer-constructor
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  const paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  // let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  // let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

  const checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  const checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if (secureHash === signed) {
    // kiểm tra checksum
    if (checkOrderId) {
      if (checkAmount) {
        // eslint-disable-next-line eqeqeq
        if (paymentStatus == '0') {
          // kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
          // eslint-disable-next-line eqeqeq
          if (rspCode == '00') {
            // get user ID by token right here

            res.status(200).json({ RspCode: '00', Message: 'Success' });
          } else {
            // that bai
            // paymentStatus = '2'
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
  const sorted = {};
  const str = [];
  let key;
  // eslint-disable-next-line no-restricted-syntax
  for (key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  // eslint-disable-next-line no-plusplus
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

module.exports = {
  createWallet,
  getWalletById,
  addBalance,
  transferMoneyById,
  getWalletByToken,
  claimMoneyById,
  addBalanceByBank,
  returnIpn,
};
