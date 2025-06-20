// components/InstructorDiscussionsTab.js
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Paperclip, Image } from "lucide-react";
import { Check } from "lucide-react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/store-config/store";
import { getMessageAPI, replyMessageAPI } from "../../../redux/features/discussionSlice";

const InstructorDiscussionsTab = ({ unitId }) => {
  const dispatch = useAppDispatch();
  const { chat, loading } = useAppSelector((state) => state.discussions);

  const [messages, setMessages] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  //const currentUser = JSON.parse(localStorage.getItem('user')) || { name: "Dr. Sarah Wilson", role: "instructor", id: "instructor1" };
  const currentUserId = localStorage.getItem("user");
  const currentUserRole = localStorage.getItem("userRole");
  const currentUserName = localStorage.getItem("userName");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await dispatch(getMessageAPI(unitId)).unwrap();
        setMessages(
          response.data.data.map((m) => ({
            id: Date.now() + Math.random(),
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
        setError("Failed to load messages");
      }
    };
    fetchMessages();
  }, [unitId]);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => scrollToBottom(), [messages]);

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

  const handleReply = async (messageId) => {
    if (!newReply.trim()) return;
    const discussionId =
      messages.find((m) => m.id === messageId)?.discussionId || ""; // Placeholder, adjust logic
    if (!discussionId) return;

    const replyMessage = {
      id: Date.now() + Math.random(),
      userId: currentUserId,
      sender: currentUserName,
      role: currentUserRole,
      content: newReply,
      timestamp: new Date().toISOString(),
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`,
      status: "sending",
    };

    setMessages((prev) => [...prev, replyMessage]);
    setNewReply("");

    try {
      await axios.post(
        "/api/discussion/reply",
        { discussionId, reply: newReply },
        { withCredentials: true }
      );

      const newSendReply = { discussionId, newReply };
      const result = await dispatch(replyMessageAPI(newSendReply)).unwrap();
      console.log("new Reply message send result", result);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === replyMessage.id ? { ...m, status: "sent" } : m
        )
      );
      // Refresh to get updated discussion
      const response = await dispatch(getMessageAPI(unitId)).unwrap();
      setMessages(
        response.data.data.map((m) => ({
          id: Date.now() + Math.random(),
          userId: m.senderId,
          sender: m.senderName,
          role: m.user,
          content: m.msg,
          timestamp: m.timestamp,
          avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`,
          status: currentUserId === m.senderId ? "sent" : "read",
        }))
      );
      setError(null);
    } catch (err) {
      setError("Failed to send reply", err);
      setMessages((prev) => prev.filter((m) => m.id !== replyMessage.id));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReply(messages[messages.length - 1]?.id); // Reply to the latest message
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
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="flex items-center justify-center my-4">
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-xs font-medium text-gray-600">
                  {date}
                </span>
              </div>
            </div>
            {dateMessages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${
                  message.userId === currentUserId
                    ? "justify-end"
                    : "justify-start"
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
                    {!message.userId === currentUserId && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium text-gray-900">
                          {message.sender}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            message.role === "instructor"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {message.role}
                        </span>
                      </div>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        message.userId === currentUserId
                          ? "bg-purple-500 text-white"
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
                          <Check className="w-3 h-3 text-purple-500 ml-1" />
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
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your reply..."
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white"
            rows="1"
          />
          <button
            onClick={() => handleReply(messages[messages.length - 1]?.id)}
            disabled={!newReply.trim()}
            className={`p-3 rounded-full ${
              newReply.trim()
                ? "bg-purple-500 text-white hover:bg-purple-600"
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

export default InstructorDiscussionsTab;
