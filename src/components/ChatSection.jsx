import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useGetTemplateChatsQuery, useCreateChatMutation, useDeleteChatMutation } from "../store/apiSlice";
import { useAuth } from "../context/AuthContext";

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60)    return "Just now";
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

function ChatBubble({ chat, isReply = false, userName, user, token, onReply, onDelete }) {
  const initials = (chat.userName || "U").slice(0, 2).toUpperCase();
  const colors = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"];
  const color = colors[chat.userName?.charCodeAt(0) % colors.length] || "bg-blue-500";
  return (
    <div className={`flex gap-3 ${isReply ? "ml-10 sm:ml-12" : ""}`}>
      <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center flex-shrink-0 shadow-sm ring-2 ring-[var(--color5)]`}>
        <span className="text-white fontStyle10 font-bold">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="fontStyle9 font-semibold text-[var(--color6)]">{chat.userName}</span>
          <span className="fontStyle10 text-[var(--color4)]">{timeAgo(chat.createdAt)}</span>
        </div>
        {isReply && chat.parentId && (
          <div className="mb-1.5 pl-3 border-l-2 border-[var(--color6)]/20">
            <span className="fontStyle10 text-[var(--color4)] italic">replying to thread...</span>
          </div>
        )}
        <p className="fontStyle9 text-[var(--color8)] leading-relaxed whitespace-pre-line break-words">{chat.message}</p>
        <div className="flex items-center gap-3 mt-1.5">
          {token && (
            <button onClick={() => onReply(chat)} className="fontStyle10 text-[var(--color4)] hover:text-blue-500 transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 flex items-center gap-1">
              <i className="bx bx-reply text-sm"></i> Reply
            </button>
          )}
          {token && user?.role === "admin" && (
            <button onClick={() => onDelete(chat._id)} className="fontStyle10 text-[var(--color4)] hover:text-red-400 transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 flex items-center gap-1">
              <i className="bx bx-trash text-sm"></i> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatSection({ templateId }) {
  const { token: contextToken, user } = useAuth();
  const token = contextToken || localStorage.getItem("token");
  const userName = user?.name || JSON.parse(localStorage.getItem("user") || "{}").name || "You";

  const { data: chatsData, isLoading: chatsLoading } = useGetTemplateChatsQuery(templateId, { skip: !templateId });
  const [createChat] = useCreateChatMutation();
  const [deleteChat] = useDeleteChatMutation();

  const [chats, setChats]     = useState([]);
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatsData?.success) {
      setChats(chatsData.chats);
    }
  }, [chatsData]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chats]);

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const res = await createChat({ templateId, message: message.trim(), parentId: replyTo?._id || null }).unwrap();
      if (res.success) {
        setChats((prev) => [...prev, res.chat]);
        setMessage("");
        setReplyTo(null);
      } else {
        setError(res.message || "Failed to send message");
      }
    } catch (err) {
      setError("Network error — please try again");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (chatId) => {
    try {
      const res = await deleteChat(chatId).unwrap();
      if (res.success) {
        setChats((prev) => prev.filter((c) => c._id !== chatId && c.parentId !== chatId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const topLevel = chats.filter((c) => !c.parentId);
  const getReplies = (parentId) => chats.filter((c) => c.parentId === parentId);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="fontStyle6 font-bold text-[var(--color6)] mb-1">
          Discussion
          <span className="fontStyle9 font-normal text-[var(--color4)] ml-2">({chats.length})</span>
        </h3>
        <p className="fontStyle9 text-[var(--color4)]">Questions, suggestions, or anything about this template.</p>
      </div>

      {chatsLoading ? (
        <div className="py-10 text-center">
          <p className="fontStyle9 text-[var(--color4)]">Loading discussion...</p>
        </div>
      ) : chats.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-[var(--color6)]/15 bg-[var(--color11)]/40">
          <i className="bx bx-chat text-4xl text-[var(--color4)] mb-3 block"></i>
          <p className="fontStyle7 font-bold text-[var(--color6)] mb-1">No Messages Yet</p>
          <p className="fontStyle9 text-[var(--color4)]">Start the discussion about this template.</p>
        </div>
      ) : (
        <div className="space-y-5 max-h-[500px] overflow-y-auto pr-1">
          {topLevel.map((chat) => (
            <div key={chat._id}>
              <ChatBubble chat={chat} userName={userName} user={user} token={token} onReply={setReplyTo} onDelete={handleDelete} />
              {getReplies(chat._id).map((reply) => (
                <div key={reply._id} className="mt-3">
                  <ChatBubble chat={reply} isReply userName={userName} user={user} token={token} onReply={setReplyTo} onDelete={handleDelete} />
                </div>
              ))}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      )}

      <div className="h-px bg-[var(--color6)]/10" />
      {error && (
        <p className="fontStyle10 text-red-400 flex items-center gap-1 px-1">
          <i className="bx bx-error-circle text-sm"></i> {error}
        </p>
      )}

      {token ? (
        <div className="space-y-3">
          {replyTo && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color11)] border border-[var(--color6)]/10">
              <i className="bx bx-reply text-blue-500 text-base"></i>
              <span className="fontStyle10 text-[var(--color4)] flex-1">
                Replying to <strong className="text-[var(--color6)]">{replyTo.userName}</strong>
              </span>
              <button onClick={() => setReplyTo(null)} className="text-[var(--color4)] hover:text-[var(--color6)] cursor-pointer bg-transparent border-none p-0">
                <i className="bx bx-x text-lg"></i>
              </button>
            </div>
          )}
          <div className="flex gap-3">
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color6)]/15 bg-[var(--color5)] text-[var(--color6)] fontStyle9 outline-none placeholder-[var(--color4)] focus:border-[var(--color6)]/50 focus:ring-2 focus:ring-[var(--color6)]/10 transition-all duration-200 resize-none"
            />
            <button
              onClick={handleSend}
              disabled={sending || !message.trim()}
              className="self-end px-5 py-2.5 rounded-xl fontStyle9 font-bold text-white border-none cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-1.5"
              style={{ background: "var(--color3)", opacity: sending || !message.trim() ? 0.5 : 1 }}
            >
              <i className="bx bx-send text-base"></i>
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3.5 rounded-xl bg-[var(--color11)] border border-[var(--color6)]/10 text-center">
          <p className="fontStyle9 text-[var(--color4)]">
            <Link to="/login" className="text-blue-500 hover:underline font-semibold">Login</Link> to join the discussion.
          </p>
        </div>
      )}
    </div>
  );
}
