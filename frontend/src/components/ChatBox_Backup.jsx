// ChatBox.jsx (Enhanced + All Features Back)
import { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function ChatBox({
  messages,
  setMessages,
  socket,
  selectedUser,
  user,
}) {
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

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

  const send = () => {
    if (!text.trim() || !socket) return;

    // Add message optimistically to UI
    const optimisticMessage = {
      content: text.trim(),
      timestamp: new Date().toISOString(),
      isFromMe: true,
      pending: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    // Emit to socket
    socket.emit("send_message", {
      receiverId: selectedUser._id,
      message: text.trim(),
      senderId: user._id,
      senderName: user.name,
    });

    setText("");
  };

  return (
    <div className="flex flex-col h-full bg-background dark:bg-dark">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.isFromMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl backdrop-blur-sm border ${
                m.isFromMe
                  ? "bg-gradient-to-r from-primary to-secondary text-dark border-primary/30 shadow-md"
                  : "bg-background/50 dark:bg-dark/50 text-dark dark:text-light border-secondary/30 dark:border-secondary/20"
              }`}
            >
              <p className="text-sm">{m.content}</p>
              <p className="text-[10px] mt-1 opacity-70 text-right">
                {formatTime(m.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-background/40 dark:bg-dark/40 backdrop-blur-md border-t border-secondary/30 dark:border-secondary/20 flex gap-3">
        <input
          className="flex-1 px-4 py-3 rounded-xl bg-background/50 dark:bg-dark/50 border border-secondary/30 dark:border-secondary/20 text-dark dark:text-light placeholder-muted focus:border-primary outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Type message..."
        />
        <button
          onClick={send}
          disabled={!text.trim()}
          className="bg-gradient-to-r from-primary to-secondary text-dark px-5 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
