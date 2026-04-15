// Chat.jsx - Enhanced with all new features
// ✅ Features: Last message, Unread counts, Online/Offline, Last seen, Typing indicator, Message status, Chat reordering, File sharing, Search
import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import ChatBox from "../components/ChatBox";
import {
  FaBars,
  FaTimes,
  FaCommentDots,
  FaCircle,
  FaClock,
  FaSearch,
} from "react-icons/fa";

export default function Chat() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const socketRef = useRef(null);

  // ✅ 2: Unread count tracking
  const [unreadCounts, setUnreadCounts] = useState({});

  // ✅ 3: Online/Offline status
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // ✅ 4: Last seen tracking
  const [lastSeenUsers, setLastSeenUsers] = useState({});

  // ✅ 5: Typing indicator
  const [typingUsers, setTypingUsers] = useState({});
  const typingTimeoutRef = useRef({});

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
      console.log("✅ Socket connected");
      socketRef.current.emit("join_user", user._id);
      loadChatUsers();
    });

    // ✅ 1, 7: Last message + Chat list update
    socketRef.current.on("receive_message", (data) => {
      // Ignore if message is from self
      if (data.senderId === user._id) return;

      // Add message to chat if relevant user selected
      if (selectedUser && data.senderId === selectedUser._id) {
        setMessages((prev) => [
          ...prev,
          {
            messageId: data.messageId,
            content: data.content || data.message,
            type: data.type || "text",
            fileUrl: data.fileUrl,
            fileName: data.fileName,
            timestamp: data.timestamp,
            isFromMe: false,
            status: data.status || "delivered",
          },
        ]);

        // ✅ 6: Mark as seen when chat is open
        socketRef.current.emit("message_seen", {
          messageId: data.messageId,
          senderId: data.senderId,
        });
      } else {
        // ✅ 2: Increment unread count if chat not open
        setUnreadCounts((prev) => ({
          ...prev,
          [data.senderId]: (prev[data.senderId] || 0) + 1,
        }));
      }

      // ✅ 7, 8: Update chat list with last message (auto-reorder)
      setChatUsers((prev) => {
        const updated = prev.map((u) =>
          u._id === data.senderId
            ? {
                ...u,
                lastMessage: {
                  content:
                    data.type === "text"
                      ? data.content || data.message
                      : `📎 ${data.type.toUpperCase()} attachment`,
                },
                lastMessageTime: data.timestamp,
              }
            : u,
        );
        // ✅ 8: Reorder by latest message
        return updated.sort(
          (a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0),
        );
      });
    });

    // ✅ 6: Message status updates
    socketRef.current.on("message_status_update", (data) => {
      const { messageId, status, seenAt } = data;
      setMessages((prev) =>
        prev.map((m) =>
          m.messageId === messageId ? { ...m, status, seenAt } : m,
        ),
      );
    });

    // ✅ 1: Last message update (for sorting)
    socketRef.current.on("last_message_update", (data) => {
      const { userId, lastMessage } = data;
      setChatUsers((prev) => {
        const updated = prev.map((u) =>
          u._id === userId
            ? { ...u, ...lastMessage, lastMessageTime: lastMessage.timestamp }
            : u,
        );
        return updated.sort(
          (a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0),
        );
      });
    });

    // ✅ 3: Online status
    socketRef.current.on("user_online", (data) => {
      setOnlineUsers((prev) => new Set([...prev, data.userId]));
      setLastSeenUsers((prev) => ({
        ...prev,
        [data.userId]: null, // Clear last seen when online
      }));
    });

    // ✅ 3, 4: Offline status & last seen
    socketRef.current.on("user_offline", (data) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(data.userId);
        return updated;
      });
      setLastSeenUsers((prev) => ({
        ...prev,
        [data.userId]: data.lastSeen,
      }));
    });

    // ✅ 5: Typing indicator
    socketRef.current.on("user_typing", (data) => {
      const { userId, isTyping } = data;

      if (isTyping) {
        setTypingUsers((prev) => ({ ...prev, [userId]: true }));

        // Auto-clear typing indicator after 3 seconds
        clearTimeout(typingTimeoutRef.current[userId]);
        typingTimeoutRef.current[userId] = setTimeout(() => {
          setTypingUsers((prev) => {
            const updated = { ...prev };
            delete updated[userId];
            return updated;
          });
        }, 3000);
      } else {
        setTypingUsers((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
        clearTimeout(typingTimeoutRef.current[userId]);
      }
    });

    socketRef.current.on("message_sent", (data) => {
      console.log("✅ Message sent:", data.messageId);
    });

    socketRef.current.on("message_error", (err) => {
      console.error("❌ Message error:", err);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Connection error:", err);
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      // Cleanup typing timeouts
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, selectedUser]);

  // Load chat users whenever user changes
  useEffect(() => {
    if (user) {
      loadChatUsers();
    }
  }, [user]);

  const loadChatUsers = async () => {
    try {
      const res = await API.get("/messages/users");
      // Handle both response formats
      const usersData = res.data?.data || res.data || [];
      // ✅ 8: Sort by latest message
      const sorted = (Array.isArray(usersData) ? usersData : []).sort(
        (a, b) =>
          (b.lastMessageTime || b.updatedAt || 0) -
          (a.lastMessageTime || a.updatedAt || 0),
      );
      setChatUsers(sorted);
    } catch (err) {
      console.error(err);
      setChatUsers([]);
    }
  };

  const loadMessages = useCallback(
    async (userId) => {
      try {
        const res = await API.get(`/messages/${userId}`);
        // Handle both response formats
        const messagesData = res.data?.data || res.data || [];

        const formatted = (Array.isArray(messagesData) ? messagesData : []).map(
          (msg) => ({
            messageId: msg._id,
            content: msg.content,
            type: msg.type || "text",
            fileUrl: msg.fileUrl,
            fileName: msg.fileName,
            timestamp: msg.timestamp || msg.createdAt,
            isFromMe: msg.sender?._id === user._id,
            status: msg.status || "delivered",
            seenAt: msg.seenAt,
          }),
        );

        setMessages(formatted);

        // ✅ 2: Clear unread count when opening chat
        setUnreadCounts((prev) => ({
          ...prev,
          [userId]: 0,
        }));

        // ✅ 6: Mark all messages from this user as seen
        await API.put(`/messages/${userId}/read`);
      } catch (err) {
        console.error(err);
        setMessages([]);
      }
    },
    [user],
  );

  const selectUser = async (u) => {
    setSelectedUser(u);
    await loadMessages(u._id);
    setIsSidebarOpen(false);
  };

  // Helper: Format last seen time
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "just now";
    const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Filter users based on search query
  const filteredUsers = chatUsers.filter((u) => {
    const lowerSearch = searchQuery.toLowerCase();
    const nameMatch = u.name?.toLowerCase().includes(lowerSearch);
    const messageMatch = u.lastMessage?.content
      ?.toLowerCase()
      .includes(lowerSearch);
    return nameMatch || messageMatch;
  });

  if (!user)
    return (
      <div className="p-10 text-center text-dark dark:text-light">
        Login required
      </div>
    );

  return (
    <div className="flex h-screen overflow-hidden bg-background dark:bg-dark">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 w-80 bg-background/40 dark:bg-dark/40 backdrop-blur-md border-r border-secondary/30 dark:border-secondary/20 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition duration-300`}
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

        {/* Search Input */}
        <div className="p-3 border-b border-secondary/30 dark:border-secondary/20">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-muted" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-secondary/30 dark:bg-secondary/20 border border-secondary/50 rounded-lg text-sm text-dark dark:text-light placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-130px)]">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-muted">
              {chatUsers.length === 0 ? "No chats yet" : "No matching users"}
            </div>
          ) : (
            filteredUsers.map((u) => (
              <div
                key={u._id}
                onClick={() => selectUser(u)}
                className={`p-3 cursor-pointer flex gap-3 hover:bg-secondary/30 dark:hover:bg-secondary/20 transition-colors ${
                  selectedUser?._id === u._id
                    ? "bg-primary/30 dark:bg-primary/20"
                    : ""
                }`}
              >
                {/* Avatar with online indicator */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary text-dark flex items-center justify-center font-bold">
                    {u.name?.charAt(0)?.toUpperCase()}
                  </div>
                  {/* ✅ 3: Online status indicator */}
                  {onlineUsers.has(u._id) && (
                    <FaCircle className="absolute bottom-0 right-0 w-3 h-3 text-green-500 bg-background dark:bg-dark rounded-full border-2 border-background dark:border-dark" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium truncate text-dark dark:text-light">
                      {u.name}
                    </p>
                    {/* ✅ 2: Unread badge */}
                    {unreadCounts[u._id] > 0 && (
                      <span className="ml-2 bg-primary text-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {unreadCounts[u._id]}
                      </span>
                    )}
                  </div>

                  {/* ✅ 1: Last message preview */}
                  <p className="text-xs text-muted truncate">
                    {u.lastMessage?.content || "No messages yet"}
                  </p>

                  {/* ✅ 4: Last seen / Online status */}
                  <p className="text-[10px] text-muted/60 flex items-center gap-1 mt-1">
                    {onlineUsers.has(u._id) ? (
                      <>
                        <FaCircle className="w-1.5 h-1.5 text-green-500" />
                        online
                      </>
                    ) : lastSeenUsers[u._id] ? (
                      <>
                        <FaClock className="w-2.5 h-2.5" />
                        {formatLastSeen(lastSeenUsers[u._id])}
                      </>
                    ) : null}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-background dark:bg-dark">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 bg-background/40 dark:bg-dark/40 backdrop-blur-md border-b border-secondary/30 dark:border-secondary/20 flex items-center gap-3 justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <button
                  className="md:hidden text-dark dark:text-light"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <FaBars />
                </button>

                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary text-dark rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {selectedUser.name?.charAt(0)}
                  </div>
                  {/* ✅ 3: Online indicator in header */}
                  {onlineUsers.has(selectedUser._id) && (
                    <FaCircle className="absolute bottom-0 right-0 w-2.5 h-2.5 text-green-500 bg-background dark:bg-dark rounded-full border-2 border-background dark:border-dark" />
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-dark dark:text-light">
                    {selectedUser.name}
                  </h3>
                  <p className="text-xs text-muted">
                    {/* ✅ 4: Status line */}
                    {onlineUsers.has(selectedUser._id)
                      ? "Online"
                      : lastSeenUsers[selectedUser._id]
                        ? `Last seen ${formatLastSeen(
                            lastSeenUsers[selectedUser._id],
                          )}`
                        : "Offline"}
                  </p>
                </div>
              </div>

              {/* ✅ 5: Typing indicator in header */}
              {typingUsers[selectedUser._id] && (
                <div className="text-xs text-primary animate-pulse">
                  ✍️ typing...
                </div>
              )}
            </div>

            <ChatBox
              messages={messages}
              setMessages={setMessages}
              socket={socketRef.current}
              selectedUser={selectedUser}
              user={user}
              onTyping={(isTyping) => {
                if (socketRef.current) {
                  socketRef.current.emit("typing", {
                    senderId: user._id,
                    targetUserId: selectedUser._id,
                    isTyping,
                  });
                }
              }}
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
