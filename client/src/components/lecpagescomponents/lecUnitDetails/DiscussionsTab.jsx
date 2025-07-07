import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, Search, X } from "lucide-react"; // Added X for toast close


const DiscussionsTab = ({ unit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    { id: 1, text: "Test message", time: "2025-07-03 11:44", sender: "Student", tableId: "" },
    { id: 2, text: "Welcome to the session!", time: "2025-07-03 11:45", sender: "You", tableId: "" },
    { id: 3, text: "Check new message", time: "2025-07-03 11:46", sender: "Student", tableId: "" },
    { id: 4, text: "Please review the topic", time: "2025-07-03 11:47", sender: "You", tableId: "" },
    { id: 5, text: "Check role", time: "2025-07-03 11:49", sender: "Student", tableId: "" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const currentUserId = "lecturer123";
  const currentUserName = "You";
  const currentUserRole = "Lecturer";

  // Retrieve tableId from navigation state or unit prop
  const tableId = location.state?.tableId || unit?.tableId || unit?.id || "";

  // Initialize messages with tableId
  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg) => ({ ...msg, tableId: tableId || "" }))
    );
  }, [tableId]);

  // Scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format timestamp for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata", // IST
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    return date.toDateString() === today.toDateString()
      ? "Today"
      : date.toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" });
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      setToast({
        message: "Message cannot be empty",
        type: "error",
        visible: true,
      });
      return;
    }

    const message = {
      id: Date.now() + Math.random(),
      userId: currentUserId,
      sender: currentUserName,
      role: currentUserRole,
      content: newMessage,
      timestamp: new Date().toISOString(),
      tableId: tableId,
      status: "sending",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    try {
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve({ id: message.id, status: "delivered" }), 500)
      );
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === response.id ? { ...msg, status: response.status } : msg
        )
      );
      setToast({
        message: "Message sent successfully",
        type: "success",
        visible: true,
      });
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, status: "failed" } : msg
        )
      );
      setToast({
        message: `Failed to send message: ${error.message}`,
        type: "error",
        visible: true,
      });
      console.error("Failed to send message:", error);
    } finally {
      scrollToBottom();
    }
  };

  // Handle search messages
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredMessages = messages.filter(
      (msg) =>
        (msg.text?.toLowerCase().includes(term) ||
          msg.content?.toLowerCase().includes(term) ||
          msg.sender.toLowerCase().includes(term)) &&
        (tableId ? msg.tableId === tableId : true)
    );
    setMessages(filteredMessages);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setMessages([
      { id: 1, text: "Test message", time: "2025-07-03 11:44", sender: "Student", tableId: "" },
      { id: 2, text: "Welcome to the session!", time: "2025-07-03 11:45", sender: "You", tableId: "" },
      { id: 3, text: "Check new message", time: "2025-07-03 11:46", sender: "Student", tableId: "" },
      { id: 4, text: "Please review the topic", time: "2025-07-03 11:47", sender: "You", tableId: "" },
      { id: 5, text: "Check role", time: "2025-07-03 11:49", sender: "Student", tableId: "" },
    ].map((msg) => ({ ...msg, tableId: tableId || "" })));
  };

  // Handle logout
  // (Removed unused handleLogout function)

  // Auto-hide toast and close button
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const closeToast = () => setToast((prev) => ({ ...prev, visible: false }));

  // Filter messages by tableId
  const filteredMessages = tableId
    ? messages.filter((msg) => msg.tableId === tableId)
    : messages;

  return (
    <div className="flex min-h-screen bg-gray-50">
   
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">
            Discussions for {unit?.title || "Unit"} {tableId && `(Table ID: ${tableId})`}
          </h1>
          <button
            onClick={() => navigate(`/unit/lecture/${tableId || unit?.id || "default"}`, { state: { tableId } })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm font-semibold disabled:opacity-50"
            aria-label="Back to Quizzes"
          >
            Back to Quizzes
          </button>
        </div>

        {/* Toast Notification */}
        {toast.visible && (
          <div
            role="alert"
            aria-live="polite"
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
              toast.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-600"
            } flex items-center justify-between max-w-md`}
          >
            <span className="text-sm">{toast.message}</span>
            <button
              onClick={closeToast}
              className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Notification Bell */}
        <div className="flex justify-end items-center mb-4">
          <div className="relative w-8 h-8 cursor-pointer">
            <Bell className="w-full h-full text-neutral-600" aria-label="Notifications" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-neutral-600 text-xl font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A12.06 12.06 0 0112 15c2.486 0 4.786.755 6.879 2.041M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="col-span-2 space-y-2">
              <p className="text-base text-neutral-700">
                <strong>ID:</strong> {currentUserId}
              </p>
              <p className="text-base text-neutral-700">
                <strong>Name:</strong> {currentUserName}
              </p>
              <p className="text-base text-neutral-700">
                <strong>Course:</strong> {unit?.title || "CSE101"}
              </p>
              <p className="text-base text-neutral-700">
                <strong>Degree:</strong> Information and Communication Technology
              </p>
              <p className="text-base text-neutral-700">
                <strong>Faculty:</strong> Faculty of Technology
              </p>
            </div>
            <div className="col-span-1 md:col-span-3 flex items-center justify-end mt-4 md:mt-0">
              <p className="text-sm text-neutral-500 mr-4">
                This conversation is between you and students. Check their profiles for more details.
              </p>
              <button
                className="text-blue-600 hover:text-blue-800 text-sm focus:outline-none focus:underline"
                aria-label="View student profiles"
              >
                View Profiles
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search messages or users..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-neutral-900 placeholder-neutral-400 text-base transition-all duration-200"
              aria-label="Search messages or users"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Discussion Section */}
        <div className="bg-white p-6 rounded-lg shadow-md flex-1 flex flex-col">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">
            Discussion for {unit?.title || "Unit"}
          </h2>
          <div className="flex-1 overflow-y-auto space-y-6 pb-6">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start ${
                    msg.sender === "You" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "Student" ? (
                    <>
                      <div className="bg-blue-100 text-neutral-900 p-3 rounded-lg max-w-prose">
                        <p className="text-base">{msg.content || msg.text}</p>
                        <span className="text-sm text-neutral-600 block mt-1">
                          {msg.timestamp ? formatTime(msg.timestamp) : msg.time} | {formatDate(msg.timestamp || msg.time)}
                        </span>
                      </div>
                      <span className="ml-2 text-base text-neutral-600 font-medium">{msg.sender}</span>
                    </>
                  ) : (
                    <>
                      <div className="bg-blue-600 text-white p-3 rounded-lg max-w-prose">
                        <p className="text-base">{msg.content || msg.text}</p>
                        <span className="text-sm text-gray-200 block mt-1">
                          {msg.timestamp ? formatTime(msg.timestamp) : msg.time} | {formatDate(msg.timestamp || msg.time)}
                          {msg.status && ` (${msg.status})`}
                        </span>
                      </div>
                      <span className="ml-2 text-base text-neutral-600 font-medium">{msg.sender}</span>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-neutral-600 text-base text-center">No messages found.</p>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="mt-6 flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message as Lecturer..."
              className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-neutral-900 placeholder-neutral-400 text-base transition-all duration-200"
              aria-label="Type your message"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionsTab;