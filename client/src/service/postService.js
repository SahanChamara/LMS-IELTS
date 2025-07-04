import ApiService from './api-service-config/api-service';

// Fetch posts by course ID
export const getPostsByCourseId = async (courseId, { visibility, status, userId, page = 1, limit = 10 }) => {
  const query = new URLSearchParams({ page, limit });
  if (visibility) query.append('visibility', visibility);
  if (status) query.append('status', status);
  if (userId) query.append('userId', userId);

  const apiObject = {
    method: 'GET',
    withCredentials: true,
    prefix: 'posts/course',
    endpoint: `${courseId}?${query.toString()}`,
  };
  return ApiService.callApi(apiObject);
};

// Create a new post
export const createPost = async (postData, file) => {
  const formData = new FormData();
  formData.append('textContent', postData.textContent || '');
  formData.append('visibility', postData.visibility || 'public');
  formData.append('course', postData.course);
  formData.append('userId', postData.userId);
  formData.append('userName', postData.userName);
  formData.append('userRole', postData.userRole);
  if (file) {
    formData.append('attachment', file);
  }

  const apiObject = {
    method: 'POST',
    withCredentials: true,
    prefix: 'posts',
    endpoint: '',
    body: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  };
  return ApiService.callApi(apiObject);
};

// Add a reaction to a post
export const reactToPost = async (postId, reactionData) => {
  const apiObject = {
    method: 'POST',
    withCredentials: true,
    prefix 'posts/react',
    endpoint: `${postId}`,
    body: reactionData,
  };
  return ApiService.callApi(apiObject);
};

// Add a comment to a post
export const commentOnPost = async (postId, commentData) => {
  const apiObject = {
    method: 'POST',
    withCredentials: true,
    prefix: 'posts/comment',
    endpoint: `${postId}`,
    body: commentData,
  };
  return ApiService.callApi(apiObject);
};

// Delete a post
export const deletePost = async (postId) => {
  const apiObject = {
    method: 'DELETE',
    withCredentials: true,
    prefix: 'posts',
    endpoint: `${postId}`,
  };
  return ApiService.callApi(apiObject);
};