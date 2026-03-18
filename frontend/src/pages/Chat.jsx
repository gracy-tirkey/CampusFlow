import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Chat() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user && !socketRef.current) {
      // Create socket connection
      socketRef.current = io("http://localhost:5001");

      // Join user's personal room
      socketRef.current.emit("join_user", user._id);

      // Load chat users
      loadChatUsers();

      // Socket listeners
      socketRef.current.on("receive_message", (data) => {
        if (selectedUser && data.senderId === selectedUser._id) {
          setMessages(prev => [...prev, {
            ...data,
            isFromMe: false
          }]);
        }
        // Refresh chat users to update last message
        loadChatUsers();
      });

      socketRef.current.on("message_sent", (data) => {
        setMessages(prev => [...prev, {
          content: data.content,
          timestamp: data.timestamp,
          isFromMe: true
        }]);
      });
      socketRef.current.on("message_error", (error) => {
        console.error("Message send error:", error);
        // You could show a toast notification here
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off("receive_message");
        socketRef.current.off("message_sent");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, selectedUser]);

  const loadChatUsers = async () => {
    try {
      const res = await API.get("/messages/users");
      setChatUsers(res.data);
    } catch (error) {
      console.error("Error loading chat users:", error);
      setChatUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const res = await API.get(`/messages/${userId}`);
      const formattedMessages = res.data.map(msg => ({
        content: msg.content,
        timestamp: msg.timestamp || msg.createdAt,
        isFromMe: msg.sender?._id === user._id,
        senderName: msg.sender?.name || "Unknown"
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    }
  };

  const selectUser = async (chatUser) => {
    setSelectedUser(chatUser);
    await loadMessages(chatUser._id);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser || !socketRef.current) return;

    const messageData = {
      receiverId: selectedUser._id,
      message: newMessage.trim(),
      senderId: user._id,
      senderName: user.name
    };

    socketRef.current.emit("send_message", messageData);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) { // Less than 1 minute
      return 'now';
    } else if (diff < 3600000) { // Less than 1 hour
      return `${Math.floor(diff / 60000)}m`;
    } else if (diff < 86400000) { // Less than 1 day
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-light text-text p-6 flex items-center justify-center">
        
        <div className="text-center">
          <h2 className="text-xl font-semibold text-text mb-2">Please Login</h2>
          <p className="text-text/60">You need to be logged in to access the chat.</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar showLogo={false} showSidebar={ false } />
    <div className="min-h-screen bg-light text-text flex">
      {/* Chat Users Sidebar */}
      <div className="w-1/3 bg-secondary border-r border-dark/20 flex flex-col">
        <div className="p-4 border-b border-dark/20">
          <h2 className="text-xl font-bold text-text">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatUsers.map((chatUser) => (
            <div
              key={chatUser._id}
              onClick={() => selectUser(chatUser)}
              className={`p-4 border-b border-dark/10 cursor-pointer hover:bg-primary/10 transition-colors ${
                selectedUser?._id === chatUser._id ? 'bg-primary/20' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-text font-bold">
                  {chatUser.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-dark truncate">{chatUser.name}</h3>
                    {chatUser.lastMessage && (
                      <span className="text-xs text-text/60">
                        {formatTime(chatUser.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  {chatUser.lastMessage && (
                    <p className="text-sm text-text/70 truncate">
                      {chatUser.lastMessage.isFromMe && 'You: '}
                      {chatUser.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-dark/20 bg-secondary">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-text font-bold">
                    {selectedUser.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark">{selectedUser.name}</h3>
                    <p className="text-sm text-text/60 capitalize">{selectedUser.role}</p>
                  </div>
                </div>
                <Link to="/student/dashboard">
                  <button className="bg-primary text-text px-4 py-2 rounded hover:bg-primary/80 transition-colors">
                    🏠 Home
                  </button>
                </Link>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isFromMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.isFromMe
                        ? 'bg-primary text-text'
                        : 'bg-secondary text-text'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.isFromMe ? 'text-text/70' : 'text-text/60'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-dark/20 bg-secondary">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 p-3 bg-light text-text rounded border border-dark/20 placeholder-text/70 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-primary text-text px-6 py-3 rounded hover:bg-primary/80 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-2">Select a conversation</h3>
              <p className="text-text/60">Choose a user from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
