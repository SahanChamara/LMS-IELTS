import ApiService from './api-service-config/api-service';

export const getSessionsByUnitId = async (unitId) => {
  try {
    console.log(`Fetching sessions for unit ID: ${unitId}`);
    const apiObject = {
      method: 'GET',
      withCredentials: true,
      prefix: '',
      endpoint: `onlineSession/unitId/${unitId}`,
    };
    const response = await ApiService.callApi(apiObject);
    if (!response.success || !response.data) {
      throw new Error(response.result || 'Failed to fetch sessions');
    }
    console.log('Sessions fetched successfully:', response.data);
    return response.data.map((session) => ({
      id: session._id,
      title: session.title,
      date: new Date(session.date).toISOString().split('T')[0],
      time: new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      instructor: session.instructor?.name || 'Unknown',
      meetingLink: session.link,
      description: session.description || '',
    }));
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw new Error(error.result || error.message || 'Failed to fetch sessions');
  }
};

export const createSession = async (sessionData) => {
  try {
    console.log('Sending session data:', JSON.stringify(sessionData, null, 2));
    const apiObject = {
      method: 'POST',
      withCredentials: true,
      prefix: '',
      endpoint: 'onlineSession',
      body: sessionData,
    };
    const response = await ApiService.callApi(apiObject);
    if (!response.success || !response.data) {
      throw new Error(response.result || 'Failed to create session');
    }
    const session = response.data;
    return {
      id: session._id,
      title: session.title,
      date: new Date(session.date).toISOString().split('T')[0],
      time: new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      instructor: session.instructor?.name || 'Unknown',
      meetingLink: session.link,
      description: session.description || '',
    };
  } catch (error) {
    console.error('Error creating session:', error);
    throw new Error(error.result || error.message || 'Failed to create session');
  }
};