import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);

  const socket = useMemo(() => {
    return io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
  }, []);

  useEffect(() => {
    if (!user) {
      socket.disconnect();
      setConnected(false);
      return;
    }

    socket.connect();

    socket.on("connect", () => {
      console.log("[WS] Connected:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("[WS] Disconnected");
      setConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("[WS] Error:", error.message);
      setConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, [socket, user]);

  const value = useMemo(
    () => ({
      socket,
      connected,
    }),
    [socket, connected]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocketContext() {
  return useContext(SocketContext);
}

export function useSocket() {
  return useContext(SocketContext);
}

export default SocketContext;