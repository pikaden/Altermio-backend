const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const commentValidation = require('../../validations/comment.validation');
const commentController = require('../../controllers/comment.controller');

const router = express.Router();

router
  .route('/:userId')
  // userId here can be sellerId or buyerId
  .get(validate(commentValidation.getCommentsByUserId), commentController.getCommentsByUserId)
  // userId here is buyerId
  .post(validate(commentValidation.postComment), commentController.postComment)

router
  .route('/:commentId')
  .get(validate(commentValidation.getComment), commentController.getComment)
  .patch(validate(commentValidation.updateComment), commentController.updateComment)
  .delete(validate(commentValidation.deleteComment), commentController.deleteComment)

router
  .route('/reportComments')
  .get(validate(commentValidation.getReportedComments), commentController.getReportedComments)

router
  .route('/reportComments/:commentId/:type')
  .patch(validate(commentValidation.patchReportComment), commentController.reportComment)
  .put(validate(commentValidation.patchReportComment), commentController.denyReportedComment)

  // .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  // .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
  // .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;