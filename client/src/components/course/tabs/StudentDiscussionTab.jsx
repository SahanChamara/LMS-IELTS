import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Image } from "lucide-react";
import { Check } from "lucide-react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/store-config/store";
import {
  getMessageAPI,
  sendNewMessageAPI,
} from "../../../redux/features/discussionSlice";

const StudentDiscussionsTab = ({ unitId }) => {
  console.log("unit ID", unitId);

  const dispatch = useAppDispatch();
  const { chat, loading } = useAppSelector((state) => state.discussions);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("user");
  const currentUserRole = localStorage.getItem("userRole");
  const currentUserName = localStorage.getItem("userName");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await dispatch(getMessageAPI(unitId)).unwrap();
        console.log("get Message Result", response);

        setMessages(
          response.data.map((m) => ({
            id: m._id || Date.now() + Math.random(), // Use server ID if available
            userId: m.senderId,
            sender: m.senderName,
            role: m.user,
            content: m.msg,
            timestamp: m.timestamp,
            avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`,
            status: currentUserId === m.senderId ? "sent" : "read",
          }))
        );
      } catch (err) {
        setError("No Messages");
      }
    };
    fetchMessages();
  }, [unitId, dispatch]); // Added dispatch to dependency array

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    return date.toDateString() === today.toDateString()
      ? "Today"
      : date.toLocaleDateString();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now() + Math.random(), // Temporary ID
      userId: currentUserId,
      sender: currentUserName,
      role: currentUserRole,
      content: newMessage,
      timestamp: new Date().toISOString(),
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`,
      status: "sending",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    try {
      const newSendMessage = { unitId, newMessage };
      const result = await dispatch(sendNewMessageAPI(newSendMessage)).unwrap();
      console.log("new message send result", result);

      // Update the message with the server response (e.g., real ID and status)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === message.id
            ? {
                ...m,
                id: result.data._id || m.id, // Use server-generated ID
                status: "sent",
              }
            : m
        )
      );
    } catch (err) {
      setError("Failed to send message");
      setMessages((prev) => prev.filter((m) => m.id !== message.id));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach((m) => {
      const date = formatDate(m.timestamp);
      if (!groups[date]) groups[date] = [];
      groups[date].push(m);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <h1 className="text-center">{error && <p className="text-xs text-red-500 mt-2">{error}</p>}</h1>
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="flex items-center justify-center my-4">
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-xs font-medium text-gray-600">
                  {date}
                </span>
              </div>
            </div>
            {dateMessages.map((message, index) => ( // Map only date-specific messages            
              <div
                key={message.id}
                className={`flex ${
                  message.role === "Student" ? "justify-end" : "justify-start"
                } mt-4`}
              >                
                <div
                  className={`flex max-w-xs lg:max-w-md ${
                    message.userId === currentUserId
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  <img
                    src={message.avatar}
                    alt={message.sender}
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                  <div
                    className={`flex flex-col ${
                      message.userId === currentUserId
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-gray-900">
                        {message.sender}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          message.role === "Instructor"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {message.role}
                      </span>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        message.role === "Student"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <div
                      className={`flex items-center mt-1 ${
                        message.userId === currentUserId
                          ? "flex-row-reverse space-x-reverse"
                          : "flex-row"
                      }`}
                    >
                      <span className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.userId === currentUserId &&
                        message.status === "sent" && (
                          <Check className="w-3 h-3 text-blue-500 ml-1" />
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
        <div className="flex items-end space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question or share your thoughts..."
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
            rows="1"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full ${
              newMessage.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default StudentDiscussionsTab;