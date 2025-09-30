import ApiService from "./api-service-config/api-service";

export const getAllLectures = async () => {
  const apiObject = {
    method: 'GET',
    withCredentials: true,
    prefix: 'instructors',
    endpoint: '',
  }
  const response = await ApiService.callApi(apiObject);
  return response;
}

export const registerUser = async () => {
  const apiObject = {
    method: 'POST',
    withCredentials: true,
    prefix: 'auth',
    endpoint: 'register',
  }
  const response = await ApiService.callApi(apiObject);
  return response;
}

export const sendRegisterDetail = async () => {
  const apiObject = {
    method: 'POST',
    withCredentials: true,
    prefix: 'admin',
    endpoint: 'sendRegisterDetail',
  }
  const response = await ApiService.callApi(apiObject);
  return response;
}

export const updateUser = async (userId) => {
  const apiObject = {
    method: 'PUT',
    withCredentials: true,
    prefix: '',
    endpoint: 'students/' + userId,
  }
  const response = await ApiService.callApi(apiObject);
  return response;
}