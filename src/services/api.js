import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let _accessToken = null;
let _onLogout = null;

export const setAccessToken = (token) => {
  _accessToken = token;
};

export const getAccessToken = () => _accessToken;

export const setLogoutCallback = (fn) => {
  _onLogout = fn;
};

api.interceptors.request.use(
  (config) => {
    if (_accessToken) {
      config.headers.Authorization = `Bearer ${_accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isRefreshRequest = originalRequest.url?.includes(
      "/api/auth/refresh",
    );

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isRefreshRequest
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((queueError) => Promise.reject(queueError));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/refresh`,
        {},
        {
          withCredentials: true,
        },
      );

      const newToken = data.accessToken;

      setAccessToken(newToken);
      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      setAccessToken(null);

      if (_onLogout) {
        _onLogout();
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;