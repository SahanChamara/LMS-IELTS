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
