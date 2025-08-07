import ApiService from "./api-service-config/api-service";

// Fetch marks for a student
export async function getMarksByStudentId(studentId, filters = {}) {
  try {
    const { courseId, unit, page = 1, limit = 10 } = filters;
    const queryParams = new URLSearchParams({
      ...(courseId && { courseId }),
      ...(unit && { unit }),
      page,
      limit,
    }).toString();
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "",
      endpoint: `marks/student/${studentId}${queryParams ? `?${queryParams}` : ''}`,
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("getMarksByStudentId error:", error.message);
    throw error;
  }
}