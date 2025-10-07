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

//=========================================================================
export async function getQuestionsByAssessmentId(id) {
  try {
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "",
      endpoint: `quiz/assessment/${id}`,
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("getQuestionsByUnitId error:", error.message);
    throw error;
  }
}

export const addQuestion = async (questionData) => {
  const apiObject = {
    method: "POST",
    withCredentials: true,
    prefix: "quiz",
    endpoint: "",
    body: questionData,
  };
  return ApiService.callApi(apiObject);
};

// export const updateQuestion = async (questionData) => {
//   const apiObject = {
//     method: "PUT",
//     withCredentials: true,
//     prefix: "quiz",
//     endpoint: "",
//     body: questionData,
//   };
//   return ApiService.callApi(apiObject);
// };

export const updateQuestion = async (id, questionData) => {
  const apiObject = {
    method: "PUT",
    withCredentials: true,
    prefix: "quiz",
    endpoint: `${id}`,
    body: questionData,
  };
  return ApiService.callApi(apiObject);
};

export const deleteQuestionById = async (questionId) => {
  const apiObject = {
    method: "DELETE",
    withCredentials: true,
    prefix: "quiz",
    endpoint: `${questionId}`,
  };
  return ApiService.callApi(apiObject);
};
//=========================================================================