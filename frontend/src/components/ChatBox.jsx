import { useState } from "react";

function ChatBox({ messages }) {

  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage) return;

    console.log("Message Sent:", newMessage);
    setNewMessage("");
  };

  return (
    <div className="bg-secondary rounded-lg p-4 flex flex-col h-[500px] shadow-md">

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`p-3 rounded-lg max-w-xs text-text ${
              msg.sender === "student"
                ? "bg-primary self-end"
                : "bg-dark self-start"
            }`}
          >
            {msg.text}
          </div>

        ))}

      </div>

      {/* Input Area */}
      <div className="flex mt-4 gap-2">

        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-3 bg-light text-text rounded border border-dark/20 placeholder-text/70"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />

        <button
          onClick={handleSend}
          className="bg-primary text-text px-6 py-3 rounded hover:bg-primary/80 transition-colors"
        >
          Send
        </button>

      </div>

    </div>
  );
}

export default ChatBox;
