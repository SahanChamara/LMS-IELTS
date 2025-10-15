import { method } from "lodash";
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

// Upload Assignment by Student
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


export const addAssignmentByInstructor = async (assignment) => {
  const apiObject = {
    method: "POST",
    withCredentials: true,
    prefix: "assignment",
    endpoint: "",
    body: assignment,
  };
  return ApiService.callApi(apiObject);
}


export const getAllSubmittedAssignment = async () => {
  const apiObject = {
    method: "GET",
    withCredentials: true,
    prefix: "submitAssignment",
    endpoint: "getAllSubmissions",
  };
  return ApiService.callApi(apiObject);
};

export const getSubmitAssByUnitId = async (unitId) => {
  const apiObject = {
    method: "GET",
    withCredentials: true,
    prefix: "submitAssignment",
    endpoint: `submissions/unit/${unitId}`,
  };
  return ApiService.callApi(apiObject);
};

export const updateSubmissionGrade = async (submissionId,updateSubmissionGrade) => {
  const apiObject = {
    method: "PUT",
    withCredentials: true,
    prefix: "submitAssignment",
    endpoint: `submissions/${submissionId}/grade `,
    body: updateSubmissionGrade,
  };
  return ApiService.callApi(apiObject);
};