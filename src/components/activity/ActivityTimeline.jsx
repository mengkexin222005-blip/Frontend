import { Activity } from "lucide-react";
import { formatDateTime } from "../../utils/date";
import { getDisplayName } from "../../utils/name";
import { getProfileImage } from "../../utils/avatar";

const ACTION_CONFIG = {
  CREATE: { label: "Created", dot: "bg-emerald-500" },
  UPDATE: { label: "Updated", dot: "bg-blue-400" },
  ASSIGN: { label: "Assigned", dot: "bg-sky-500" },
  STATUS_CHANGE: { label: "Status Changed", dot: "bg-amber-500" },
  STAGE_CHANGE: { label: "Stage Changed", dot: "bg-amber-500" },
  CONVERT: { label: "Converted", dot: "bg-emerald-600" },
  CONVERSION_REQUESTED: { label: "Conversion Requested", dot: "bg-yellow-500" },
  CONVERSION_APPROVED: { label: "Conversion Approved", dot: "bg-teal-500" },
  NOTE: { label: "Note", dot: "bg-gray-400" },
};

const Avatar = ({ user }) => {
  if (!user) {
    return (
      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
        <Activity size={12} className="text-gray-400" />
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

const ActivityItem = ({ activity, isLast }) => {
  const config = ACTION_CONFIG[activity.action] ?? {
    label: activity.action,
    dot: "bg-gray-400",
  };
  const actor = activity.createdBy;
  const actorName = actor ? getDisplayName(actor) : "System";

  return (
    <div className="flex gap-3">
      {/* Left: avatar + vertical line */}
      <div className="flex flex-col items-center">
        <Avatar user={actor} />
        {!isLast && <div className="w-px flex-1 bg-gray-300 mt-1" />}
      </div>

      {/* Right: content */}
      <div className={`min-w-0 flex-1 ${!isLast ? "pb-4 " : "pb-0"}`}>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Colored dot */}
          <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />
          <span className="text-xs font-semibold text-gray-700">
            {actorName}
          </span>
          <span className="text-xs text-gray-500">{activity.title}</span>
        </div>
        <p className="text-[11px] text-gray-400 mt-0.5 ml-4">
          {formatDateTime(activity.activityDate ?? activity.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default function ActivityTimeline({ activities = [], loading }) {
  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <span className="text-sm text-gray-400">Loading activity…</span>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="py-8 flex flex-col items-center gap-2 text-gray-400">
        <Activity size={20} />
        <span className="text-sm">No activity yet</span>
      </div>
    );
  }

  return (
    <div className="py-2">
      {activities.map((activity, index) => (
        <ActivityItem
          key={activity._id}
          activity={activity}
          isLast={index === activities.length - 1}
        />
      ))}
    </div>
  );
}
