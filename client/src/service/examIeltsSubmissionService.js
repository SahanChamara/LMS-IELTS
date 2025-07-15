import ApiService from "./api-service-config/api-service"

export const createSubmission = async (submission) => {
    const apiObject = {
        method: "POST",
        withCredentials: true,
        prefix:"examIeltsSubmission",
        endpoint: "",
        body: submission,
    }
    return ApiService.callApi(apiObject);
};

export const updateSubmission = async (id,updates) => {

    console.log("Update submission service log", id, updates);
    
    const apiObject = {  
        method: "PUT",
        withCredentials: true,
        prefix: "examIeltsSubmission",
        endpoint: `update/${id}`,
        body: updates,        
    }
    return ApiService.callApi(apiObject);
};

export const getSubmissionById = async (submissionId) => {
    const apiObject = {
        method: "GET",
        withCredentials: true,
        prefix: "examIeltsSubmission",
        endpoint: `getSubmission/${submissionId}`,        
    }
    return ApiService.callApi(apiObject);
};

export const gradeSubmission = async (submissionId, grade) => {
    const apiObject = {
        method: "POST",
        withCredentials: true,
        prefix: "examIeltsSubmission",
        endpoint: `gradeSubmission/${submissionId}`,
        body: grade
    }
    return ApiService.callApi(apiObject);
};