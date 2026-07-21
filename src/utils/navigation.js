import { BASE_NAV, ROLE_ROUTES, ROLE_BASE_PATH } from "../constants/navigation";

export const getNavLinks = (role) => {
  const basePath = ROLE_BASE_PATH[role] || "";

  return (ROLE_ROUTES[role] || [])
    .map((key) => {
      const item = BASE_NAV[key];

      // Skip invalid keys
      if (!item) return null;

      // Section header (Module)
      if (item.type === "group") {
        return item;
      }

      return {
        to: key === "dashboard" ? basePath : `${basePath}/${key}`,
        label: item.label,
        Icon: item.icon.default,
        ActiveIcon: item.icon.active,
      };
    })
    .filter(Boolean);
};

export const filterNavItems = (items, user) => {
  if (!user || user.role === "Super Admin") {
    return items;
  }

  const accessModules = Array.isArray(user.accessModules)
    ? user.accessModules
    : [];

  if (accessModules.length === 0) {
    return items;
  }

  const allowedLabels = new Set(
    accessModules.map((label) => label.toLowerCase()),
  );

  const alwaysVisibleLabels = new Set(["users"]);

  return items.filter((item) => {
    if (item.type === "group") {
      return true;
    }

    if (!item.label) {
      return true;
    }

    const label = item.label.toLowerCase();
    if (alwaysVisibleLabels.has(label) && ["Super Admin", "Admin"].includes(user.role)) {
      return true;
    }

    return allowedLabels.has(label);
  });
};