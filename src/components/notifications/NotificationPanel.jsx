import { Bell, MailOpen, X, Trash2 } from "lucide-react";
import { getProfileImage } from "../../utils/avatar";
import { formatRelativeTime } from "../../utils/date";
import { useNavigate } from "react-router-dom";
import { resolveNotificationTarget } from "../../utils/notificationRouter";
import { useAuth } from "../../context/AuthContext";

const TYPE_LABELS = {
  LEAD_ASSIGNED: "Lead",
  QUOTATION_ASSIGNED: "Quotation",
  CLIENT_ASSIGNED: "Client",
  TASK_ASSIGNED: "Task",
  TASK_STATUS_CHANGED: "Task",
  LEAD_CONVERSION_REQUESTED: "Conversion",
  LEAD_CONVERSION_APPROVED: "Conversion",
};

export default function NotificationPanel({
  notifRef,
  notifOpen,
  setNotifOpen,
  setOpen,
  notifications,
  unreadCount,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onClearAll,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) onMarkAsRead(notif._id);

    const target = resolveNotificationTarget(notif, user.role);
    if (target?.path) {
      setNotifOpen(false);
      navigate(target.path);
    }
  };

  return (
    <div className="relative" ref={notifRef}>
      <button
        onClick={() => {
          setNotifOpen((prev) => !prev);
          setOpen(false);
        }}
        className="relative p-1 cursor-pointer"
      >
        <Bell className="w-6 h-6 text-red-500" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {notifOpen && (
        <div className="absolute right-0 top-10 w-90 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-gray-800">Notifications</span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
              {notifications.length > 0 && unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  title="Mark all as read"
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  <MailOpen className="w-4 h-4" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={onClearAll}
                  title="Clear all"
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-100 overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <p className="text-sm text-gray-400 text-center py-6">Loading...</p>
            ) : notifications.length === 0 ? (
              <div className="py-8 flex flex-col items-center gap-2 text-gray-400">
                <Bell size={20} />
                <p className="text-sm text-center">No notifications</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isNavigable = !!resolveNotificationTarget(notif)?.path;

        return (
        <div
                    key={notif._id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex items-start gap-3 px-4 py-3 transition
                      ${notif.isRead ? "bg-white hover:bg-gray-50" : "bg-red-50 hover:bg-red-100"}
                      ${isNavigable ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <img
                      src={getProfileImage(notif.triggeredBy ?? null)}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-0.5">
                        {TYPE_LABELS[notif.type] && (
                          <span className="text-[9px] font-semibold uppercase tracking-wide text-red-500 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                            {TYPE_LABELS[notif.type]}
                          </span>
                        )}
                        <p className="text-xs text-gray-400">
                          {formatRelativeTime(notif.createdAt)}
                        </p>
                        {!notif.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                      <p className="text-xs text-gray-500">{notif.message}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        onDismiss(notif._id);
                      }}
                      className="text-gray-400 hover:text-gray-600 shrink-0 mt-0.5"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}