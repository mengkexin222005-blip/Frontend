import { CheckSquare } from "lucide-react";
import { formatDate } from "../../utils/date";
import { getDisplayName } from "../../utils/name";
import { getProfileImage } from "../../utils/avatar";

const PRIORITY_DOT = {
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-green-500",
};

const Avatar = ({ user }) => {
  if (!user) {
    return (
      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
        <CheckSquare size={12} className="text-gray-400" />
      </div>
    );
  }

  const src = getProfileImage(user);
  return src ? (
    <img
      src={src}
      alt={getDisplayName(user)}
      className="w-7 h-7 rounded-full object-cover shrink-0"
    />
  ) : (
    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
      <span className="text-xs font-semibold text-indigo-600">
        {user.firstName?.[0]}
        {user.lastName?.[0]}
      </span>
    </div>
  );
};

const TaskItem = ({ task, isLast }) => {
  const assignee = task.assignedTo;
  const assigneeName = assignee ? getDisplayName(assignee) : "Unassigned";

  return (
    <div className="flex gap-3">
      {/* Left: avatar + vertical line */}
      <div className="flex flex-col items-center">
        <Avatar user={assignee} />
        {!isLast && <div className="w-px flex-1 bg-gray-200 mt-1" />}
      </div>

      {/* Right: content */}
      <div className={`min-w-0 flex-1 ${!isLast ? "pb-4" : "pb-0"}`}>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority dot */}
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[task.priority] ?? "bg-gray-400"}`}
          />
          <span className="text-xs font-semibold text-gray-700">
            {task.subject}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-0.5 ml-4 flex-wrap">
          <span className="text-[11px] text-gray-400">{task.status}</span>

          <span className="text-[11px] text-gray-300">·</span>
          <span className="text-[11px] text-gray-400">{assigneeName}</span>

          {task.dueDate && (
            <>
              <span className="text-[11px] text-gray-300">·</span>
              <span className="text-[11px] text-gray-400">
                Due {formatDate(task.dueDate)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function TaskTimeline({ tasks = [], loading }) {
  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <span className="text-sm text-gray-400">Loading tasks…</span>
      </div>
    );
  }

  if (tasks.length === 0) return null;

  return (
    <div className="py-2">
      {tasks.map((task, index) => (
        <TaskItem
          key={task._id}
          task={task}
          isLast={index === tasks.length - 1}
        />
      ))}
    </div>
  );
}