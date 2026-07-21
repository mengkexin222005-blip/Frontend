import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  setAccessToken as setAxiosToken,
  setLogoutCallback,
} from "../services/api";
import { logout as logoutService, refreshToken } from "../services/authService";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "crm_auth";

/**
 * AuthProvider - Manages user authentication state and JWT tokens
 * 
 * Features:
 *   - Stores access token and user data
 *   - Automatically restores session on page refresh using refresh token cookie
 *   - Provides logout callback to API interceptor for handling token expiration
 *   - Handles silent token refresh without user interruption
 * 
 * Usage:
 *   <AuthProvider>
 *     <App />
 *   </AuthProvider>
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate();

  /**
   * Logs out the user and clears authentication state
   * @param {boolean} callServer - If true, calls logout API endpoint
   */
  const handleLogout = useCallback(
    async (callServer = false) => {
      if (callServer) await logoutService();
      setAxiosToken(null);
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      navigate("/login", { replace: true });
    },
    [navigate],
  );

  // Give the Axios interceptor a reference to logout so it can trigger it on failed refresh
  useEffect(() => {
    setLogoutCallback(() => handleLogout(false));
  }, [handleLogout]);

  /**
   * Restores user session on page refresh
   * Uses refresh token from httpOnly cookie to get new access token
   */
  useEffect(() => {
    const restoreSession = async () => {
      let savedAuth = null;
      const savedAuthRaw = localStorage.getItem(AUTH_STORAGE_KEY);

      if (savedAuthRaw) {
        try {
          savedAuth = JSON.parse(savedAuthRaw);
          if (savedAuth?.accessToken && savedAuth?.user) {
            setAxiosToken(savedAuth.accessToken);
            setAccessToken(savedAuth.accessToken);
            setUser(savedAuth.user);
          }
        } catch {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          savedAuth = null;
        }
      }

      try {
        const data = await refreshToken(); // uses httpOnly cookie
        setAxiosToken(data.accessToken);
        setAccessToken(data.accessToken); // ← expose to context consumers
        setUser(data.user);
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ accessToken: data.accessToken, user: data.user }),
        );
      } catch {
        if (!savedAuth) {
          setAccessToken(null);
          setUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } finally {
        setAuthReady(true);
      }
    };
    restoreSession();
  }, []);

  // Save after login
  const saveAuth = useCallback((token, userData) => {
    setAxiosToken(token); // write to Axios module store
    setAccessToken(token); // ← expose to context consumers
    setUser(userData);
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ accessToken: token, user: userData }),
    );
  }, []);

  const logout = useCallback(() => handleLogout(true), [handleLogout]);

  // Update user data after profile changes (e.g., avatar, name)
  const updateUser = useCallback((updatedUserData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedUserData };
      // Also update localStorage
      const currentAuth = JSON.parse(
        localStorage.getItem(AUTH_STORAGE_KEY) || "{}"
      );
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ ...currentAuth, user: updated }),
      );
      return updated;
    });
  }, []);

  // Block rendering until session restore attempt is done (prevents login flash)
  if (!authReady) return null;

  return (
    <AuthContext.Provider value={{ accessToken, user, saveAuth, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}