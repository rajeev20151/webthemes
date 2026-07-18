import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef} from "react";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import SEOHead from "../components/SEOHead";
import { getTemplateReviewsAPI, getTemplateChatsAPI, createTemplateChatAPI, deleteTemplateChatAPI, getTemplateAPI, getTemplatesAPI, API_BASE } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ReviewsSection from "../components/ReviewsSection";

const imgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  const origin = API_BASE.replace(/\/api\/?$/, "");
  return `${origin}${path}`;
};

/* build editor's-pick / related-products from raw API list */
function buildEditorPicks(all, currentId) {
  return all
    .filter((t) => t._id !== currentId)
    .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, 3)
    .map((t) => ({
      id: t._id,
      title: t.name,
      price: t.price === 0 ? "Free" : `$${t.price}`,
      purchases: t.downloads || 0,
      rating: t.rating || 0,
      reviews: t.reviews || 0,
      image: t.images?.[0]
        ? t.images[0].startsWith("http")
          ? t.images[0]
          : `${API_BASE.replace(/\/api\/?$/, "")}${t.images[0]}`
        : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      badge: (t.frameworks?.[0] || "TEMPLATE").toUpperCase(),
      badgeCls: t.price === 0 ? "bg-green-500" : "bg-violet-700",
      originalPrice: t.originalPrice ? `$${t.originalPrice}` : null,
    }));
}

function buildRelatedProducts(all, currentId, currentCategory) {
  return all
    .filter((t) => t._id !== currentId)
    .sort((a, b) => {
      const aMatch = (a.category || "").toLowerCase() === (currentCategory || "").toLowerCase() ? 1 : 0;
      const bMatch = (b.category || "").toLowerCase() === (currentCategory || "").toLowerCase() ? 1 : 0;
      return bMatch - aMatch || (b.downloads || 0) - (a.downloads || 0);
    })
    .slice(0, 3)
    .map((t) => ({
      id: t._id,
      title: t.name,
      price: t.price === 0 ? "Free" : `$${t.price}`,
      downloads: t.downloads || 0,
      rating: t.rating || 0,
      reviews: t.reviews || 0,
      image: t.images?.[0]
        ? t.images[0].startsWith("http")
          ? t.images[0]
          : `${API_BASE.replace(/\/api\/?$/, "")}${t.images[0]}`
        : "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
    }));
}

/* ── Star Rating ── */
function StarRating({ rating, size = "text-sm" }) {
  return (
    <div className={`flex items-center gap-0.5 ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i key={star} className={`bx ${star <= Math.floor(rating) ? "bxs-star" : star - 0.5 <= rating ? "bxs-star-half" : "bx-star"} text-yellow-400 drop-shadow-sm`}></i>
      ))}
    </div>
  );
}

/* ── Tag Pill ── */
function TagPill({ label }) {
  return (
    <span className="fontStyle10 px-3 py-1.5 rounded-full border border-[var(--color6)]/15 bg-[var(--color5)] text-[var(--color4)] hover:text-[var(--color6)] hover:border-[var(--color6)]/35 hover:shadow-sm transition-all duration-200 cursor-pointer inline-block">
      {label}
    </span>
  );
}

/* ── Download / Add to Cart Buttons ── */
function DownloadButtons({ compact = false, isFree = true, price = 0, link = "", previewUrl = "", downloadUrl = "", theme = {}, addToCart = () => {} }) {
 
  const navigate = useNavigate();
  const { token } = useAuth();

  const handlePreview = () => {
    const url = previewUrl || link;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

   const handleDownload = () => {
    // Login check
    if (!token) {
    navigate("/login", {
    state: {
    from: window.location.pathname,
    },
    });
    return;
    }

    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };


    const handleAddToCart = () => {
    if (!token) {
      navigate("/login", {
        state: {
          from: window.location.pathname,
        },
      });
      return;
    }

    addToCart({
      _id: theme._id,
      name: theme.name,
      price: theme.price,
      originalPrice: theme.originalPrice,
      image: theme.images?.[0] || "",
      tag: theme.tag,
    });

    navigate("/cart");
  };

  return (
    <div className={compact ? "flex gap-3 flex-col sm:flex-row gap-3" : "space-y-3"}>
      {isFree ? (
        <button onClick={handleDownload}  className={`${compact ? "flex-1" : "w-full"} py-3.5 cursor-pointer rounded-xl fontStyle8 font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500`}>
          <i className="bx bx-download text-lg"></i>
          Download
        </button>
      ) : (
        <button
        onClick={handleAddToCart}
        className={`${compact ? "flex-1" : "w-full"} py-3.5 cursor-pointer rounded-xl fontStyle8 font-bold text-white flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`} style={{ background: "var(--color3)", boxShadow: "0 10px 25px -8px var(--color3)" }}>
          <i className="bx bx-cart-add text-lg"></i>
          Add to Cart - ${price}
        </button>
      )}
      <button
        onClick={handlePreview}
        className={`${compact ? "flex-1" : "w-full"} py-3.5 cursor-pointer rounded-xl fontStyle8 font-semibold text-green-500 border-2 border-green-500/30 flex items-center justify-center gap-2 hover:bg-green-500/8 hover:border-green-500/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500`}
      >
        Live Preview <i className="bx bx-link-external text-base"></i>
      </button>
    </div>
  );
}

/* ── Theme Meta Card ── */
function ThemeMetaCard({ theme }) {
  return (
    <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-5 space-y-3.5 shadow-sm hover:shadow-md transition-shadow duration-300">
      {[
        { label: "Version:", value: theme.version },
        { label: "Update Date:", value: theme.updateDate },
        { label: "Release Date:", value: theme.releaseDate },
      ].map((item, i) => (
        <div key={i} className="flex items-center justify-between">
          <span className="fontStyle9 text-[var(--color4)]">{item.label}</span>
          <span className="fontStyle9 font-semibold text-[var(--color6)]">{item.value}</span>
        </div>
      ))}
      <div className="flex items-start justify-between pt-1 border-t border-[var(--color6)]/10">
        <span className="fontStyle9 text-[var(--color4)]">Category:</span>
        <Link to="#" className="fontStyle9 font-semibold text-blue-500 hover:text-blue-600 hover:underline text-right transition-colors duration-200">{theme.category}</Link>
      </div>
      <div className="flex items-start justify-between border-t border-[var(--color6)]/10 pt-3">
        <span className="fontStyle9 text-[var(--color4)] flex-shrink-0 mr-3">Frameworks</span>
        <div className="flex flex-wrap gap-1 justify-end">
          {(theme.frameworks || []).map((f) => (
            <Link key={f} to="#" className="fontStyle10 text-blue-500 hover:text-blue-600 hover:underline transition-colors duration-200">{f}</Link>
          ))}
        </div>
      </div>
      <div className="flex items-start justify-between border-t border-[var(--color6)]/10 pt-3">
        <span className="fontStyle9 text-[var(--color4)] flex-shrink-0 mr-3">Compatible With</span>
        <div className="flex flex-wrap gap-x-1 justify-end">
          {(theme.compatible || []).map((c, i, arr) => (
            <span key={i} className="fontStyle10 text-blue-500">{c}{i < arr.length - 1 ? "," : ""}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Newsletter Card ── */
function NewsletterCard({ email, setEmail }) {
  return (
    <div className="rounded-2xl border border-[var(--color6)]/10 bg-gradient-to-br from-[var(--color11)] to-[var(--color11)] p-5 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.07]" style={{ background: "linear-gradient(135deg,#fdc830,#f37335)" }} />
      <p className="fontStyle8 font-semibold text-[var(--color6)] mb-1 relative">Get new themes or big discounts in your inbox.</p>
      <p className="fontStyle9 text-[var(--color4)] mb-4 relative">Never spam.</p>
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-[var(--color6)]/15 bg-[var(--color5)] text-[var(--color6)] fontStyle9 outline-none placeholder-[var(--color4)] focus:border-[var(--color6)]/50 focus:ring-2 focus:ring-[var(--color6)]/10 transition-all duration-200 mb-3 relative"
      />
      <button className="w-full py-2.5 rounded-xl fontStyle9 font-bold text-white bg-color3 shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400">
        Subscribe
      </button>
      <p className="fontStyle10 text-[var(--color4)] text-center mt-2 relative">
        Powered by <Link to="#" className="text-blue-400 hover:text-blue-500 hover:underline transition-colors duration-200">MailBluster</Link>
      </p>
    </div>
  );
}

/* ── Chat Section ── */
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60)    return "Just now";
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

function ChatSection({ templateId }) {
  const { token: contextToken, user } = useAuth();
  const token = contextToken || localStorage.getItem("token");
  const userName = user?.name || JSON.parse(localStorage.getItem("user") || "{}").name || "You";

  const [chats, setChats]     = useState([]);
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState("");
  const chatEndRef = useRef(null);

  const fetchChats = async () => {
    try {
      const res = await getTemplateChatsAPI(templateId);
      if (res.success) setChats(res.chats);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (templateId) fetchChats(); }, [templateId]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chats]);

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const res = await createTemplateChatAPI(templateId, {
        message: message.trim(),
        parentId: replyTo?._id || null,
      });
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
      const res = await deleteTemplateChatAPI(chatId);
      if (res.success) {
        setChats((prev) => prev.filter((c) => c._id !== chatId && c.parentId !== chatId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const topLevel = chats.filter((c) => !c.parentId);
  const getReplies = (parentId) => chats.filter((c) => c.parentId === parentId);

  const ChatBubble = ({ chat, isReply = false }) => {
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
              <button onClick={() => setReplyTo(chat)} className="fontStyle10 text-[var(--color4)] hover:text-blue-500 transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 flex items-center gap-1">
                <i className="bx bx-reply text-sm"></i> Reply
              </button>
            )}
            {token && (chat.userName === userName || user?.role === "admin") && (
              <button onClick={() => handleDelete(chat._id)} className="fontStyle10 text-[var(--color4)] hover:text-red-400 transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 flex items-center gap-1">
                <i className="bx bx-trash text-sm"></i> Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="fontStyle6 font-bold text-[var(--color6)] mb-1">
          Discussion
          <span className="fontStyle9 font-normal text-[var(--color4)] ml-2">({chats.length})</span>
        </h3>
        <p className="fontStyle9 text-[var(--color4)]">Questions, suggestions, or anything about this template.</p>
      </div>

      {loading ? (
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
              <ChatBubble chat={chat} />
              {getReplies(chat._id).map((reply) => (
                <div key={reply._id} className="mt-3">
                  <ChatBubble chat={reply} isReply />
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

/* ── MAIN PAGE ── */
export default function Themes() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { loading, token } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(null);
  const [themeLoading, setThemeLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [email, setEmail] = useState("");
  const [reviewCount, setReviewCount] = useState(0);
  const [editorPicks, setEditorPicks] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  /* fetch template */
  useEffect(() => {
    if (!id) return;
    setThemeLoading(true);
    getTemplateAPI(id)
      .then((res) => { if (res.success) setTheme(res.template); })
      .catch(console.error)
      .finally(() => setThemeLoading(false));
  }, [id]);

  /* fetch review count */
  useEffect(() => {
    if (!id) return;
    getTemplateReviewsAPI(id)
      .then((res) => { if (res.success) setReviewCount(res.stats.total); })
      .catch(console.error);
  }, [id]);

  /* fetch all templates → compute editor picks & related products */
  useEffect(() => {
    if (!id) return;
    getTemplatesAPI()
      .then((res) => {
        const all = Array.isArray(res) ? res : res.templates ?? [];
        setEditorPicks(buildEditorPicks(all, id));
        setRelatedProducts(buildRelatedProducts(all, id, theme?.category));
      })
      .catch(() => { setEditorPicks([]); setRelatedProducts([]); });
  }, [id, theme?.category]);

  if (themeLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color5)]">
      <p className="fontStyle9 text-[var(--color4)]">Loading...</p>
    </div>
  );
  if (!theme) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color5)]">
      <p className="fontStyle9 text-[var(--color4)]">Template not found.</p>
    </div>
  );

  const resolvedImages = (theme.images || []).map(imgUrl);
  const isFree = !theme.price || theme.price === 0;

  const resolvedPreviewUrl = theme.previewUrl
    ? `${API_BASE.replace(/\/api\/?$/, "")}${theme.previewUrl}`
    : theme.link || "";

   const resolvedDownloadUrl = theme.zipFile
    ? `${API_BASE.replace(/\/api\/?$/, "")}${theme.zipFile}`
    : "";  

  const templateImage = resolvedImages[0] || "";

  const handleMobilePreview = () => {
    if (resolvedPreviewUrl) window.open(resolvedPreviewUrl, "_blank", "noopener,noreferrer");
  };

  /* sticky mobile top bar: same login-guard logic as DownloadButtons */
  const handleStickyDownload = () => {
    if (!token) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    if (!resolvedDownloadUrl) return;
    const a = document.createElement("a");
    a.href = resolvedDownloadUrl;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleStickyAddToCart = () => {
    if (!token) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    addToCart({
      _id: theme._id,
      name: theme.name,
      price: theme.price,
      originalPrice: theme.originalPrice,
      image: theme.images?.[0] || "",
      tag: theme.tag,
    });

    navigate("/cart");
  };

  return (
    <section className="pb-16 bg-[var(--color5)] min-h-screen">
      <SEOHead
        title={theme.name}
        description={theme.description || `${theme.name} - Free template download. ${theme.category || ""} category.`}
        image={templateImage}
        type="product"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": theme.name,
          "description": theme.description || theme.name,
          "image": templateImage,
          "category": theme.category,
          "brand": { "@type": "Organization", "name": "TemplateWorld" },
          "offers": {
            "@type": "Offer",
            "price": theme.price || 0,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": theme.rating ? {
            "@type": "AggregateRating",
            "ratingValue": theme.rating,
            "reviewCount": reviewCount || 1
          } : undefined
        }}
      />

      {/* ── STICKY MOBILE TOP BAR ── */}
      <div className="hidden sticky top-0 z-50 border-b border-[var(--color6)]/10 bg-[var(--color5)] bg-blur px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="fontStyle10 font-bold text-[var(--color6)] truncate">{(theme.name || "").split("–")[0].trim()}</p>
            <p className="fontStyle10 text-[var(--color4)]">{isFree ? "Free Template" : `$${theme.price}`} · {theme.downloads || 0} Downloads</p>
          </div>
          {isFree ? (
            <button onClick={handleStickyDownload} className="flex-shrink-0 flex items-center gap-1.5 py-2 px-4 rounded-xl fontStyle9 font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-md shadow-green-500/25 hover:shadow-green-500/40 transition-shadow duration-200">
              <i className="bx bx-download text-base"></i>
              Download
            </button>
          ) : (
            <button onClick={handleStickyAddToCart} className="flex-shrink-0 flex items-center gap-1.5 py-2 px-4 rounded-xl fontStyle9 font-bold text-white shadow-md hover:shadow-lg transition-shadow duration-200" style={{ background: "var(--color3)" }}>
              <i className="bx bx-cart-add text-base"></i>
              ${theme.price}
            </button>
          )}
          <button
            onClick={handleMobilePreview}
            className="flex-shrink-0 w-9 h-9 rounded-xl border-2 border-green-500/30 text-green-500 flex items-center justify-center hover:bg-green-500/8 transition-colors duration-200"
          >
            <i className="bx bx-link-external text-base"></i>
          </button>
        </div>
      </div>

      <div className="w-width py-10 sm:py-12 md:py-20">

        <BreadCrumb_Nav
          items={[
            { label: "Home", path: "/" },
            { label: "Templates", path: "/templates" },
            { label: "Templates-Details", path: `/templates/${id}` },
          ]}
        />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start mt-5">

          {/* ── MAIN CONTENT ── */}
          <div className="w-full lg:flex-1 min-w-0">

            <h1 className="fontStyle5 font-bold text-[var(--color6)] mb-2 leading-tight tracking-tight">
              {theme.name}
            </h1>

            <div className="flex items-center gap-3 mb-5">
              <StarRating rating={theme.rating || 0} />
              <Link to="#reviews" className="fontStyle9 text-[var(--color4)] hover:text-[var(--color6)] transition-colors duration-200 underline-offset-2 hover:underline">
                {reviewCount} customers reviews
              </Link>
            </div>

            {/* MOBILE: Quick Download + Meta */}
            <div className="lg:hidden space-y-4 mb-6">
              <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="fontStyle8 font-bold text-[var(--color6)]">
                    {isFree ? "Free download" : `$${theme.price}`}
                  </span>
                  <Link to="#" className="fontStyle9 text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1 transition-colors duration-200">
                    License <i className="bx bx-chevron-right text-sm"></i>
                  </Link>
                </div>
                <DownloadButtons isFree={isFree} price={theme.price} link={theme.link} previewUrl={resolvedPreviewUrl} downloadUrl={resolvedDownloadUrl} theme={theme} addToCart={addToCart} />
                <div className="mt-3 flex flex-wrap gap-3">
                  {(isFree
                    ? ["Open source", "Commercial use", "Free updates"]
                    : ["Premium Support", "Commercial use", "Free updates"]
                  ).map((perk, i) => (
                    <div key={i} className="flex items-center gap-1.5 fontStyle10 text-[var(--color8)]">
                      <i className="bx bx-check text-green-500 text-sm"></i>
                      {perk}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { icon: "bx-tag",      label: "Version",   value: theme.version    },
                  { icon: "bx-calendar", label: "Updated",   value: theme.updateDate },
                  { icon: "bx-folder",   label: "Category",  value: theme.category   },
                  { icon: "bx-download", label: "Downloads", value: theme.downloads || 0 },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl border border-[var(--color6)]/10 bg-[var(--color11)] p-3 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <i className={`bx ${item.icon} text-[var(--color4)] text-lg block mb-1`}></i>
                    <p className="fontStyle10 text-[var(--color4)]">{item.label}</p>
                    <p className="fontStyle10 font-semibold text-[var(--color6)]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Gallery */}
            <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden border-2 border-[var(--color6)]/10 bg-[var(--color11)] shadow-lg shadow-black/5">
              <div className="relative overflow-hidden aspect-video">
                {resolvedImages[activeImage] ? (
                  <img
                    src={resolvedImages[activeImage]}
                    alt={`Preview ${activeImage + 1}`}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="fontStyle9 text-[var(--color4)]">No image</p>
                  </div>
                )}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between">
                  <span className="fontStyle10 font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-white shadow-md" style={{ background: "var(--color3)" }}>
                    {isFree ? "FREE" : `$${theme.price}`}
                  </span>
                  <span className="fontStyle10 px-3 py-1.5 rounded-full bg-black/60 text-white backdrop-blur-sm flex items-center gap-1.5 shadow-md">
                    <i className="bx bx-download text-sm"></i>
                    {theme.downloads || 0} Downloads
                  </span>
                </div>
                {resolvedImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((p) => (p - 1 + resolvedImages.length) % resolvedImages.length)}
                      className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 hover:scale-110 shadow-md transition-all duration-200"
                    >
                      <i className="bx bx-chevron-left text-lg"></i>
                    </button>
                    <button
                      onClick={() => setActiveImage((p) => (p + 1) % resolvedImages.length)}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 hover:scale-110 shadow-md transition-all duration-200"
                    >
                      <i className="bx bx-chevron-right text-lg"></i>
                    </button>
                  </>
                )}
              </div>
              <div className="flex gap-2 p-3 overflow-x-auto">
                {resolvedImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-11 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${activeImage === i ? "border-[var(--color6)] opacity-100 shadow-md" : "border-transparent opacity-50 hover:opacity-80"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-[var(--color6)]/10 mb-6 flex gap-4 sm:gap-6">
              {["description", "reviews", "discussion"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 fontStyle8 font-semibold capitalize transition-all duration-200 border-b-2 -mb-px ${activeTab === tab ? "border-[var(--color6)] text-[var(--color6)]" : "border-transparent text-[var(--color4)] hover:text-[var(--color6)] hover:border-[var(--color6)]/30"}`}
                >
                  {tab === "reviews" ? `Reviews (${reviewCount})` : tab === "discussion" ? "Discussion" : "Description"}
                </button>
              ))}
            </div>

            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="space-y-6 sm:space-y-8">
                 
                <p className="fontStyle6 text-[var(--color6)] font-bold leading-relaxed">
                  {theme.subtitle || theme.name}
                </p>

                <p className="fontStyle9 text-[var(--color8)] leading-relaxed">
                  {theme.description}
                </p>

                {(theme.keyFeatures || []).length > 0 && (
                  <div>
                    <h2 className="fontStyle6 font-bold text-[var(--color6)] mb-4">Key Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(theme.keyFeatures || []).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2.5 fontStyle8 text-[var(--color8)] rounded-lg px-3 py-2 hover:bg-[var(--color11)] transition-colors duration-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color6)] flex-shrink-0 opacity-60"></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(theme.inTheBox || []).length > 0 && (
                  <div>
                    <h2 className="fontStyle6 font-bold text-[var(--color6)] mb-4">In The Box</h2>
                    <div className="space-y-2">
                      {(theme.inTheBox || []).map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 fontStyle8 text-[var(--color8)]">
                          <i className="bx bx-check-circle text-[var(--color6)] opacity-60 text-base flex-shrink-0"></i>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(theme.libraries || []).length > 0 && (
                  <div>
                    <h2 className="fontStyle6 font-bold text-[var(--color6)] mb-4">Library & Plugins</h2>
                    <div className="space-y-2">
                      {(theme.libraries || []).map((lib, i) => (
                        <div key={i} className="flex items-center gap-2.5 fontStyle8">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color6)] flex-shrink-0 opacity-60"></span>
                          <Link to="#" className="text-blue-500 hover:text-blue-600 hover:underline transition-colors duration-200">{lib}</Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <ReviewsSection onCountChange={setReviewCount} templateId={id} />
            )}

            {/* Discussion Tab */}
            {activeTab === "discussion" && (
              <ChatSection templateId={id} />
            )}

            {/* MOBILE: Sidebar inline */}
            <div className="lg:hidden mt-8 space-y-4">
              <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="fontStyle7 font-bold text-[var(--color6)]">
                    {isFree ? "Free download" : `$${theme.price}`}
                  </span>
                  <Link to="#" className="fontStyle9 text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1 transition-colors duration-200">
                    License <i className="bx bx-chevron-right text-sm"></i>
                  </Link>
                </div>
                <DownloadButtons isFree={isFree} price={theme.price} link={theme.link} previewUrl={resolvedPreviewUrl} downloadUrl={resolvedDownloadUrl} theme={theme} addToCart={addToCart} />
                <div className="mt-4 space-y-2">
                  {(isFree
                    ? ["Open source", "Use in commercial projects", "Life time free updates"]
                    : ["Premium Support", "Use in commercial projects", "Life time free updates"]
                  ).map((perk, i) => (
                    <div key={i} className="flex items-center gap-2 fontStyle9 text-[var(--color8)]">
                      <i className="bx bx-check text-green-500 text-base flex-shrink-0"></i>
                      {perk}
                    </div>
                  ))}
                </div>
                <div className="pt-4 mt-4 border-t border-[var(--color6)]/10 flex items-center gap-2 fontStyle8 text-[var(--color4)]">
                  <i className="bx bx-download text-base"></i>
                  <strong className="text-[var(--color6)] mr-1">{theme.downloads || 0}</strong> Downloads
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-4 flex items-center justify-between shadow-sm">
                <span className="fontStyle8 font-semibold text-[var(--color6)]">Questions?</span>
                <Link to="/contact" className="fontStyle9 font-semibold text-[var(--color6)] border-2 border-[var(--color6)]/20 px-4 py-2 rounded-lg hover:bg-[var(--color6)] hover:text-[var(--color5)] hover:border-[var(--color6)] transition-all duration-200">
                  Contact Author
                </Link>
              </div>

              <ThemeMetaCard theme={theme} />

              {(theme.tags || []).length > 0 && (
                <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-4 sm:p-5 shadow-sm">
                  <p className="fontStyle9 text-[var(--color4)] mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {(theme.tags || []).map((tag) => <TagPill key={tag} label={tag} />)}
                  </div>
                </div>
              )}

              <NewsletterCard email={email} setEmail={setEmail} />
            </div>

            {/* Related Products */}
            <div className="mt-10 sm:mt-14">
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-0.5 bg-[var(--color6)] rounded-full opacity-70"></span>
                  <div>
                    <h2 className="fontStyle6 font-bold text-[var(--color6)] tracking-tight">Related products</h2>
                    <p className="fontStyle10 text-[var(--color4)]">Themes in the same category.</p>
                  </div>
                </div>
                <Link to="/templates" className="fontStyle9 font-semibold text-[var(--color6)] flex items-center gap-1 hover:gap-2 hover:text-blue-500 transition-all duration-200">
                  View all <i className="bx bx-chevron-right text-base"></i>
                </Link>
              </div>
              {relatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {relatedProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/template/${product.id}`}
                      className="group border-2 border-[var(--color6)]/10 rounded-2xl overflow-hidden bg-[var(--color11)] shadow-sm hover:shadow-xl hover:border-[var(--color6)]/30 hover:-translate-y-1.5 transition-all duration-300"
                    >
                      <div className="relative overflow-hidden aspect-[13/9]">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className={`absolute top-2.5 left-2.5 fontStyle10 font-bold uppercase px-2.5 py-1 rounded-full text-white text-xs shadow-md ${product.price === "Free" ? "bg-green-500" : "bg-[var(--color3)]"}`}>
                          {product.price}
                        </span>
                      </div>
                      <div className="p-3.5">
                        <h3 className="fontStyle9 font-semibold text-[var(--color6)] mb-2 line-clamp-2 leading-snug group-hover:text-[var(--color3)] transition-colors duration-200">{product.title}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 fontStyle10 text-[var(--color4)]">
                            <i className="bx bx-download text-xs"></i>
                            {product.downloads.toLocaleString()} downloads
                          </div>
                          <div className="flex items-center gap-1">
                            <StarRating rating={product.rating} size="text-xs" />
                            <span className="fontStyle10 text-[var(--color4)]">({product.reviews})</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center rounded-2xl border border-dashed border-[var(--color6)]/15 bg-[var(--color11)]/40">
                  <p className="fontStyle9 text-[var(--color4)]">No related themes found.</p>
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT SIDEBAR (desktop) ── */}
          <div className="hidden lg:flex flex-col gap-5 flex-shrink-0 w-[290px] xl:w-[310px] sticky top-6">

            <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="fontStyle7 font-bold text-[var(--color6)]">
                  {isFree ? "Free download" : `$${theme.price}`}
                </span>
                <Link to="#" className="fontStyle9 text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1 transition-colors duration-200">
                  License <i className="bx bx-chevron-right text-sm"></i>
                </Link>
              </div>
              <DownloadButtons isFree={isFree} price={theme.price} link={theme.link} previewUrl={resolvedPreviewUrl} downloadUrl={resolvedDownloadUrl} theme={theme} addToCart={addToCart} />
              <div className="mt-4 space-y-2 mb-5">
                {(isFree
                  ? ["Open source", "Use in commercial projects", "Life time free updates"]
                  : ["Premium Support", "Use in commercial projects", "Life time free updates"]
                ).map((perk, i) => (
                  <div key={i} className="flex items-center gap-2 fontStyle9 text-[var(--color8)]">
                    <i className="bx bx-check text-green-500 text-base flex-shrink-0"></i>
                    {perk}
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-[var(--color6)]/10 flex items-center gap-2 fontStyle8 text-[var(--color4)]">
                <i className="bx bx-download text-base"></i>
                <strong className="text-[var(--color6)] mr-1">{theme.downloads || 0}</strong> Downloads
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
              <span className="fontStyle8 font-semibold text-[var(--color6)]">Questions?</span>
              <Link to="/contact" className="fontStyle9 font-semibold text-[var(--color6)] border-2 border-[var(--color6)]/20 px-4 py-2 rounded-lg hover:bg-[var(--color6)] hover:text-[var(--color5)] hover:border-[var(--color6)] transition-all duration-200">
                Contact Author
              </Link>
            </div>

            {/* Editor's Pick */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-0.5 bg-[var(--color6)] rounded-full opacity-60"></span>
                  <span className="fontStyle10 font-bold uppercase tracking-wider text-[var(--color6)]">Editor's Pick</span>
                </div>
                <Link to="/templates" className="fontStyle10 text-[var(--color4)] hover:text-blue-500 flex items-center gap-1 transition-colors duration-200">
                  View All <i className="bx bx-chevron-right text-sm"></i>
                </Link>
              </div>
              {editorPicks.length > 0 ? (
                <div className="space-y-3.5">
                  {editorPicks.map((pick) => (
                    <Link key={pick.id} to={`/template/${pick.id}`}
                      className="group flex flex-col border border-[var(--color6)]/10 rounded-xl overflow-hidden bg-[var(--color11)] shadow-sm hover:shadow-lg hover:border-[var(--color6)]/25 hover:-translate-y-0.5 transition-all duration-300">
                      <div className="relative overflow-hidden aspect-video">
                        <img src={pick.image} alt={pick.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        {pick.originalPrice && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-black rounded-full px-2.5 py-1 text-center shadow-md">
                            <p className="fontStyle10 font-semibold line-through opacity-60 leading-none">{pick.originalPrice}</p>
                            <p className="fontStyle9 font-black leading-none">{pick.price}</p>
                          </div>
                        )}
                        <span className={`absolute top-2 left-2 fontStyle10 font-bold uppercase px-2 py-0.5 rounded text-white text-xs shadow-md ${pick.badgeCls}`}>
                          {pick.badge}
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="fontStyle9 font-semibold text-[var(--color6)] mb-1.5 line-clamp-1 group-hover:text-[var(--color3)] transition-colors duration-200">{pick.title}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 fontStyle10 text-[var(--color4)]">
                            <i className="bx bx-cart text-xs"></i>
                            {pick.purchases.toLocaleString()} Purchases
                          </div>
                          <div className="flex items-center gap-1">
                            <StarRating rating={pick.rating} size="text-xs" />
                            <span className="fontStyle10 text-[var(--color4)]">({pick.reviews})</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center rounded-xl border border-dashed border-[var(--color6)]/15 bg-[var(--color11)]/40">
                  <p className="fontStyle10 text-[var(--color4)]">Loading picks...</p>
                </div>
              )}
            </div>

            <ThemeMetaCard theme={theme} />

            {(theme.tags || []).length > 0 && (
              <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="fontStyle9 text-[var(--color4)] mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {(theme.tags || []).map((tag) => <TagPill key={tag} label={tag} />)}
                </div>
              </div>
            )}

            <NewsletterCard email={email} setEmail={setEmail} />

          </div>

        </div>
      </div>
    </section>
  );
}