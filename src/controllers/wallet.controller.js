const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { walletService } = require('../services');
const { Wallet } = require('../models');

const getWalletByUserId = catchAsync(async (req, res) => {
  const wallet = await walletService.getWalletById(req.params.userId);
  res.status(httpStatus.OK).send(wallet);
});

const addBalance = catchAsync(async (req, res) => {
  const accessTokenFromHeader = req.headers.access_token;
  if (!accessTokenFromHeader) {
    res.status(httpStatus.NOT_FOUND).send('Access token not found');
  }
  const wallet = await walletService.addBalanceByBank(accessTokenFromHeader, req, res)
  res.status(httpStatus.OK).send(wallet)
})

const returnIpn = catchAsync(async (req, res) => {
  const wallet = await walletService.returnIpn(req, res)
  res.status(httpStatus.OK).send(wallet)
})

const transferMoneyById = catchAsync(async(req, res) => {
  const accessTokenFromHeader = req.headers.access_token;
  if (!accessTokenFromHeader) {
    res.status(httpStatus.NOT_FOUND).send('Access token not found');
  }
  const wallet = await walletService.transferMoneyById(accessTokenFromHeader, req, res)
  res.status(httpStatus.OK).send(wallet)
})

const claimMoneyById = catchAsync(async(req, res) => {
  const accessTokenFromHeader = req.headers.access_token;
  if (!accessTokenFromHeader) {
    res.status(httpStatus.NOT_FOUND).send('Access token not found');
  }
  const wallet = await walletService.claimMoneyById(accessTokenFromHeader, req, res)
  res.status(httpStatus.OK).send(wallet)
})

// const createWallet = catchAsync(async (req, res) => {
//   const wallet = await walletService.createWallet(req.params.userId)
//   res.status(httpStatus.OK).send(wallet)
// })

module.exports = {
  // createWallet,
  getWalletByUserId,
  transferMoneyById,
  claimMoneyById,
  addBalance,
  returnIpn,
};
