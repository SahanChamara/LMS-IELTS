import ApiService from './api-service-config/api-service';

/**
 * Fetch exams by unit ID
 * @param {string} unitId - The ID of the unit
 * @returns {Promise<Array>} - Array of exam objects
 */
export const getExamsByUnitId = async (unitId) => {
  try {
    console.log('Fetching exams for unit ID:', unitId);
    const apiObject = {
      method: 'GET',
      withCredentials: true,
      prefix: '',
      endpoint: `exams/unitId/${unitId}`,
    };
    const response = await ApiService.callApi(apiObject);
    console.log('Exams fetched successfully:', response);

    if (!response.success || !response.data) {
      throw new Error(response.result || 'Failed to fetch exams');
    }

    return response.data.map((exam) => ({
      id: exam._id,
      title: exam.title,
      date: new Date(exam.date).toISOString().split('T')[0], // YYYY-MM-DD
      description: exam.description || '',
      lessons: exam.lessons || [], // Use API-provided lessons if available
      time: new Date(exam.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // e.g., "10:00 AM"
      location: exam.location || 'TBD',
      duration: `${exam.duration} hours`,
    }));
  } catch (error) {
    console.error('Error fetching exams by unit ID:', error);
    throw new Error(error.result || error.message || 'Failed to fetch exams');
  }
};

/**
 * Create a new exam
 * @param {Object} examData - Exam data to create
 * @returns {Promise<Object>} - Created exam object
 */
export const createExam = async (examData) => {
  try {
    const apiObject = {
      method: 'POST',
      withCredentials: true,
      prefix: '',
      endpoint: 'exams',
      body: examData,
    };
    const response = await ApiService.callApi(apiObject);
    console.log('Exam created successfully:', response);

    if (!response.success || !response.data) {
      throw new Error(response.result || 'Failed to create exam');
    }

    const exam = response.data;
    return {
      id: exam._id,
      title: exam.title,
      date: new Date(exam.date).toISOString().split('T')[0],
      description: exam.description || '',
      lessons: examData.lessons || [], // Use client-side lessons
      time: new Date(exam.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: exam.location || 'TBD',
      duration: `${exam.duration} hours`,
    };
  } catch (error) {
    console.error('Error creating exam:', error);
    throw new Error(error.result || error.message || 'Failed to create exam');
  }
};

/**
 * Update an existing exam
 * @param {string} examId - The ID of the exam
 * @param {Object} examData - Updated exam data
 * @returns {Promise<Object>} - Updated exam object
 */
export const updateExam = async (examId, examData) => {
  try {
    const apiObject = {
      method: 'PUT',
      withCredentials: true,
      prefix: '',
      endpoint: `exams/${examId}`,
      body: examData,
    };
    const response = await ApiService.callApi(apiObject);
    console.log('Exam updated successfully:', response);

    if (!response.success || !response.data) {
      throw new Error(response.result || 'Failed to update exam');
    }

    const exam = response.data;
    return {
      id: exam._id,
      title: exam.title,
      date: new Date(exam.date).toISOString().split('T')[0],
      description: exam.description || '',
      lessons: examData.lessons || [], // Use client-side lessons
      time: new Date(exam.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: exam.location || 'TBD',
      duration: `${exam.duration} hours`,
    };
  } catch (error) {
    console.error('Error updating exam:', error);
    throw new Error(error.result || error.message || 'Failed to update exam');
  }
};