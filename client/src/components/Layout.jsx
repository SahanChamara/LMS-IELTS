import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store-config/store";
import { refreshTokenAPI } from "../redux/features/authSlice";

const Layout = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, data } = useAppSelector(
    (state) => state.auth
  );

  console.log("layout authnticate",isAuthenticated);
  
  const navigate = useNavigate();
  const location = useLocation();
  const lastPath = sessionStorage.getItem("lastPath");

 /*  useEffect(() => {
    let isMounted = true;
    let hasRefreshed = false;

    if (!hasRefreshed && !isAuthenticated && !loading) {
      dispatch(refreshTokenAPI()).then(() => {
        if (isMounted && !loading) {
          const redirectPath = lastPath || "/dashboard";
          // navigate(redirectPath, { replace: true });
          window.location.replace(redirectPath);
        }
      });
      hasRefreshed = true;
    }

    return () => {
      isMounted = false;
    }
    
  },); */

  useEffect(() => {
    if (isAuthenticated && !loading && location.pathname !== "/login") {
      sessionStorage.setItem("lastPath", location.pathname);
    }
  }, [location.pathname, isAuthenticated, loading]);

  if (loading) return <div>Loading...</div>;

  return <Outlet />; // Renders the matched route
};

export default Layout;
