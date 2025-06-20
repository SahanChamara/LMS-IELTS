import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Image, MoreVertical, Users, Check, CheckCheck } from 'lucide-react';

const DiscussionsTab = ({ unitId, currentUser = { name: "John Doe", role: "student", id: "user1" } }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      userId: "instructor1",
      sender: "Dr. Sarah Wilson",
      role: "instructor",
      content: "Welcome to the JavaScript Basics discussion! Feel free to ask any questions about the unit material.",
      timestamp: "2024-06-17T10:30:00Z",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c666c9c4?w=40&h=40&fit=crop&crop=face",
      status: "read"
    },
    {
      id: 2,
      userId: "student1",
      sender: "Alex Chen",
      role: "student",
      content: "Thank you! I have a question about the difference between let and const declarations.",
      timestamp: "2024-06-17T10:35:00Z",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      status: "read"
    },
    {
      id: 3,
      userId: "instructor1",
      sender: "Dr. Sarah Wilson",
      role: "instructor",
      content: "Great question! 'let' allows you to reassign values, while 'const' creates constants that cannot be reassigned. However, with objects and arrays declared with const, you can still modify their contents.",
      timestamp: "2024-06-17T10:37:00Z",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c666c9c4?w=40&h=40&fit=crop&crop=face",
      status: "read"
    },
    {
      id: 4,
      userId: "student2",
      sender: "Maria Rodriguez",
      role: "student",
      content: "Could you provide a code example to illustrate this concept?",
      timestamp: "2024-06-17T10:40:00Z",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      status: "read"
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([
    { id: "instructor1", name: "Dr. Sarah Wilson", role: "instructor", online: true },
    { id: "student1", name: "Alex Chen", role: "student", online: true },
    { id: "student2", name: "Maria Rodriguez", role: "student", online: false },
    { id: "user1", name: "John Doe", role: "student", online: true }
  ]);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString();
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        userId: currentUser.id,
        sender: currentUser.name,
        role: currentUser.role,
        content: newMessage,
        timestamp: new Date().toISOString(),
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        status: 'sending'
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate message being sent
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'sent' } : msg
        ));
      }, 1000);

      // Simulate instructor typing response
      if (currentUser.role === 'student') {
        setTimeout(() => setIsTyping(true), 2000);
        setTimeout(() => {
          setIsTyping(false);
          // Add instructor response
          const instructorResponse = {
            id: messages.length + 2,
            userId: "instructor1",
            sender: "Dr. Sarah Wilson",
            role: "instructor",
            content: "That's a good point! Let me elaborate on that...",
            timestamp: new Date().toISOString(),
            avatar: "https://images.unsplash.com/photo-1494790108755-2616c666c9c4?w=40&h=40&fit=crop&crop=face",
            status: "read"
          };
          setMessages(prev => [...prev, instructorResponse]);
        }, 4000);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-xs font-medium text-gray-600">{date}</span>
              </div>
            </div>
            
            {/* Messages for this date */}
            {dateMessages.map((message, index) => {
              const isCurrentUser = message.userId === currentUser.id;
              const showAvatar = index === 0 || dateMessages[index - 1].userId !== message.userId;
              const isLastInGroup = index === dateMessages.length - 1 || dateMessages[index + 1].userId !== message.userId;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} ${showAvatar ? 'mt-4' : 'mt-1'}`}
                >
                  <div className={`flex max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`${showAvatar ? 'opacity-100' : 'opacity-0'} ${isCurrentUser ? 'ml-2' : 'mr-2'}`}>
                      {message.avatar ? (
                        <img
                          src={message.avatar}
                          alt={message.sender}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                          message.role === 'instructor' ? 'bg-purple-500' : 'bg-blue-500'
                        }`}>
                          {message.sender.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    
                    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                      {/* Sender info */}
                      {showAvatar && !isCurrentUser && (
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium text-gray-900">
                            {message.sender}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            message.role === 'instructor' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {message.role === 'instructor' ? 'Instructor' : 'Student'}
                          </span>
                        </div>
                      )}
                      
                      {/* Message bubble */}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isCurrentUser
                            ? 'bg-blue-500 text-white'
                            : message.role === 'instructor'
                            ? 'bg-purple-50 text-gray-900 border border-purple-200'
                            : 'bg-gray-100 text-gray-900'
                        } ${
                          isCurrentUser 
                            ? (showAvatar ? 'rounded-br-md' : '') + (isLastInGroup ? ' rounded-br-md' : '')
                            : (showAvatar ? 'rounded-bl-md' : '') + (isLastInGroup ? ' rounded-bl-md' : '')
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      {/* Message info */}
                      {isLastInGroup && (
                        <div className={`flex items-center mt-1 space-x-1 ${
                          isCurrentUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                        }`}>
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                          {isCurrentUser && (
                            <div className="text-blue-500">
                              {message.status === 'sending' && <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse"></div>}
                              {message.status === 'sent' && <Check className="w-3 h-3" />}
                              {message.status === 'read' && <CheckCheck className="w-3 h-3" />}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex max-w-xs lg:max-w-md">
              <img
                src="https://images.unsplash.com/photo-1494790108755-2616c666c9c4?w=40&h=40&fit=crop&crop=face"
                alt="Typing"
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
              <div className="flex flex-col">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-1">Dr. Sarah Wilson is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question or share your thoughts..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Image className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full transition-all duration-200 ${
              newMessage.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-105 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Quick Help */}
        <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
          <span>Press Enter to send, Shift + Enter for new line</span>
          <span className="text-green-600">● {onlineUsers.filter(u => u.online).length} online</span>
        </div>
      </div>
    </div>
  );
};

export default DiscussionsTab;