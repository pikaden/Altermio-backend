const Joi = require('joi');
const { objectId } = require('./custom.validation');

const postComment = {
  body: Joi.object().keys({
    content: Joi.string().allow(''),
    productId: Joi.string().required(),
    rating: Joi.number().integer().min(0).max(5)
  }),
};

const getCommentsByUserId = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    rating: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getComment = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(objectId),
  }),
};

const updateComment = {
  params: Joi.object().keys({
    commentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      content: Joi.string().allow(''),
      rating: Joi.number().integer()
    })
    .min(1),
};

const deleteComment = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(objectId),
  }),
};

const patchReportComment = {
  params: Joi.object().keys({
    type: Joi.string().required(),
    commentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  postComment,
  getCommentsByUserId,
  getComment,
  updateComment,
  deleteComment,
  patchReportComment
};
