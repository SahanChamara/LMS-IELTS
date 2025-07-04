import ApiService from "./api-service-config/api-service";

export const getStudentProfile = async (studentId) => {
  const apiObject = {
    method: 'GET',
    withCredentials: true,
    prefix: 'students',
    endpoint: `${studentId}`,
  };
  const response = ApiService.callApi(apiObject);
  console.log(response);
  return response;
  
};