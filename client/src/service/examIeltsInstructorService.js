import ApiService from "./api-service-config/api-service";

export const getAllExams = async () => {
  const apiObject = {
    method: "GET",
    withCredentials: true,
    prefix: "examIelts",
    endpoint: "getAllExams",
  };
  return ApiService.callApi(apiObject);
};

export const createExam = async (exam) => {
  const apiObject = {
    method: "POST",
    withCredentials: true,
    prefix: "examIelts",
    endpoint: "exam",
    body: exam,
  };
  return ApiService.callApi(apiObject);
};

export const createSection = async (section) => {
  const apiObject = {
    method: "POST",
    withCredentials: true,
    prefix: "examIelts",
    endpoint: "sections",
    body: section,
  };
  return ApiService.callApi(apiObject);
};

export const createQuestion = async (question) => {
  const apiObject = {
    method: "POST",
    withCredentials: true,
    prefix: "examIelts",
    endpoint: "questions",
    body: question,
  };
  return ApiService.callApi(apiObject);
};
