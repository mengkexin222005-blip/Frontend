import { useState, useRef, useEffect } from "react";
import { User as UserIcon, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useAuth } from "../context/AuthContext";
import { getProfileImage } from "../utils/avatar";
import { getDisplayName } from "../utils/name";
import UserDisplayName from "./UserDisplayName";
import NotificationPanel from "./notifications/NotificationPanel";
import { useNotifications } from "../hooks/useNotifications";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const roleRoutes = {
    "Super Admin": "/admin",
    Admin: "/admin",
    "Sales Manager": "/sales-manager",
    "Sales Agent": "/sales-agent",
    "Support Staff": "/support-staff",
  };

  const profilePath = `${roleRoutes[user?.role]}/profile`;

  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef();
  const notifRef = useRef();

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
  } = useNotifications();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }

      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    Swal.fire({
      title: "Are you sure you want to Logout?",
      text: "You will be redirected to the Login page.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Logout",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await logout();
        } catch {
          Swal.fire({
            icon: "error",
            title: "Logout Failed",
            text: "An error occurred while trying to logout",
          });
        }
      }
    });
  };

  return (
    <div
      className="rounded-md bg-white border border-gray-200 px-6 py-3 flex
      justify-between items-center"
    >
      <h1 className="text-xl font-semibold">{user?.role}</h1>

      <div className="flex items-center gap-4">
        <NotificationPanel
          notifRef={notifRef}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
          setOpen={setOpen}
          notifications={notifications}
          unreadCount={unreadCount}
          loading={loading}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onDismiss={dismissNotification}
          onClearAll={clearAll}
        />

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => {
              setOpen(!open);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src={getProfileImage(user)}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover border-2 border-red-500"
            />
          </div>

          {open && (
            <div
              className="absolute right-0 top-14 w-64 bg-white rounded-md shadow-lg
              border border-gray-200 p-4 z-50"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={getProfileImage(user)}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    <UserDisplayName user={user} showYou={false}>
                      {getDisplayName(user, {
                        includeMiddle: false,
                        includeSuffix: true,
                      })}
                    </UserDisplayName>
                  </p>

                  <p className="text-xs text-gray-500">
                    {user?.role || "User"}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-400 my-2" />

              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => {
                    navigate(profilePath);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-200 transition"
                >
                  <UserIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">View Profile</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-200 transition"
                >
                  <LogOut className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}