// ChatBox.jsx - Enhanced with file sharing, typing, and message status
// ✅ Features: File upload, Typing indicator, Message status icons, File preview
import { useState, useEffect, useRef } from "react";
import {
  FaPaperPlane,
  FaPaperclip,
  FaCheckDouble,
  FaCheck,
  FaEye,
  FaSpinner,
} from "react-icons/fa";
import API from "../api/axios";

export default function ChatBox({
  messages,
  setMessages,
  socket,
  selectedUser,
  user,
  onTyping,
}) {
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ 5: Debounced typing indicator
  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);

    // Emit typing event
    if (!isTyping && value) {
      setIsTyping(true);
      onTyping?.(true);
    }

    // Debounce stop typing
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping?.(false);
    }, 1000);
  };

  // ✅ 9: File upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !socket || !selectedUser) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload file to backend
      const response = await API.post("/messages/upload/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { fileUrl, fileName, type } = response.data.file;

      // Send message with file
      const fileMessage = {
        receiverId: selectedUser._id,
        message: `Shared a ${type}: ${fileName}`,
        content: `Shared a ${type}: ${fileName}`,
        senderId: user._id,
        senderName: user.name,
        type, // "image" or "file"
        fileUrl,
        fileName,
      };

      // Add optimistically to UI
      const optimisticMessage = {
        messageId: null, // Will be set by backend
        content: fileMessage.message,
        type,
        fileUrl,
        fileName,
        timestamp: new Date().toISOString(),
        isFromMe: true,
        status: "sent",
        pending: true,
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      // Emit via socket
      socket.emit("send_message", fileMessage);

      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("❌ File upload failed:", error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  // ✅ 9: Render file based on type
  const renderFileContent = (msg) => {
    if (!msg.type || msg.type === "text") {
      return <p className="text-sm">{msg.content}</p>;
    }

    if (msg.type === "image") {
      return (
        <div className="max-w-xs rounded-lg overflow-hidden">
          <img
            src={msg.fileUrl}
            alt={msg.fileName || "shared image"}
            className="w-full h-auto"
          />
          <p className="text-xs text-muted mt-2">{msg.fileName}</p>
        </div>
      );
    }

    if (msg.type === "file") {
      return (
        <div className="bg-secondary/20 rounded-lg p-3 max-w-xs">
          <a
            href={msg.fileUrl}
            download={msg.fileName}
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <FaPaperclip className="text-lg" />
            <span className="text-sm font-semibold break-words">
              {msg.fileName}
            </span>
          </a>
        </div>
      );
    }
  };

  // ✅ 6: Message status icon
  const renderStatusIcon = (status) => {
    switch (status) {
      case "seen":
        return <FaEye className="w-3 h-3 text-primary" title="Seen" />;
      case "delivered":
        return <FaCheckDouble className="w-3 h-3 text-secondary" title="Delivered" />;
      case "sent":
        return <FaCheck className="w-3 h-3 text-muted" title="Sent" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background dark:bg-dark">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted">
            <p>Start a conversation</p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.isFromMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl backdrop-blur-sm border transition-all ${
                  m.isFromMe
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-dark border-primary/30 shadow-md"
                    : "bg-background/50 dark:bg-dark/50 text-dark dark:text-light border-secondary/30 dark:border-secondary/20"
                } ${m.pending ? "opacity-75" : ""}`}
              >
                {/* Render different content types */}
                {renderFileContent(m)}

                {/* Time and status */}
                <div className="flex items-center justify-between gap-2 mt-2">
                  <p className="text-[10px] opacity-70">
                    {formatTime(m.timestamp)}
                  </p>

                  {/* ✅ 6: Status indicator for sent messages */}
                  {m.isFromMe && !m.pending && (
                    <span className="flex items-center gap-1">
                      {renderStatusIcon(m.status)}
                    </span>
                  )}

                  {/* Pending indicator */}
                  {m.pending && (
                    <FaSpinner className="w-3 h-3 animate-spin opacity-50" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background/40 dark:bg-dark/40 backdrop-blur-md border-t border-secondary/30 dark:border-secondary/20 space-y-3">
        {uploading && (
          <div className="flex items-center gap-2 text-primary text-sm px-4">
            <FaSpinner className="animate-spin" />
            Uploading file...
          </div>
        )}

        <div className="flex gap-3">
          {/* ✅ 9: File upload button */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            disabled={uploading || !socket}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.zip"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || !socket}
            className="px-3 py-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 text-dark dark:text-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Share file or image"
          >
            <FaPaperclip />
          </button>

          {/* Text input */}
          <input
            className="flex-1 px-4 py-3 rounded-xl bg-background/50 dark:bg-dark/50 border border-secondary/30 dark:border-secondary/20 text-dark dark:text-light placeholder-muted focus:border-primary outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            value={text}
            onChange={handleTextChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!text.trim() || !socket) return;

                // Clear typing indicator
                setIsTyping(false);
                onTyping?.(false);
                clearTimeout(typingTimeoutRef.current);

                // Add message optimistically to UI
                const optimisticMessage = {
                  messageId: null,
                  content: text.trim(),
                  type: "text",
                  timestamp: new Date().toISOString(),
                  isFromMe: true,
                  status: "sent",
                  pending: true,
                };

                setMessages((prev) => [...prev, optimisticMessage]);

                // Emit to socket
                socket.emit("send_message", {
                  receiverId: selectedUser._id,
                  message: text.trim(),
                  content: text.trim(),
                  senderId: user._id,
                  senderName: user.name,
                  type: "text",
                });

                setText("");
              }
            }}
            placeholder="Type message..."
            disabled={!socket}
          />

          {/* Send button */}
          <button
            onClick={() => {
              if (!text.trim() || !socket) return;

              // Clear typing indicator
              setIsTyping(false);
              onTyping?.(false);
              clearTimeout(typingTimeoutRef.current);

              // Add message optimistically
              const optimisticMessage = {
                messageId: null,
                content: text.trim(),
                type: "text",
                timestamp: new Date().toISOString(),
                isFromMe: true,
                status: "sent",
                pending: true,
              };

              setMessages((prev) => [...prev, optimisticMessage]);

              // Emit to socket
              socket.emit("send_message", {
                receiverId: selectedUser._id,
                message: text.trim(),
                content: text.trim(),
                senderId: user._id,
                senderName: user.name,
                type: "text",
              });

              setText("");
            }}
            disabled={!text.trim() || !socket}
            className="bg-gradient-to-r from-primary to-secondary text-dark px-5 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}
