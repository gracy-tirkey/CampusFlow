import { useState, useEffect, useRef, useCallback } from "react";
import API from "../api/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaEdit, FaTrash, FaCopy } from "react-icons/fa";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [chatsList, setChatsList] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const hasFetched = useRef(false);

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  // ---------------- FETCH CHATS ----------------
  const fetchChats = useCallback(async () => {
    try {
      const res = await API.get("/ai");
      // Handle both response formats
      const chatsData = res.data?.data || res.data;
      if (!Array.isArray(chatsData)) return;

      setChatsList(chatsData);

      if (chatsData.length && !currentChatId) {
        setCurrentChatId(chatsData[0]._id);
        setChat(chatsData[0].messages || []);
      }
    } catch (err) {
      console.error(err);
      setChatsList([]);
    }
  }, [currentChatId]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => fetchChats(), 0);
  }, [fetchChats]);

  // ---------------- REAL STREAM (SSE FAST) ----------------
  const streamSSE = (chatId, msg) => {
    const userMsg = { sender: "user", text: msg };

    setChat((prev) => [
      ...prev,
      userMsg,
      { sender: "ai", text: "", done: false },
    ]);
    setLoading(true);

    const aiIndex = chat.length + 1;

    const evtSource = new EventSource(
      `${API.defaults.baseURL}/ai/stream/${chatId}?message=${encodeURIComponent(msg)}`,
    );

    abortRef.current = evtSource;

    evtSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        evtSource.close();

        setChat((prev) => {
          const copy = [...prev];
          if (copy[aiIndex]) copy[aiIndex].done = true;
          return copy;
        });

        setLoading(false);
        return;
      }

      setChat((prev) => {
        const copy = [...prev];
        if (copy[aiIndex]) copy[aiIndex].text += event.data;
        return copy;
      });
    };

    evtSource.onerror = () => {
      evtSource.close();
      setLoading(false);
    };
  };

  // ---------------- SEND ----------------
  const sendMessage = async () => {
    if (!message.trim()) return;

    let chatId = currentChatId;

    if (!chatId) {
      const res = await API.post("/ai/new");
      chatId = res.data._id;
      setCurrentChatId(chatId);
      setChatsList((p) => [res.data, ...p]);
    }

    const msg = message;
    setMessage("");

    streamSSE(chatId, msg);
  };

  const stopGenerating = () => {
    abortRef.current?.close();
    setLoading(false);
  };

  // ---------------- CHAT OPS ----------------
  const loadChat = async (id) => {
    const res = await API.get(`/ai/${id}`);
    const chatData = res.data?.data || res.data;
    setCurrentChatId(id);
    setChat(chatData?.messages || []);
  };

  const deleteChat = async (id) => {
    await API.delete(`/ai/${id}`);
    setChatsList((p) => p.filter((c) => c._id !== id));
  };

  const renameChat = async (id) => {
    const title = prompt("Enter new name:");
    if (!title) return;

    const res = await API.put(`/ai/${id}`, { title });
    const renamedChat = res.data?.data || res.data;
    setChatsList((p) => p.map((c) => (c._id === id ? renamedChat : c)));
  };

  // ---------------- MARKDOWN ----------------
  const Markdown = ({ text, isStreaming }) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children }) {
          const match = /language-(\w+)/.exec(className || "");

          return !inline ? (
            <div className="relative">
              <SyntaxHighlighter style={oneDark} language={match?.[1]}>
                {String(children)}
              </SyntaxHighlighter>

              <button
                disabled={isStreaming}
                onClick={() => navigator.clipboard.writeText(String(children))}
                className="absolute top-2 right-2 text-xs px-2 py-1 bg-black/60 rounded"
              >
                Copy
              </button>
            </div>
          ) : (
            <code className="bg-black/30 px-1 rounded">{children}</code>
          );
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );

  const filteredChats = chatsList.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-[#0f172a] text-white">
      {/* SIDEBAR */}
      <div className="hidden md:flex w-72 border-r border-white/10 p-4 flex flex-col">
        <button
          onClick={async () => {
            const res = await API.post("/ai/new");
            setChatsList((p) => [res.data, ...p]);
            setCurrentChatId(res.data._id);
            setChat([]);
          }}
          className="mb-4 bg-white/10 hover:bg-white/20 p-2 rounded-xl"
        >
          + New Chat
        </button>

        <input
          placeholder="Search"
          className="mb-4 p-2 rounded bg-white/5 border border-white/10"
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredChats.map((c) => (
            <div
              key={c._id}
              onClick={() => loadChat(c._id)}
              className={`p-2 rounded cursor-pointer flex justify-between ${
                currentChatId === c._id ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <span className="truncate">{c.title}</span>

              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <FaEdit onClick={() => renameChat(c._id)} />
                <FaTrash onClick={() => deleteChat(c._id)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex flex-col flex-1">
        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">
          {chat.map((m, i) => (
            <div key={i} className="max-w-3xl mx-auto w-full">
              <div
                className={`p-4 rounded-2xl ${
                  m.sender === "user"
                    ? "bg-blue-600 ml-auto w-fit"
                    : "bg-white/5"
                }`}
              >
                {m.sender === "ai" ? (
                  <>
                    <Markdown text={m.text} isStreaming={!m.done} />
                    {!m.done && (
                      <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse" />
                    )}
                  </>
                ) : (
                  m.text
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-center opacity-60 animate-pulse">
              Thinking...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT */}
        <div className="sticky bottom-0 p-3 md:p-4 bg-[#0f172a] border-t border-white/10">
          <div className="max-w-3xl mx-auto flex gap-2">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), sendMessage())
              }
              placeholder="Message AI..."
              className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 resize-none"
            />

            {loading ? (
              <button
                onClick={stopGenerating}
                className="px-4 bg-red-500 rounded-xl"
              >
                Stop
              </button>
            ) : (
              <button
                onClick={sendMessage}
                className="px-4 bg-blue-600 rounded-xl"
              >
                Send
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
