/* eslint-disable prettier/prettier */
const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const imageRoute = require('./image.route');
const commentRoute = require('./comment.route');
const productList = require('./productList.route');
const productRoute = require('./product.route');
const notificationRoute = require('./notification.route');
const walletRoute = require('./wallet.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/images',
    route: imageRoute,
  },
  {
    path: '/comments',
    route: commentRoute,
  },
  {
    path: '/productLists',
    route: productList,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/notifications',
    route: notificationRoute,
  },
  {
    path: '/wallets',
    route: walletRoute
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
