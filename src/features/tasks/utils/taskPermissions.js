export const getUserId = (user) => user?._id || user?.id || null;

export const isTaskCreator = (task, currentUser) => {
  return task?.createdBy?._id === getUserId(currentUser);
};

export const isTaskAssignee = (task, currentUser) => {
  return task?.assignedTo?._id === getUserId(currentUser);
};

export const canFullyEditTask = (task, currentUser, permissions = {}) => {
  if (!permissions.canEdit) return false;

  // Admin can fully edit any task they can access
  if (currentUser?.role === "Admin") return true;

  // Sales Manager can fully edit tasks they can access
  if (currentUser?.role === "Sales Manager") return true;

  // Sales Agent can fully edit if creator or assigned agent
  return isTaskCreator(task, currentUser) || isTaskAssignee(task, currentUser);
};

export const canDeleteTask = (task, currentUser, permissions = {}) => {
  if (!permissions.canDelete) return false;

  if (currentUser?.role === "Admin") return true;

  // Optional: manager can delete tasks they can access
  if (currentUser?.role === "Sales Manager") return true;

  // Agent can only delete own personal task
  return (
    currentUser?.role === "Sales Agent" &&
    task?.scope === "Personal" &&
    isTaskCreator(task, currentUser)
  );
};

export const getTaskEditDisabledReason = (
  task,
  currentUser,
  permissions = {},
) => {
  if (!permissions.canEdit) {
    return "You do not have permission to edit tasks.";
  }

  if (!canFullyEditTask(task, currentUser, permissions)) {
    return "Only the task creator or assigned agent can fully edit this task.";
  }

  return "";
};
