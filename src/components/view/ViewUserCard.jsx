import { useAuth } from "../../context/AuthContext";
import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";
import UserDisplayName from "../UserDisplayName";

/**
 * UserCard
 *
 * Avatar + name + role + employeeId card used in view drawer assignment sections.
 * Returns null if no user is provided.
 *
 * @prop {object} user  - user object (role, employeeId, etc.)
 * @prop {string} label - uppercase label shown above the name
 *
 */
export default function UserCard({ user, label }) {
  const { user: currentUser } = useAuth();
  if (!user) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
      <img
        src={getProfileImage(user)}
        alt={label}
        className="w-10 h-10 rounded-full object-cover border"
      />
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-700">
          <UserDisplayName user={user} currentUser={currentUser}>
            {getDisplayName(user, { includeSuffix: true })}
          </UserDisplayName>
        </p>
        <p className="text-xs text-gray-400">
          {user.role}
          {user.employeeId ? ` · ${user.employeeId}` : ""}
        </p>
      </div>
    </div>
  );
}
