import "./App.css";
import React from "react";
import Home from "./Components/Landing Page/Home";
import LoginPage from "./Components/Authentification Page/LoginPage";
import Feed from "./Components/Feed Page/Feed";
import ErrorPage from "./Components/errorPage";
import ProfilePage from "./Components/Profile Page/ProfilePage";
import {createBrowserRouter} from "react-router-dom";
import SearchFeed from "./Components/Feed Page/SearchFeed";
import CourseForm from "./Components/Post Page/CourseForm";
import AdminLogin from "./Components/Authentification Page/AdminLogin";
import AdminPage from "./Components/Admin/AdminPage";
import VideoPlayer from "./Components/VideoPlayer/VideoPlayer";
import LoadingPage from "./Components/LoadingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,

  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/adminpage",
    element: <AdminPage />,
  },
  {
    path: "/feed",
    element: <Feed />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/searchFeed",
    element: <SearchFeed />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/courseForm",
    element: <CourseForm />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/coursePage",
    element: <VideoPlayer />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/loading",
    element: <LoadingPage />,
    errorElement: <ErrorPage />,
  },

]);


export default router;
