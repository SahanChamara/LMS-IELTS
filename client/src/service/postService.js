import ApiService from "./api-service-config/api-service";

// Create a new post
export async function createPost(postData) {
  try {
    console.log(postData)
    const apiObject = {
      method: "POST",
      withCredentials: true,
      prefix: "",
      endpoint: "posts",
      body: postData, // { textContent, attachments, visibility, course, userId, userName, userRole }
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("createPost error:", error.message);
    throw error;
  }
}

// Approve or reject a post (admin only)
export async function approvePost(postId, status) {
  try {
    if (!['approved', 'rejected'].includes(status)) {
      throw new Error("Invalid status");
    }
    const apiObject = {
      method: "PATCH",
      withCredentials: true,
      prefix: "",
      endpoint: `posts/${postId}/approve`,
      body: { status },
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("approvePost error:", error.message);
    throw error;
  }
}

// Delete a post (admin or post owner)
export async function deletePost(postId) {
  try {
    const apiObject = {
      method: "DELETE",
      withCredentials: true,
      prefix: "",
      endpoint: `posts/${postId}`,
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("deletePost error:", error.message);
    throw error;
  }
}

// Add a reaction to a post
export async function reactPost(postId, reactionData) {
  try {
    const apiObject = {
      method: "POST",
      withCredentials: true,
      prefix: "",
      endpoint: `posts/${postId}/react`,
      body: reactionData, // { type, userId, userName }
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("reactPost error:", error.message);
    throw error;
  }
}

// Add a comment to a post
export async function commentPost(postId, commentData) {
  try {
    const apiObject = {
      method: "POST",
      withCredentials: true,
      prefix: "",
      endpoint: `posts/${postId}/comment`,
      body: commentData, // { content, userId, userName, userRole }
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("commentPost error:", error.message);
    throw error;
  }
}

// Fetch posts with optional filtering
export async function getPosts(filters = {}) {
  try {
    const { visibility, status, userId, course, page = 1, limit = 10 } = filters;
    const queryParams = new URLSearchParams({
      ...(visibility && { visibility }),
      ...(status && { status }),
      ...(userId && { userId }),
      ...(course && { course }),
      page,
      limit,
    }).toString();
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "",
      endpoint: `posts`,
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("getPosts error:", error.message);
    throw error;
  }
}

// Fetch posts by course ID
export async function getPostsByCourseId(courseId, filters = {}) {
  try {
    const { visibility, status, userId, page = 1, limit = 10 } = filters;
    const queryParams = new URLSearchParams({
      ...(visibility && { visibility }),
      ...(status && { status }),
      ...(userId && { userId }),
      page,
      limit,
    }).toString();
    
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "",
      endpoint: `posts/course/${courseId}${queryParams ? `?${queryParams}` : ''}`,
    };
    
    const reponse = await ApiService.callApi(apiObject);
    console.log(reponse);
    return reponse;
  } catch (error) {
    console.error("getPostsByCourseId error:", error.message);
    throw error;
  }
}