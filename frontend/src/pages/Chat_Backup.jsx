// Chat.jsx (Enhanced + Features Restored)
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import ChatBox from "../components/ChatBox";
import { FaBars, FaTimes, FaCommentDots } from "react-icons/fa";

export default function Chat() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const socketRef = useRef(null);

  // Initialize socket connection once when user logs in
  useEffect(() => {
    if (!user || socketRef.current) return;

    socketRef.current = io("http://localhost:6090", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
      socketRef.current.emit("join_user", user._id);
    });

    socketRef.current.on("receive_message", (data) => {
      // Only add to messages if it's from the selected user (not from me)
      if (data.senderId === user._id) return;

      setMessages((prev) => [
        ...prev,
        {
          content: data.message,
          timestamp: data.timestamp,
          isFromMe: false,
        },
      ]);

      // Update chat users list in background (debounced)
      setChatUsers((prev) =>
        prev.map((u) =>
          u._id === data.senderId
            ? { ...u, lastMessage: { content: data.message } }
            : u,
        ),
      );
    });

    socketRef.current.on("message_sent", (data) => {
      console.log("Message sent successfully:", data.messageId);
    });

    socketRef.current.on("message_error", (err) => {
      console.error("Message error:", err);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  // Load chat users whenever user changes
  useEffect(() => {
    if (user) {
      loadChatUsers();
    }
  }, [user]);

  const loadChatUsers = async () => {
    try {
      const res = await API.get("/messages/users");
      setChatUsers(res.data);
    } catch (err) {
      console.error(err);
      setChatUsers([]);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const res = await API.get(`/messages/${userId}`);

      const formatted = res.data.map((msg) => ({
        content: msg.content,
        timestamp: msg.timestamp || msg.createdAt,
        isFromMe: msg.sender?._id === user._id,
      }));

      setMessages(formatted);
    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  };

  const selectUser = async (u) => {
    setSelectedUser(u);
    await loadMessages(u._id);
    setIsSidebarOpen(false);
  };

  if (!user) return <div className="p-10 text-center">Login required</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-background dark:bg-dark">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 w-80 bg-background/40 dark:bg-dark/40 backdrop-blur-md border-r border-secondary/30 dark:border-secondary/20 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition duration-300`}
      >
        <div className="p-4 flex justify-between items-center border-b border-secondary/30 dark:border-secondary/20">
          <h2 className="font-bold flex items-center gap-2 text-dark dark:text-light">
            <FaCommentDots /> Messages
          </h2>
          <FaTimes
            className="md:hidden cursor-pointer text-dark dark:text-light"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>

        <div className="overflow-y-auto h-[calc(100vh-70px)]">
          {chatUsers.map((u) => (
            <div
              key={u._id}
              onClick={() => selectUser(u)}
              className={`p-3 cursor-pointer flex gap-3 hover:bg-secondary/30 dark:hover:bg-secondary/20 transition-colors ${selectedUser?._id === u._id ? "bg-primary/30 dark:bg-primary/20" : ""}`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary text-dark flex items-center justify-center font-bold flex-shrink-0">
                {u.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-dark dark:text-light">
                  {u.name}
                </p>
                <p className="text-xs text-muted truncate">
                  {u.lastMessage?.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-background dark:bg-dark">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 bg-background/40 dark:bg-dark/40 backdrop-blur-md border-b border-secondary/30 dark:border-secondary/20 flex items-center gap-3 sticky top-0 z-10">
              <FaBars
                className="md:hidden cursor-pointer text-dark dark:text-light"
                onClick={() => setIsSidebarOpen(true)}
              />
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary text-dark rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {selectedUser.name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-dark dark:text-light">
                  {selectedUser.name}
                </h3>
                <p className="text-xs text-muted capitalize">
                  {selectedUser.role}
                </p>
              </div>
            </div>

            <ChatBox
              messages={messages}
              setMessages={setMessages}
              socket={socketRef.current}
              selectedUser={selectedUser}
              user={user}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted">
            <div className="text-center">
              <FaCommentDots className="text-6xl mb-4 text-primary/50" />
              <p className="text-dark dark:text-light">
                Select a chat to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Toggle */}
      <button
        className="fixed bottom-6 right-6 md:hidden bg-gradient-to-r from-primary to-secondary text-dark p-4 rounded-full shadow-elevated hover:shadow-lg transition-all"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars />
      </button>
    </div>
  );
}
