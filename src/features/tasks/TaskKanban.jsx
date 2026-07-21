import TaskCard from "./TaskCard";
import BaseKanban from "../../components/kanban/BaseKanban";
import KanbanColumnHeader from "../../components/kanban/KanbanColumnHeader";
import LoaderCards from "../../components/loader/CardsLazyLoader";

const TASK_STATUSES = ["Pending", "Ongoing", "Completed", "Overdue"];

const normalizeTaskStatus = (status) => {
  if (status === "To Do") return "Pending";
  if (status === "In Progress") return "Ongoing";
  if (TASK_STATUSES.includes(status)) return status;

  return "Pending";
};

const normalizeColumns = (columns = {}) => {
  const normalizedColumns = TASK_STATUSES.reduce((acc, status) => {
    acc[status] = [];
    return acc;
  }, {});

  Object.entries(columns || {}).forEach(([status, tasks]) => {
    const normalizedStatus = normalizeTaskStatus(status);

    normalizedColumns[normalizedStatus] = [
      ...(normalizedColumns[normalizedStatus] || []),
      ...(tasks || []).map((task) => ({
        ...task,
        status: normalizeTaskStatus(task.status),
      })),
    ];
  });

  return normalizedColumns;
};

export default function TaskKanban({
  columns = {},
  permissions = {},
  onDragEnd,
  onAddTask,
  onCardClick,
  onEdit,
  onUpdateStatus,
  onUpdatePriority,
  isLoading = false,
}) {
  const finalColumns = normalizeColumns(columns);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const oldStatus = source.droppableId;
    const newStatus = destination.droppableId;

    const isSameColumn = oldStatus === newStatus;
    const isSamePosition = source.index === destination.index;

    if (isSameColumn && isSamePosition) return;

    if (!isSameColumn && onUpdateStatus) {
      await onUpdateStatus(draggableId, newStatus);
      return;
    }

    await onDragEnd?.(result);
  };

  if (isLoading) {
    return <LoaderCards columns={TASK_STATUSES} />;
  }

  return (
    <BaseKanban
      columns={finalColumns}
      statuses={TASK_STATUSES}
      onDragEnd={handleDragEnd}
      emptyMessage="No tasks"
      successStatus="Completed"
      renderHeader={(status, tasks) => (
        <KanbanColumnHeader
          label={status}
          count={tasks.length}
          successStatus="Completed"
          onAdd={permissions.canCreate ? () => onAddTask?.(status) : null}
          addLabel={`Add task to ${status}`}
        />
      )}
      renderCard={(task, index, tasks) => (
        <TaskCard
          key={task._id}
          task={task}
          index={index}
          isLast={index === tasks.length - 1}
          onClick={() => onCardClick?.(task)}
          onEdit={onEdit}
          onUpdateStatus={onUpdateStatus}
          onUpdatePriority={onUpdatePriority}
        />
      )}
    />
  );
}