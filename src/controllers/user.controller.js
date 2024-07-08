const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['firstName', 'lastName', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const searchUser = catchAsync(async (req, res) => {
  const accessTokenFromHeader = req.headers.access_token;
  if (!accessTokenFromHeader) {
    res.status(httpStatus.NOT_FOUND).send('Access token not found');
  }

  const keyword = req.query.search
    ? {
        $or: [
          { firstName: { $regex: req.query.search, $options: 'i' } },
          { lastName: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const users = await userService.searchUser(keyword, accessTokenFromHeader);
  res.send(users);
});

const getUserByToken = catchAsync(async (req, res) => {
  const accessTokenFromHeader = req.headers.access_token;
  if (!accessTokenFromHeader) {
    res.status(httpStatus.NOT_FOUND).send('Access token not found');
  }
  const user = await userService.getUserByToken(accessTokenFromHeader);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUserAdmin = catchAsync(async (req, res) => {
  const user = await userService.updateUserByIdAdmin(req.params.userId, req.body);
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const accessTokenFromHeader = req.headers.access_token;
  if (!accessTokenFromHeader) {
    res.status(httpStatus.NOT_FOUND).send('Access token not found');
  }
  const user = await userService.updateUserById(accessTokenFromHeader, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  searchUser,
  getUser,
  getUserByToken,
  updateUser,
  deleteUser,
  updateUserAdmin,
};
