import ApiService from "./api-service-config/api-service";

export async function getQuizByUnitId(id) {
  try {
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "",
      endpoint: `quiz/assessment/${id}`,
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("getQuizById error:", error.message);
    throw error;
  }
}

export async function postAssessmentMarks(data) {
  console.log("postAssessmentMarks data:", data);
  try {
    const apiObject = {
      method: "POST",
      withCredentials: true,
      prefix: "",
      endpoint: "assessmentMarks",
      body:data,
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("postAssessmentMarks error:", error.message);
    throw error;
  }
}