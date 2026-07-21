import { AlertTriangle, UserX, UserMinus, CircleAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getUserState } from "../utils/userState";
import { isSameUser } from "../utils/teamAccess";

const ICON_MAP = {
  inactive: UserMinus,
  deleted: UserX,
  teamless: CircleAlert,
  outsideTeam: AlertTriangle,
};

const TONE_CLASS = {
  gray: "text-gray-400",
  red: "text-red-600",
  yellow: "text-yellow-600",
  amber: "text-amber-600",
};

export default function UserDisplayName({
  user,
  currentUser: currentUserProp,
  children,
  className = "",
  showYou = true,
  showIcon = true,
}) {
  const { user: authUser } = useAuth();

  const currentUser = currentUserProp || authUser;
  const state = getUserState(user, currentUser);
  const Icon = state ? ICON_MAP[state.icon] : null;
  const isSelf = isSameUser(user, currentUser);

  return (
    <span className={`inline-flex items-center gap-1.5 min-w-0 ${className}`}>
      <span className={`truncate ${state ? TONE_CLASS[state.tone] : ""}`}>
        {children}
        {showYou && isSelf && <span> (You)</span>}
      </span>

      {state && showIcon && Icon && (
        <span
          className={`${TONE_CLASS[state.tone]} cursor-help shrink-0`}
          title={state.message}
        >
          <Icon size={13} />
        </span>
      )}
    </span>
  );
}
