import { useAuth } from "../context/AuthContext";
import { PERMISSIONS } from "./permissions";

export const usePermissions = (feature) => {
  const { user } = useAuth();
  return {
    ...(PERMISSIONS[feature]?.[user?.role] ?? {}),
  };
};
