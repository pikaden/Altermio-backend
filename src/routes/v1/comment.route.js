const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const commentValidation = require('../../validations/comment.validation');
const commentController = require('../../controllers/comment.controller');

const router = express.Router();

// role admin and moderator can delete reported comment, delete comment
// role user can update, delete their own comment

router
  .route('/user')
  .post(auth('postComment'), validate(commentValidation.tokenUserIdPostComment), commentController.postComment);

router
  .route('/users/:userId')
  // userId here can be sellerId or buyerId
  .get(validate(commentValidation.getCommentsByUserId), commentController.getCommentsByUserId)
  // userId here is buyerId
  .post(auth('postComment'), validate(commentValidation.postComment), commentController.postComment);

router
  .route('/:commentId')
  .get(validate(commentValidation.getComment), commentController.getComment)
  .patch(auth('updateComment'), validate(commentValidation.updateComment), commentController.updateComment)
  .delete(auth('deleteComment'), validate(commentValidation.deleteComment), commentController.deleteComment);

router.route('/reportComments/all').get(auth('manageReportedComments'), commentController.getReportedComments);

router
  .route('/reportComments/:commentId/:type')
  .patch(auth('reportComment'), validate(commentValidation.patchReportComment), commentController.reportComment)
  .put(
    auth('manageReportedComments'),
    validate(commentValidation.patchReportComment),
    commentController.denyReportedComment
  );
module.exports = router;
