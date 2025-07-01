import ApiService from "./api-service-config/api-service";

// Get All Asignments...
export const getAllAssignments = async () => {
  const apiObject = {
    method: "GET",
    withCredentials: true,
    prefix: "assignment",
    endpoint: "",
  };
  return ApiService.callApi(apiObject);
};

// Upload Assignment
export const uploadAssignment = async (uploadAssignment) => {
  const apiObject = {
    method: "POST",
    withCredentials: true,
    prefix: "submitAssignment",
    endpoint: "",
    body: uploadAssignment,
  };
  return ApiService.callApi(apiObject);
};

export const getAssignmentsByUnitId = async (unitId) => {
  const apiObject = {
    method: "GET",
    withCredentials: true,
    prefix: "assignment/unit",
    endpoint: `${unitId}`,
  };
  return ApiService.callApi(apiObject);
};
