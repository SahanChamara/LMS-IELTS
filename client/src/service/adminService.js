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

export const registerUser = async (registerDetails) => {
  const apiObject = {
    method: 'POST',
    withCredentials: true,
    prefix: 'auth',
    endpoint: 'register',
    body: registerDetails,
  }
  const response = await ApiService.callApi(apiObject);
  return response;
}

export const sendRegisterDetail = async (registerDetails) => {
  const apiObject = {
    method: 'POST',
    withCredentials: true,
    prefix: 'admin',
    endpoint: 'sendRegisterDetail',
    body: registerDetails,
  }
  const response = await ApiService.callApi(apiObject);
  return response;
}

export const updateUser = async (userId,updatedDetails) => {
  const apiObject = {
    method: 'PUT',
    withCredentials: true,
    prefix: 'students',
    endpoint: userId,
    body: updatedDetails,
  }
  const response = await ApiService.callApi(apiObject);
  return response;
}

export const updateLecture = async (instructorId, updatedDetails) => {
  const apiObject = {
    method: 'PUT',
    withCredentials: true,
    prefix: 'instructors',
    endpoint: instructorId,
    body: updatedDetails,
  }
  const response = await ApiService.callApi(apiObject);
  return response;
}