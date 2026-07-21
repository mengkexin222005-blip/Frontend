import axios from "axios";

const authAxios = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
  withCredentials: true,
});

export const login = async (data) => {
  const res = await authAxios.post("/login", data);
  return res.data;
};

export const logout = async () => {
  await authAxios.post("/logout");
};

export const forgotPassword = async (email) => {
  const res = await authAxios.post("/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (token, newPassword) => {
  const res = await authAxios.post("/reset-password", { token, newPassword });
  return res.data;
};

export const refreshToken = async () => {
  const res = await authAxios.post("/refresh");
  return res.data;
};
