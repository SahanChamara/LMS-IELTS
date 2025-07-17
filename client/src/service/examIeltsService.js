import ApiService from "./api-service-config/api-service";

export const getAllPublishedExam = async () => {
  const apiObject = {
    method: "GET",
    withCredentials: true,
    prefix: "examIelts",
    endpoint: "published",
  };
  return ApiService.callApi(apiObject);
};

export const getexamById = async (examId) => {
  const apiObject = {
    method: "GET",
    withCredentials: true,
    prefix: "examIelts",
    endpoint: `exams/${examId}`,
  };
  return ApiService.callApi(apiObject);
};
