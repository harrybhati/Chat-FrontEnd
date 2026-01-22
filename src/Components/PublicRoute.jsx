import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

function PublicRoute() {
  const [authChecked, setAuthChecked] = useState(false); // did we check?
  const [isAuth, setIsAuth] = useState(false);          // is user logged in?

  const backendUrl = import.meta.env.VITE_API_URL; // ✅ match your .env

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${backendUrl}/checkAuth`, {
          withCredentials: true,
        });
        if (res.data.user?.id) setIsAuth(true);
        else setIsAuth(false);
      } catch (err) {
        setIsAuth(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [backendUrl]);

  // while checking token, show a loader
  if (!authChecked) return <p>Loading...</p>;

  // if logged in, redirect to chat
  if (isAuth) return <Navigate to="/chat" replace />;

  // otherwise render the login/signup page
  return <Outlet />;
}

export default PublicRoute;
