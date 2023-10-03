// admin can change avatar => upload single file
const allRoles = {
  user: ['postComment', 'updateComment', 'deleteComment', 'reportComment', 'deleteImage', 'uploadSingleFile', 'uploadMultipleFiles'],
  admin: ['getUsers', 'manageUsers', 'postComment', 'deleteComment',
   'reportComment', 'manageReportedComments', 'deleteImage', 'uploadSingleFile'],
  moderator: ['postComment', 'deleteComment', 'reportComment', 'manageReportedComments', 'deleteImage', 'uploadSingleFile'],
  courier: ['reportComment', 'deleteImage', 'uploadSingleFile', 'uploadMultipleFiles']
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
