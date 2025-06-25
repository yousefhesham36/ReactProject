import { isTokenExpire } from "@/api";
import { useAuthStore } from "@/store/auth";
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthGurdRoute = () => {
  const { pathname } = useLocation();
  const { token, clear, refreshToken } = useAuthStore();

  if (!token || isTokenExpire(refreshToken)) {
    clear();
    return <Navigate to={`/login?redirectTo=${pathname}`} />;
  }

  return <Outlet />;
};

export default AuthGurdRoute;
