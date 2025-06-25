import { lazy } from "react";

export const HomePage = lazy(() => import("./Home"));
export const Login = lazy(() => import("./Login"));
export const PostList = lazy(() => import("./PostList"));
export const Profile = lazy(() => import("./Profile"));
export const Register = lazy(() => import("./Register"));
export const SinglePost = lazy(() => import("./SinglePost"));
