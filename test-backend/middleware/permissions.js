module.exports = (moduleName, action) => {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return res.status(403).json({ message: 'Role not assigned' });

    const modulePerm = role.permissions.find(p => p.module === moduleName);
    if (!modulePerm || !modulePerm.permissions[action]) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    next();
  };
};
