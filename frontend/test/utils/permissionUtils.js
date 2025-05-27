// utils/permissionUtils.js
export const hasAccess = (module, action = "read") => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");
  return permissions?.[module]?.[action] === true;
};
