import ApiService from "./api-service-config/api-service";

// Create a new post
export async function createPost(postData) {
  try {
    console.log(postData);
    const apiObject = {
      method: "POST",
      withCredentials: true,
      prefix: "",
      endpoint: "posts",
      body: postData,
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
      method: "PUT",
      withCredentials: true,
      prefix: "",
      endpoint: `posts/approve/${postId}`,
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
      endpoint: `posts/react/${postId}`,
      body: reactionData, // { type, userId, userName }
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("reactPost error:", error.message);
    throw error;
  }
}

// Remove a reaction from a post
export async function removeReaction(postId, userId) {
  try {
    console.log("Removing reaction for postId:", postId, "userId:", userId);
    const apiObject = {
      method: "PUT",
      withCredentials: true,
      prefix: "",
      endpoint: `posts/react/remove/${postId}`,
      body: { userId }, // { userId }
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("removeReaction error:", error.message);
    throw error;
  }
}

// Update a reaction type for a post
export async function updateReaction(postId, reactionData) {
  try {
    const apiObject = {
      method: "PUT",
      withCredentials: true,
      prefix: "",
      endpoint: `posts/react/edit/${postId}`,
      body: reactionData, // { type, userId, userName }
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("updateReaction error:", error.message);
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
      endpoint: `posts/comment/${postId}`,
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
      endpoint: `posts${queryParams ? `?${queryParams}` : ''}`,
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
    
    const response = await ApiService.callApi(apiObject);
    console.log(response);
    return response;
  } catch (error) {
    console.error("getPostsByCourseId error:", error.message);
    throw error;
  }
}