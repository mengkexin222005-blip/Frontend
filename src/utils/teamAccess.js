// Identity helpers

export const getUserId = (user) => user?._id || user?.id || user || null;

export const isSameUser = (a, b) => {
  const idA = getUserId(a);
  const idB = getUserId(b);
  return idA && idB && idA.toString() === idB.toString();
};

// Team helpers

export const getUserTeamId = (user) =>
  user?.team?._id || user?.team?.id || user?.team || null;

export const isSameTeam = (user, currentUser) => {
  const userTeam = getEffectiveTeamId(user);
  const currentUserTeam = getEffectiveTeamId(currentUser);

  return (
    userTeam &&
    currentUserTeam &&
    userTeam.toString() === currentUserTeam.toString()
  );
};

export const isOutsideUserTeam = (user, currentUser) => {
  if (!user || !currentUser) return false;
  if (currentUser.role !== "Sales Manager") return false;
  if (isSameUser(user, currentUser)) return false;

  return !isSameTeam(user, currentUser);
};

// Teamless helpers

export const isTeamlessAgent = () => false;

export const isTeamlessManager = () => false;

export const getEffectiveTeamId = (user) => {
  if (!user) return null;

  if (user.role === "Sales Manager") {
    return user?.managedTeam?._id || user?.managedTeam || null;
  }

  return getUserTeamId(user);
};

export const isTeamlessUser = () => false;
