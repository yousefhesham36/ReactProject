import axios from "axios";
import { refreshTokeAPI } from "./auth";
import { jwtDecode } from "jwt-decode";

export const APIClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export function removeTokenHandler() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  window.location.replace("/login");
}

export function isTokenExpire(token) {
  try {
    const { exp, expiresIn } = jwtDecode(token);
    const now = Date.now() / 1000;
    return (exp ?? expiresIn) < now;
  } catch {
    return true;
  }
}

export const publicRoutes = ["/signup", "/refresh-token", "/login"];

APIClient.interceptors.request.use(
  async (config) => {
    if (!publicRoutes.includes(config.url)) {
      const { token, refreshToken } =
        JSON.parse(localStorage.getItem("auth-store"))?.state ?? {};

      if (isTokenExpire(token)) {
        if (!isTokenExpire(refreshToken)) {
          const res = await refreshTokeAPI({ refreshToken });
          config.headers.Authorization = `Bearer ${res.data.token}`;
          return config;
        }

        window.location.replace("/login");
        return config;
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
