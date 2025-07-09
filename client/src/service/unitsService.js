import ApiService from "./api-service-config/api-service";

export async function getCourseId() {
  const studentId = localStorage.getItem("user");
  if (!studentId) {
    throw new Error("No student ID found in localStorage");
  }
  const apiObject = {
    method: "GET",
    withCredentials: true,
    prefix: "students",
    endpoint: studentId,
  };
    return await ApiService.callApi(apiObject);
}

export async function getAllunits() {
    const student = await getCourseId();
    if (student !== null) {
      const apiObject = {
        method: "GET",
        withCredentials: true,
        prefix: "",
        endpoint: "units?course=" + student.data.enrolledCourse._id,
      };
      return await ApiService.callApi(apiObject);
    }
}

export async function getUnitById(id) {
  try {
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "",
      endpoint: `units/${id}`, 
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("getUnitById error:", error.message);
    throw error;
  }
}

//=========================================================================
export async function getUnitByInstructorId(id) {
  try {
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "",
      endpoint: `units/${id}/units`,  // Fixed here
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("getUnitByInstructorId error:", error.message);
    throw error;
  }
}
//=========================================================================
