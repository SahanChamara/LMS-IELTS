import axiosApiClient from "../../config/axios-config";
import * as constant from "../../config/constants";
import apiConfig from "../../config/api-config";

class ApiService {
  static getHeaders(apiObject) {
    const headers = {
      "Content-Type": apiObject.urlencoded
        ? "application/x-www-form-urlencoded"
        : apiObject.multipart
        ? "multipart/form-data"
        : "application/json",
    };
    /* if (apiObject.authentication) {      
      const token = localStorage.getItem(constant.ACCESS_TOKEN);
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    } */
    return headers;
  }

  static getUrl(apiObject) {
    const serverUrl = apiConfig.serverUrl;
    let basePath = apiConfig.basePath;
    if (apiObject.basePath) {
      basePath = apiObject.basePath;
    }
    const prefix = apiObject.prefix;
    return `${serverUrl}/${basePath}${prefix ? "/" + prefix : ""}/${
      apiObject.endpoint
    }`;
  }

  static handleError(error, apiObject) {
    if (!error.response) {
      return {
        success: false,
        status: 2,
        result: "Your connection was interrupted",
        data: null,
      };
    }
    const status = error.response.status;
    // if (status === 401) {      
    //   /* if (apiObject.type !== "AUTH") {
    //     localStorage.removeItem(constant.ACCESS_TOKEN);
    //   } */
    //   return {
    //     success: false,
    //     status: 2,
    //     result: "Your session expired! Please login again..",
    //     data: null,
    //   };
    // }
    // if (status === 403) {
    //   return {
    //     success: false,
    //     status: 2,
    //     result: "Access is denied.",
    //     data: null,
    //   };
    // }
    if (status === 417) {
      return {
        success: false,
        status: 2,
        result: "Oops! Something went wrong.",
        data: null,
      };
    }
    if (error.response.data) {
      return {
        success: false,
        status: 0,
        result: error.response.data.result || "Sorry, something went wrong",
        data: null,
      };
    }
    return {
      success: false,
      status: 2,
      result: "Sorry, something went wrong.",
      data: null,
    };
  }

  static async callApi(apiObject) {
    const method = apiObject.method ? apiObject.method.toLowerCase() : "get";
    const body =
      (method === "post" || method === "put" || method === "patch")
        ? apiObject.body || {}
        : undefined;
    const headers = ApiService.getHeaders(apiObject);
    const url = ApiService.getUrl(apiObject);

    try {
      const response = await axiosApiClient({
        method,
        url,
        data: method !== "get" && method !== "delete" ? body : undefined,
        headers,
        withCredentials: apiObject.withCredentials || true,
      });

      return {
        ...response.data,
        desc: response.data.desc || response.data.result,
        status: response?.status || 0,
      };
    } catch (error) {
      return ApiService.handleError(error, apiObject);
    }
  }
}

export default ApiService;
