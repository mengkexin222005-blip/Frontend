import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardByRole } from "../utils/roleRedirect";

export default function SessionRedirect() {
  const { accessToken, user } = useAuth();

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDashboardByRole(user.role)} replace />;
}
