import ApiService from "./api-service-config/api-service";

export async function getAllCourses() {
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "courses",
      endpoint: '',
    };
  return await ApiService.callApi(apiObject);
}


export async function enrolledStudent(courseId, studentId) {
    const apiObject = {
      method: "PUT",
      withCredentials: true,
      prefix: `students/${studentId}`,
      endpoint: 'admin',
      body: courseId,
    };
  return await ApiService.callApi(apiObject);
}

export async function getInstructorById(id) {
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "instructors",
      endpoint: id,
    };
  return await ApiService.callApi(apiObject);
}
