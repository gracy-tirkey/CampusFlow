import { useState, useEffect } from "react";
import {
  FaTimes,
  FaSearch,
  FaUser,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";
import API from "../api/axios";

export default function ShareModal({
  isOpen,
  onClose,
  itemType,
  itemId,
  itemTitle,
  onShareComplete,
}) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch users when search changes
  useEffect(() => {
    if (!search.trim()) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setSearchLoading(true);
      try {
        const res = await API.get(
          `/share/users/list?search=${encodeURIComponent(search)}`,
        );
        setUsers(res.data.data || []);
        setError("");
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setSearchLoading(false);
      }
    };

    const timeout = setTimeout(fetchUsers, 300); // Debounce
    return () => clearTimeout(timeout);
  }, [search]);

  const handleShare = async () => {
    if (!selectedUser) {
      setError("Please select a user");
      return;
    }

    setSharing(true);
    try {
      await API.post("/share", {
        itemType,
        itemId,
        recipientId: selectedUser._id,
        message: message.trim(),
      });

      // Success
      setError("");
      setMessage("");
      setSelectedUser(null);
      setSearch("");
      onShareComplete?.();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to share";
      setError(errorMsg);
      console.error("Share error:", err);
    } finally {
      setSharing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-white/10 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            Share {itemType === "note" ? "Note" : "Doubt"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {/* Item Title Display */}
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <p className="text-xs text-white/60">Sharing:</p>
            <p className="text-sm font-medium text-white line-clamp-2">
              {itemTitle}
            </p>
          </div>

          {/* User Search */}
          <div>
            <label className="text-xs text-white/60 block mb-1">
              Search User
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name or email..."
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {searchLoading && (
                <FaSpinner className="absolute right-3 top-3 text-white/40 animate-spin" />
              )}
            </div>
          </div>

          {/* User List */}
          {users.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-white/60">Select recipient:</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {users.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full text-left flex items-center gap-2 p-2 rounded-lg transition-all ${
                      selectedUser?._id === user._id
                        ? "bg-blue-600 text-white"
                        : "bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    <FaUser size={12} className="text-white/60" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-white/60 truncate">
                        {user.email}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          {selectedUser && (
            <div>
              <label className="text-xs text-white/60 block mb-1">
                Optional Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a note..."
                rows="2"
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-2 rounded-lg text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-white/10 bg-white/5">
          <button
            onClick={onClose}
            disabled={sharing}
            className="flex-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={!selectedUser || sharing}
            className="flex-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-1"
          >
            {sharing ? (
              <>
                <FaSpinner className="animate-spin" size={14} />
                Sharing...
              </>
            ) : (
              <>
                <FaPaperPlane size={14} />
                Share
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
