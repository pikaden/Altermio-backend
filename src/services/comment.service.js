const httpStatus = require('http-status');
const { Comment, User } = require('../models');
const { tokenService } = require('.');
const ApiError = require('../utils/ApiError');
const { userService } = require('.');
const { tokenTypes } = require('../config/tokens');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Create a comment
 * @param {Object} commentBody
 * @returns {Promise<Comment>}
 */
const postComment = async (accessTokenFromHeader, commentBody) => {
  const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
  const buyerId = payload.sub;
  commentBody.buyerId = buyerId;
  const newComment = await Comment.create(commentBody);

  // save newComment at user.comments, both seller and buyer
  const sellerId = commentBody.sellerId;
  const buyer = await userService.getUserById(buyerId);
  const seller = await userService.getUserById(sellerId);

  if (!buyer || !seller) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  buyer.comments.push(newComment._id);
  seller.comments.push(newComment._id);
  await buyer.save();
  await seller.save();

  return newComment;
};

/**
 * Get comment by id
 * @param {ObjectId} id
 * @returns {Promise<Comment>}
 */
const getCommentById = async (id) => {
  return Comment.findById(id);
};

/**
 * Query for commments of a user
 * @param {ObjectId} userId
 * @returns {Promise<QueryResult>}
 */
const queryCommentsByUserId = async (userId, options) => {
  // const user = await userService.getUserById(userId);
  // return user.comments;
  const refArray = 'comments';
  const comments = await User.paginateRefArrays(userId, refArray, options);
  return comments;
};

/**
 * Update comment by id
 * @param {String} accessTokenFromHeader
 * @param {ObjectId} commentId
 * @param {Object} commentBody
 * @returns {Promise<Comment>}
 */
const updateCommentById = async (accessTokenFromHeader, commentId, commentBody) => {
  const comment = await getCommentById(commentId);

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  // get userId from token
  const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
  const userId = payload.sub;

  // only author can update their own comment
  if (userId == comment.buyerId) {
    Object.assign(comment, commentBody);
    await comment.save();
    return comment;
  }
};

/**
 * Delete comment by id
 * @param {String} accessTokenFromHeader
 * @param {ObjectId} commentId
 * @returns {Promise<Comment>}
 */
const deleteCommentById = async (accessTokenFromHeader, commentId) => {
  const comment = await getCommentById(commentId);

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  // get userId from token
  const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
  const userId = payload.sub;

  const user = await userService.getUserById(userId);
  const userRole = user.role;

  // so sanh role comment.buyerId and userId to delete
  if (userRole == 'admin' || userRole == 'moderator' || (userRole == 'user' && userId == comment.buyerId)) {
    // delete in comments, users
    await comment.remove();
    return comment;
  } else throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to do this command');
};

/**
 * Query for reported comments
 * @returns {Promise<QueryResult>}
 */
const queryReportedComments = async () => {
  const reportedComments = await Comment.find({ isReported: true });
  return reportedComments;
};

/**
 * report comment from user to moderator and admin
 * @param {string} typeReport
 * @param {ObjectId} commentId
 * @returns {Promise<Comment>}
 */
const reportComment = async (typeReport, commentId) => {
  const comment = await getCommentById(commentId);

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  if (comment.isReported) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Comment has been reported');
  }
  if (typeReport != 'submit') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Type report is not right');
  }

  comment.isReported = true;
  await comment.save();
  return comment;
};

/**
 * deny report comment, meaning that comment is not flagged
 * @param {string} typeReport
 * @param {ObjectId} commentId
 * @returns {Promise<Comment>}
 */
const denyReportedComment = async (typeReport, commentId) => {
  const comment = await getCommentById(commentId);

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  if (!comment.isReported) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Comment has not been reported');
  }
  if (typeReport != 'deny') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Type report is not right');
  }

  comment.isReported = false;
  await comment.save();
  return comment;
};

module.exports = {
  postComment,
  getCommentById,
  queryCommentsByUserId,
  updateCommentById,
  deleteCommentById,
  queryReportedComments,
  reportComment,
  denyReportedComment,
};
