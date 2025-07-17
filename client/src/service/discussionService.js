import ApiService from "./api-service-config/api-service";

export const sendNewMessage = async (newMessage) => {
  const apiObject = {
    method: "POST",
    withCredentials: true,
    prefix: "discussion",
    endpoint: "chat",
    body: newMessage,
  };
  return await ApiService.callApi(apiObject);
};

export const getMessage = async (unitId) => {
  const apiObject = {
    method: "GET",
    withCredentials: true,
    prefix: "discussion",
    endpoint: `unit/${unitId}/messages`,
  };
  return await ApiService.callApi(apiObject);
};

// Instructor Reply Message
export const replyMessage = async (replyMessage) => {
  const apiObject = {
    method: "POST",
    withCredentials: true,
    prefix: "discussion",
    endpoint: "reply",
    body: replyMessage,
  }
  return await ApiService.callApi(apiObject);
};
