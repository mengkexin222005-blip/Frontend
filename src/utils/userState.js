import { isOutsideUserTeam, isTeamlessUser, isSameUser } from "./teamAccess";

export const isUserInactive = (user) => {
  if (!user?.status) return false;
  return user.status.toLowerCase() !== "active";
};

export const getUserState = (user, currentUser) => {
  if (!user) return null;

  const effectiveUser = currentUser || user;
  const isSelf = isSameUser(user, effectiveUser);

  // SELF teamless
  if (
    isSelf &&
    ["Sales Manager", "Sales Agent"].includes(user?.role) &&
    isTeamlessUser(effectiveUser)
  ) {
    return {
      tone: "yellow",
      icon: "teamless",
      message: "You are currently not assigned to a team.",
    };
  }

  // Inactive
  if (isUserInactive(user)) {
    return {
      tone: "gray",
      icon: "inactive",
      message: "This user is inactive.",
    };
  }

  // Outside team
  if (
    !isSelf &&
    effectiveUser.role === "Sales Manager" &&
    isOutsideUserTeam(user, effectiveUser)
  ) {
    return {
      tone: "amber",
      icon: "outsideTeam",
      message: "This user is not part of your current team.",
    };
  }

  return null;
};
