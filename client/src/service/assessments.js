import ApiService from "./api-service-config/api-service";

export const addAssessments = async (assessmentData) => {
  const apiObject = {
    method: "POST",
    withCredentials: true,
    prefix: "assessments",
    endpoint: "",
    body: assessmentData,
  };
  return ApiService.callApi(apiObject);
};

export const getAssessmentsByUnitId = async (unitId) => {
  const apiObject = {
    method: "GET",
    withCredentials: true,
    prefix: "assessments/unit",
    endpoint: `${unitId}`,
  };
  return ApiService.callApi(apiObject);
};

export const deleteAssessment = async (assessmentId) => {
  const apiObject = {
    method: "DELETE",
    withCredentials: true,
    endpoint: `assessments/${assessmentId}`,
  };
  return ApiService.callApi(apiObject);
};

export const updateAssessment = async (id, updatedData) => {
  const apiObject = {
    method: "PUT",
    withCredentials: true,
    prefix: "assessments",
    endpoint: `${id}`,
    body: updatedData,
  };
  return ApiService.callApi(apiObject);
};
