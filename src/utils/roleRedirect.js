export const getDashboardByRole = (role) => {
  switch (role) {
    case "Super Admin":
    case "Admin":
      return "/admin";
    case "Sales Manager":
      return "/sales-manager";
    case "Sales Agent":
      return "/sales-agent";
    case "Support Staff":
      return "/support-staff";
    default:
      return "/login";
  }
};
