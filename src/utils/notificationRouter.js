export function resolveNotificationTarget(notif, userRole) {
  const { type, relatedToId } = notif;
  if (!relatedToId) return null;

  const prefix = getRolePrefix(userRole);
  if (!prefix) return null;

  switch (type) {
    case "LEAD_ASSIGNED":
    case "LEAD_CONVERSION_REQUESTED":
    case "LEAD_CONVERSION_APPROVED":
      return { path: `${prefix}/leads` };

    case "QUOTATION_ASSIGNED":
      return { path: `${prefix}/quotations` };

    case "CLIENT_ASSIGNED":
      return { path: `${prefix}/clients` };

    case "TASK_ASSIGNED":
    case "TASK_STATUS_CHANGED":
      return { path: `${prefix}/tasks` };

    default:
      return null;
  }
}

function getRolePrefix(role) {
  switch (role) {
    case "Admin":           return "/admin";
    case "Sales Manager":   return "/sales-manager";
    case "Sales Agent":     return "/sales-agent";
    case "Support Staff":   return "/support-staff";
    default:                return null;
  }
}