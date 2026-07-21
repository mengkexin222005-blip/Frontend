import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (accessToken) => {
  if (socket) return socket;

  socket = io("http://localhost:5000", {
    auth: { token: accessToken },
    withCredentials: true,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
