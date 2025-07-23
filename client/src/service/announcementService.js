import ApiService from "./api-service-config/api-service";

// Create a new announcement
export async function createAnnouncement(announcementData) {
  try {
    const apiObject = {
      method: "POST",
      withCredentials: true,
      prefix: "",
      endpoint: "announcement",
      body: announcementData, // { title, description, course }
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("createAnnouncement error:", error.message);
    throw error;
  }
}

// Fetch all announcements (SuperAdmin only)
export async function getAnnouncements() {
  try {
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "",
      endpoint: "announcement",
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("getAnnouncements error:", error.message);
    throw error;
  }
}

// Fetch announcements by course ID
export async function getAnnouncementsByCourseId(courseId) {
  try {
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "",
      endpoint: `announcement/course/${courseId}`,
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("getAnnouncementsByCourseId error:", error.message);
    throw error;
  }
}

// Update an announcement
export async function updateAnnouncement(announcementId, announcementData) {
  try {
    const apiObject = {
      method: "PUT",
      withCredentials: true,
      prefix: "",
      endpoint: `announcement/${announcementId}`,
      body: announcementData, // { title, description, course, date }
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("updateAnnouncement error:", error.message);
    throw error;
  }
}

// Delete an announcement
export async function deleteAnnouncement(announcementId) {
  try {
    const apiObject = {
      method: "DELETE",
      withCredentials: true,
      prefix: "",
      endpoint: `announcement/${announcementId}`,
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("deleteAnnouncement error:", error.message);
    throw error;
  }
}