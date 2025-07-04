import ApiService from "./api-service-config/api-service";

export const registerUser = async (userCredentials) => {
  const apiObject = {};
  apiObject.method = "POST";
  //apiObject.authentication = false;
  apiObject.prefix = "auth";
  apiObject.endpoint = "register";
  apiObject.body = userCredentials;
  apiObject.withCredentials = false;
  return await ApiService.callApi(apiObject);
};

export const loginUser = async (userCredentials) => {
  const apiObject = {};
  apiObject.method = "POST";
  //apiObject.authentication = false;
  apiObject.prefix = "auth";
  apiObject.endpoint = "login";
  apiObject.body = userCredentials; 
  apiObject.withCredentials = true; 
  return await ApiService.callApi(apiObject);
 
};

export const refreshToken = async () => {
  const apiObject = {};
  apiObject.method = "POST";
  apiObject.prefix = "auth";
  apiObject.endpoint = "refresh-token";
  apiObject.withCredentials = true;
  return await ApiService.callApi(apiObject);
}
