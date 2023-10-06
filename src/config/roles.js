// admin can change avatar => upload single file
const allRoles = {
  user: ['postComment', 'updateComment', 'deleteComment', 'reportComment', 'deleteImage', 'deleteMultipleFiles',
    'uploadSingleFile', 'uploadMultipleFiles', 'createProduct', 'updateProduct', 'deleteProduct'],
  admin: ['getUsers', 'manageUsers', 'postComment', 'deleteComment',
    'reportComment', 'manageReportedComments', 'deleteImage', 'deleteMultipleFiles', 'uploadSingleFile', 'deleteProduct'],
  moderator: ['postComment', 'deleteComment', 'reportComment', 'manageReportedComments', 'deleteImage',
    'deleteMultipleFiles', 'uploadSingleFile', 'deleteProduct'],
  courier: ['reportComment', 'deleteImage', 'deleteMultipleFiles', 'uploadSingleFile', 'uploadMultipleFiles']
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
