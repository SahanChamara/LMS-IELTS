import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, Search, X, ChevronLeft, MoreVertical } from "lucide-react";

const DiscussionsTab = ({ unit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  
  // Sample data for chat list
  const [chatList, setChatList] = useState([
    {
      id: "group1",
      name: "Smith Boxlencer",
      lastMessage: "Please review the topic",
      time: "2025-07-03 11:47",
      unread: 3,
      avatar: "GA",
      isGroup: true,
      members: ["Alice", "Bob", "Charlie"]
    },
    
    {
      id: "student1",
      name: "Alice Johnson",
      lastMessage: "Check new message",
      time: "2025-07-03 11:46",
      unread: 1,
      avatar: "AJ",
      isGroup: false,
      status: "online"
    },
    {
      id: "student2",
      name: "Paul Walker",
      lastMessage: "Check role",
      time: "2025-07-03 11:49",
      unread: 0,
      avatar: "BS",
      isGroup: false,
      status: "offline"
    },
    {
      id: "group2",
      name: "Shan Mallla",
      lastMessage: "Assignment submitted",
      time: "2025-07-02 15:30",
      unread: 5,
      avatar: "GB",
      isGroup: true,
      members: ["David", "Eve", "Frank"]
    },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, text: "Test message", time: "2025-07-03 11:44", sender: "Alice Johnson", tableId: "", chatId: "student1" },
    { id: 2, text: "Welcome to the session!", time: "2025-07-03 11:45", sender: "You", tableId: "", chatId: "student1" },
    { id: 3, text: "Check new message", time: "2025-07-03 11:46", sender: "Alice Johnson", tableId: "", chatId: "student1" },
    { id: 4, text: "Please review the topic", time: "2025-07-03 11:47", sender: "You", tableId: "", chatId: "group1" },
    { id: 5, text: "Check role", time: "2025-07-03 11:49", sender: "Bob Smith", tableId: "", chatId: "student2" },
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [activeChat, setActiveChat] = useState(null);
  const [showMobileChatList, setShowMobileChatList] = useState(true);
  
  const currentUserId = "lecturer123";
  const currentUserName = "You";
  const currentUserRole = "Lecturer";

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
  }, [messages, activeChat]);

  // Format timestamp for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
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
      text: newMessage,
      content: newMessage,
      timestamp: new Date().toISOString(),
      tableId: tableId,
      chatId: activeChat,
      status: "sending",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Update last message in chat list
    setChatList(prev => prev.map(chat => 
      chat.id === activeChat 
        ? { ...chat, lastMessage: newMessage, time: new Date().toISOString() } 
        : chat
    ));

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
    const filteredChats = chatList.filter(
      (chat) =>
        chat.name.toLowerCase().includes(term) ||
        chat.lastMessage.toLowerCase().includes(term)
    );
    setChatList(filteredChats);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setChatList([
      {
        id: "group1",
        name: "CSE101 Group A",
        lastMessage: "Please review the topic",
        time: "2025-07-03 11:47",
        unread: 3,
        avatar: "GA",
        isGroup: true,
        members: ["Alice", "Bob", "Charlie"]
      },
      {
        id: "student1",
        name: "Alice Johnson",
        lastMessage: "Check new message",
        time: "2025-07-03 11:46",
        unread: 1,
        avatar: "Ax",
        isGroup: false,
        status: "online"
      },
      {
        id: "student2",
        name: "Bob Smith",
        lastMessage: "Check role",
        time: "2025-07-03 11:49",
        unread: 0,
        avatar: "BS",
        isGroup: false,
        status: "offline"
      },
      {
        id: "group2",
        name: "CSE101 Group B",
        lastMessage: "Assignment submitted",
        time: "2025-07-02 15:30",
        unread: 5,
        avatar: "GB",
        isGroup: true,
        members: ["David", "Eve", "Frank"]
      },
    ]);
  };

  // Auto-hide toast and close button
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const closeToast = () => setToast((prev) => ({ ...prev, visible: false }));

  // Filter messages by active chat
  const filteredMessages = activeChat 
    ? messages.filter((msg) => msg.chatId === activeChat)
    : [];

  // Get active chat details
  const activeChatDetails = activeChat 
    ? chatList.find(chat => chat.id === activeChat)
    : null;

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (activeChat) {
      setChatList(prev => prev.map(chat => 
        chat.id === activeChat ? { ...chat, unread: 0 } : chat
      ));
    }
  }, [activeChat]);

  return (
    <div className="flex h-[75vh] bg-gray-50 overflow-hidden">
      {/* Chat List Sidebar */}
      <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col ${!showMobileChatList && activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
            <button 
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => navigate(`/unit/lecture/${tableId || unit?.id || "default"}`, { state: { tableId } })}
            >
              <ChevronLeft className="text-gray-600" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search chats..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-neutral-900 placeholder-neutral-400 text-sm transition-all duration-200"
              aria-label="Search chats"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
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

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chatList.map((chat) => (
            <div 
              key={chat.id}
              className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${activeChat === chat.id ? 'bg-blue-50' : ''}`}
              onClick={() => {
                setActiveChat(chat.id);
                setShowMobileChatList(false);
              }}
            >
              <div className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${chat.isGroup ? 'bg-purple-500' : 'bg-blue-500'}`}>
                {chat.avatar}
                {!chat.isGroup && chat.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{formatTime(chat.time)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="bg-blue-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
                {chat.isGroup && (
                  <div className="flex mt-1">
                    {chat.members.slice(0, 3).map((member, i) => (
                      <span key={i} className="text-xs text-gray-500 mr-1">
                        {member}{i < chat.members.length - 1 && i < 2 ? ',' : ''}
                      </span>
                    ))}
                    {chat.members.length > 3 && (
                      <span className="text-xs text-gray-500">+{chat.members.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${showMobileChatList && activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  className="md:hidden p-2 mr-2 rounded-full hover:bg-gray-100"
                  onClick={() => setShowMobileChatList(true)}
                >
                  <ChevronLeft className="text-gray-600" />
                </button>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${activeChatDetails.isGroup ? 'bg-purple-500' : 'bg-blue-500'}`}>
                  {activeChatDetails.avatar}
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-gray-800">{activeChatDetails.name}</h2>
                  {!activeChatDetails.isGroup && (
                    <p className="text-xs text-gray-500 flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-1 ${activeChatDetails.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      {activeChatDetails.status === 'online' ? 'Online' : 'Offline'}
                    </p>
                  )}
                  {activeChatDetails.isGroup && (
                    <p className="text-xs text-gray-500">{activeChatDetails.members.length} members</p>
                  )}
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <MoreVertical className="text-gray-600" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-4 flex ${message.sender === currentUserName ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${message.sender === currentUserName ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center mb-1">
                      {message.sender !== currentUserName && (
                        <span className="font-semibold text-sm mr-2">{message.sender}</span>
                      )}
                      <span className="text-xs opacity-80">
                        {formatTime(message.time)}
                      </span>
                    </div>
                    <p className="text-sm">{message.text || message.content}</p>
                    {message.status === 'sending' && (
                      <div className="text-right mt-1">
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-pulse mx-1"></span>
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-pulse mx-1"></span>
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-pulse mx-1"></span>
                      </div>
                    )}
                    {message.status === 'delivered' && (
                      <div className="text-right mt-1">
                        <svg className="w-3 h-3 inline text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white p-4 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          // Empty state when no chat is selected
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No chat selected</h2>
            <p className="text-gray-500 text-center max-w-md mb-4">
              Select a chat from the list to start messaging or create a new conversation.
            </p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setActiveChat(chatList[0].id)}
            >
              Start Chatting
            </button>
          </div>
        )}
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
    </div>
  );
};

export default DiscussionsTab;