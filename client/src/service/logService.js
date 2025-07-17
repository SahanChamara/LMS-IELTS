import ApiService from "./api-service-config/api-service";

export async function createLog(userId, unitId) {
  try {
    const apiObject = {
      method: "POST",
      withCredentials: true, // Adjust based on server requirements
      prefix: "", // Confirm if prefix is needed
      endpoint: "logs",
      authentication: true, // Enable if server requires Bearer token
      body: {
        user: localStorage.getItem("user"),
        unit: unitId,
      },
    };
    console.log("createLog payload:", apiObject.body); // Debug payload
    const response = await ApiService.callApi(apiObject);
    console.log("createLog response:", response); // Debug response
    return response;
  } catch (error) {
    console.error("createLog error:", error.message, error);
    throw error;
  }
}

export async function getLogs({ unitId, userId } = {}) {
  try {
    let endpoint = "logs";
    if (unitId || userId) {
      const queryParams = [];
      if (unitId) queryParams.push(`unit=${unitId}`);
      if (userId) queryParams.push(`user=${userId}`);
      endpoint += `?${queryParams.join("&")}`;
    }
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "",
      endpoint,
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("getLogs error:", error.message);
    throw error;
  }
}

export async function getLogById(logId) {
  try {
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "",
      endpoint: `logs/${logId}`,
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("getLogById error:", error.message);
    throw error;
  }
}

export async function deleteLog(logId) {
  try {
    const apiObject = {
      method: "DELETE",
      withCredentials: true,
      prefix: "",
      endpoint: `logs/${logId}`,
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("deleteLog error:", error.message);
    throw error;
  }
}

export async function getLastFiveUniqueUnitsByStudent() {
  try {
    const studentId = localStorage.getItem("user");
    if (!studentId) {
      throw new Error("No student ID found in localStorage");
    }
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "",
      endpoint: `logs/user/${studentId}`,
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("getLastFiveUniqueUnitsByStudent error:", error.message);
    throw error;
  }
}