const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { commentService } = require('../services');

// TODO:
// query all comments, reported comments
// role admin and moderator can delete reported comment
// role user can delete their own comment

const postComment = catchAsync(async (req, res) => {
  const comment = await commentService.postComment(req.params.userId, req.body);
  res.status(httpStatus.CREATED).send(comment);
});

const getComment = catchAsync(async (req, res) => {
  const comment = await commentService.getCommentById(req.params.commentId);
  res.status(httpStatus.OK).send(comment);
})

const getCommentsByUserId = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['rating']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await commentService.queryCommentsByUserId(req.params.userId, filter, options);
  res.status(httpStatus.OK).send(result);
})

const updateComment = catchAsync(async (req, res) => {
  const comment = await commentService.updateCommentById(req.params.commentId, req.body);
  res.status(httpStatus.OK).send(comment);
});

const deleteComment = catchAsync(async (req, res) => {
  await commentService.deleteCommentById(req.params.commentId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getReportedComments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['rating']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await commentService.queryReportedComments(filter, options);
  res.status(httpStatus.OK).send(result);
})

const reportComment = catchAsync(async (req, res) => {
  const reportComment = await commentService.reportComment(req.params.type, req.params.commentId);
  res.status(httpStatus.OK).send(reportComment);
});

const denyReportedComment = catchAsync(async (req, res) => {
  const denyReportedComment = await commentService.denyReportedComment(req.params.type, req.params.commentId);
  res.status(httpStatus.OK).send(denyReportedComment);
})

module.exports = {
  postComment,
  getComment,
  getCommentsByUserId,
  updateComment,
  deleteComment,
  getReportedComments,
  reportComment,
  denyReportedComment
};
