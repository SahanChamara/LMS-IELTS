import { Outlet, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store-config/store";
import { useEffect } from "react";
import { refreshTokenAPI } from "../redux/features/authSlice";
import Cookies from "js-cookie";

const ProtectedRoute = ({ allowedRoles }) => {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated, data, error } = useAppSelector(
    (state) => state.auth
  );

  console.log("Protected Route auth", isAuthenticated, data, loading, error);

  useEffect(() => {
  let isMounted = true;
  const accessToken = Cookies.get("accessToken");
  if (!isAuthenticated && !loading && !accessToken) {
    console.log("refresh api calling");
    dispatch(refreshTokenAPI())
      .unwrap()
      .catch((err) => console.error("Refresh Token Failed", err));
  }
  return () => {
    isMounted = false;
  };
}, [dispatch, isAuthenticated, loading]);

  /* useEffect(() => {
    let isMounted = true;
    const accessToken = Cookies.get("accessToken");
    if (!isAuthenticated && !loading && !data && !accessToken) {
      console.log("refresh api calling");
      
      dispatch(refreshTokenAPI())
        .then(() => {
          console.log("Refresh Token Attempt Completed");
        })
        .catch((err) => {
          console.error("Refresh Token Failed", err);
        })
        .finally(() => {
          if (isMounted && !loading && !isAuthenticated) {
            window.location.href = "/login";
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, isAuthenticated, loading, data]); */

  if (loading) return null;

  const hasAccess = isAuthenticated && (!allowedRoles || (data?.role && allowedRoles.includes(data.role)));
  console.log("has access", hasAccess);

  return hasAccess ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      state={{ message: error || "Please log in or check permissions." }}
      replace
    />
  );
};

export default ProtectedRoute;
