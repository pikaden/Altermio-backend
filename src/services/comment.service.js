const httpStatus = require('http-status');
const { Comment } = require('../models');
const ApiError = require('../utils/ApiError');
const { userService } = require('.');

/**
 * Create a comment
 * @param {Object} commentBody
 * @returns {Promise<Comment>}
 */
const postComment = async (buyerId, commentBody) => {
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
}

/**
 * Query for commments of a user
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCommentsByUserId = async (userId, filter, options) => {
  // TODO: get comments by userId, paginate comments array
  const user = await userService.getUserById(userId);

  // const comments = await Comment.paginate(filter, options);
  return user.comments;
}

/**
 * Update comment by id
 * @param {ObjectId} commentId 
 * @param {Object} commentBody 
 * @returns 
 */
const updateCommentById = async (commentId, commentBody) => {
  const comment = await getCommentById(commentId);

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  Object.assign(comment, commentBody);
  await comment.save();
  return comment;
}

/**
 * Delete comment by id
 * @param {ObjectId} commentId
 * @returns {Promise<Comment>}
 */
const deleteCommentById = async (commentId) => {
  const comment = await getCommentById(commentId);

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  await comment.remove();
  return comment;
};

/**
 * Query for reported comments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReportedComments = async () => {
  // TODO: get comments by userId, paginate comments array

  const comments = await Comment.paginate(filter, options);
  return Comment.findById(id);
}

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
}

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
}

module.exports = {
  postComment,
  getCommentById,
  queryCommentsByUserId,
  updateCommentById,
  deleteCommentById,
  queryReportedComments,
  reportComment,
  denyReportedComment
};
