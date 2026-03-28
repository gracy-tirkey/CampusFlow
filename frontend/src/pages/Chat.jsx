import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { FaHome, FaUserAlt, FaCommentDots, FaPaperPlane, FaBars, FaTimes } from "react-icons/fa";

export default function Chat() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (user && !socketRef.current) {
      socketRef.current = io("https://campusflow-backend-6ga1.onrender.com", {
  transports: ["websocket"]
);
      socketRef.current.emit("join_user", user._id);
      loadChatUsers();

      socketRef.current.on("receive_message", (data) => {
        if (selectedUser && data.senderId === selectedUser._id) {
          setMessages(prev => [...prev, { ...data, isFromMe: false }]);
        }
        loadChatUsers();
      });

      socketRef.current.on("message_sent", (data) => {
        setMessages(prev => [...prev, { content: data.content, timestamp: data.timestamp, isFromMe: true }]);
      });

      socketRef.current.on("message_error", console.error);
      socketRef.current.on("connect_error", console.error);
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
    setIsSidebarOpen(false); // Close sidebar on mobile after selecting user
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser || !socketRef.current) return;
    socketRef.current.emit("send_message", { receiverId: selectedUser._id, message: newMessage.trim(), senderId: user._id, senderName: user.name });
    setNewMessage("");
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString();
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
      <Navbar showLogo={true} showSidebar={false} />
      <div className="min-h-screen bg-light text-text flex relative">
        {/* Chat Users Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-primary border-r border-dark/20 flex flex-col transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-1/3`}>
          <div className="p-4 border-b border-dark/20 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl text-text">
              <FaCommentDots /> Messages
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-text hover:text-primary md:hidden"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chatUsers.map(chatUser => (
              <div
                key={chatUser._id}
                onClick={() => selectUser(chatUser)}
                className={`p-4 border-b border-dark/10 cursor-pointer bg-primary hover:bg-secondary/10 transition-colors ${selectedUser?._id === chatUser._id ? 'bg-primary/20' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-text font-bold">
                    {chatUser.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-dark truncate">{chatUser.name}</h3>
                      {chatUser.lastMessage && <span className="text-xs text-text/60">{formatTime(chatUser.lastMessage.timestamp)}</span>}
                    </div>
                    {chatUser.lastMessage && <p className="text-sm text-text/70 truncate">{chatUser.lastMessage.isFromMe && 'You: '}{chatUser.lastMessage.content}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col md:ml-0">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-dark/20 bg-secondary flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden text-text hover:text-primary mr-2"
                  >
                    <FaBars size={20} />
                  </button>
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-text font-bold">{selectedUser.name?.charAt(0)?.toUpperCase() || '?'}</div>
                  <div>
                    <h3 className="font-semibold text-dark">{selectedUser.name}</h3>
                    <p className="text-sm text-text/60 capitalize">{selectedUser.role}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.isFromMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.isFromMe ? 'bg-primary text-text' : 'bg-secondary text-text'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.isFromMe ? 'text-text/70' : 'text-text/60'}`}>{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-dark/20 bg-secondary flex items-center gap-2">
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
                  className="flex items-center gap-2 bg-primary text-text px-6 py-3 rounded hover:bg-primary/80 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane /> Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUserAlt className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-dark mb-2">Select a conversation</h3>
                <p className="text-text/60">Choose a user from the sidebar to start chatting</p>
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="mt-4 md:hidden bg-primary text-text px-4 py-2 rounded hover:bg-primary/80 transition-colors"
                >
                  Open Messages
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
