// admin can change avatar => upload single file
const allRoles = {
  user: ['postComment', 'updateComment', 'deleteComment', 'reportComment', 'deleteImage', 'deleteMultipleFiles',
    'uploadSingleFile', 'uploadMultipleFiles', 'createProduct', 'updateProduct', 'deleteProduct', 'reportProduct','addBalance'],
  admin: ['getUsers', 'manageUsers', 'postComment', 'deleteComment',
    'reportComment', 'manageReportedComments', 'deleteImage', 'deleteMultipleFiles', 
    'uploadSingleFile', 'deleteProduct', 'manageProducts', 'manageProductList'],
  moderator: ['postComment', 'deleteComment', 'reportComment', 'manageReportedComments', 'deleteImage',
    'deleteMultipleFiles', 'uploadSingleFile', 'deleteProduct', 'manageProducts'],
  courier: ['reportComment', 'deleteImage', 'deleteMultipleFiles', 'uploadSingleFile', 'uploadMultipleFiles']
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
