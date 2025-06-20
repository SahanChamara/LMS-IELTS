import ApiService from './api-service-config/api-service';

export async function updateLessonCompleted(lessonId, completed) {
  try {
    const apiObject = {
      method: 'PUT',
      authentication: true,
      prefix: '',
      endpoint: `lessons/${lessonId}/completed`,
      body: { completed },
    };
    const response = await ApiService.callApi(apiObject);
    return response.data; 
  } catch (error) {
    console.error('updateLessonCompleted error:', error.message);
    throw error;
  }
}