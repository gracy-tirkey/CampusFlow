import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

function ChatBox({ messages }) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    console.log("Message Sent:", newMessage);
    setNewMessage("");
  };

  return (
    <div className="bg-secondary rounded-lg p-4 flex flex-col h-[500px] shadow-md">

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-xs break-words ${
              msg.sender === "student"
                ? "bg-primary self-end flex items-center gap-2"
                : "bg-dark self-start flex items-center gap-2"
            }`}
          >
            {msg.sender === "student" ? <FaUserGraduate className="text-text/70" /> : <FaChalkboardTeacher className="text-text/70" />}
            <span className="text-text">{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-3 bg-light text-text rounded border border-dark/20 placeholder-text/70 focus:outline-none focus:ring-2 focus:ring-primary"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        />

        <button
          onClick={handleSend}
          className="bg-primary text-text px-4 py-2 rounded hover:bg-primary/80 transition-colors flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!newMessage.trim()}
        >
          <FaPaperPlane />
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;