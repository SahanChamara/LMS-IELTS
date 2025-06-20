import ApiService from "./api-service-config/api-service";

// Get All Asignments...
export const getAllAssignments = async () => {
  const apiObject = {
    method: "GET",
    withCredentials: true,
    prefix: "assignment",
    endpoint: "",
  };
  return await ApiService.callApi(apiObject);
};
