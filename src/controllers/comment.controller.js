const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { commentService } = require('../services');

const postComment = catchAsync(async (req, res) => {
  const accessTokenFromHeader = req.headers.access_token;
  if (!accessTokenFromHeader) {
    res.status(httpStatus.NOT_FOUND).send('Access token not found');
  }
  const comment = await commentService.postComment(accessTokenFromHeader,req.params.userId, req.body);
  res.status(httpStatus.ok).send(comment);
});

const getComment = catchAsync(async (req, res) => {
  const comment = await commentService.getCommentById(req.params.commentId);
  res.status(httpStatus.OK).send(comment);
})

const getCommentsByUserId = catchAsync(async (req, res) => {
  const result = await commentService.queryCommentsByUserId(req.params.userId);
  res.status(httpStatus.OK).send(result);
})

const updateComment = catchAsync(async (req, res) => {
  // get access token from headers
  const accessTokenFromHeader = req.headers.access_token;
  if (!accessTokenFromHeader) {
    res.status(httpStatus.NOT_FOUND).send('Access token not found');
  }

  const comment = await commentService.updateCommentById(accessTokenFromHeader, req.params.commentId, req.body);
  res.status(httpStatus.OK).send(comment);
});

const deleteComment = catchAsync(async (req, res) => {
  // get access token from headers
  const accessTokenFromHeader = req.headers.access_token;
  if (!accessTokenFromHeader) {
    res.status(httpStatus.NOT_FOUND).send('Access token not found');
  }

  await commentService.deleteCommentById(accessTokenFromHeader, req.params.commentId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getReportedComments = catchAsync(async (req, res) => {
  const result = await commentService.queryReportedComments();
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
