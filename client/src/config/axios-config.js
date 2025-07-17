import axios from "axios";
import store from "../redux/store-config/store";
import { logout, refreshTokenAPI } from "../redux/features/authSlice";

const API_BASE_URL = "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  /*  headers: {
    "Content-Type": "application/json",
  }, */
});

let isRefreshing = false;
let refreshPromise = null;

// Request Interceptor
// apiClient.interceptors.request.use(
//   (config) => {

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

let refreshSubscribers = [];

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    console.log("error status", status);

    // Handle 401 Unauthorized (token expired)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        //refreshPromise = store.dispatch(refreshTokenAPI()).unwrap();

        try {
          const response = await store.dispatch(refreshTokenAPI()).unwrap();
          console.log("axios config response", response);

          const newAccessToken = response.accessToken;
          isRefreshing = false;
          onRefreshed(newAccessToken);
          // // Update cookie manually if needed
          // Cookies.set("accessToken", newAccessToken, {
          //   httpOnly: true,
          //   secure: process.env.NODE_ENV === "production",
          //   sameSite: "strict",
          //   maxAge: 15 * 60 * 1000,
          // });

          //isRefreshing = false;
          //refreshPromise = null;

          return apiClient(originalRequest);

        } catch (refreshError) {
          // Refresh token failed - logout user
          //store.dispatch(logout());
          isRefreshing = false;
          //refreshPromise = null;
          store.dispatch(logout());
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(originalRequest));
        });
      });

    }

    // Handle 403 Forbidden (role-based access)
    if (status === 403) {
      /* swal({
        title: "Access Denied",
        text: "You don't have permission to access this resource.",
        icon: "error",
        button: "OK",
      }); */
      return Promise.reject(error);
    }

    // Handle other errors
    if (status >= 500) {
      /* swal({
        title: "Server Error",
        text: "Something went wrong on our end. Please try again later.",
        icon: "error",
        button: "OK",
      }); */
    }

    return Promise.reject(error);
  }
);

export default apiClient;
