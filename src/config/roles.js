const allRoles = {
  user: ['postComment', 'updateComment', 'deleteComment', 'reportComment'],
  admin: ['getUsers', 'manageUsers', 'postComment', 'deleteComment', 'reportComment', 'manageReportedComments'],
  moderator: ['postComment', 'deleteComment', 'reportComment', 'manageReportedComments'],
  courier: ['reportComment']
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
