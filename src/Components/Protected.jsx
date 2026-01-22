import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

function ProtectedRoute() {
  const [isAuth, setIsAuth] = useState(null); // null = loading, true/false = auth status

  const backendUrl = import.meta.env.VITE_API_URL; // ✅ match your .env

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${backendUrl}/checkAuth`, {
          withCredentials: true,
        });
        if (res.data.user?.id) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (err) {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, [backendUrl]);

  if (isAuth === null) {
    // Loading while checking token
    return <p>Loading...</p>;
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
