export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};
