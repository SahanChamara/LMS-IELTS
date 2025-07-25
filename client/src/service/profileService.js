import ApiService from "./api-service-config/api-service";

// Fetch student by ID
export async function getStudentById(studentId) {
  try {
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "",
      endpoint: `students/${studentId}`,
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("getStudentById error:", error.message);
    throw error;
  }
}

// Fetch student's enrolled course
export async function getStudentEnrolledCourse(studentId) {
  try {
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "",
      endpoint: `students/${studentId}/enrolled-course`,
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("getStudentEnrolledCourse error:", error.message);
    throw error;
  }
}

// Update student preferences
export async function updateStudent(studentId, studentData) {
  try {
    const apiObject = {
      method: "PUT",
      withCredentials: true,
      prefix: "",
      endpoint: `students/${studentId}`,
      body: studentData,
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("updateStudent error:", error.message);
    throw error;
  }
}