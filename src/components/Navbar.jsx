import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/icons/logo.png";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { selectCartItems } from "../store/slices/cartSlice";
import { API_BASE } from "../services/api";
import { useLazyGetTemplatesQuery } from "../store/apiSlice";

// ── static fallback nav (unchanged) ───────────────────────────────────────────

const desktopNav = [
  { to: "/",            label: "Home",    icon: "bx-home"         },
  // { to: "/PricingPage", label: "Pricing", icon: "bx-purchase-tag" },
  { to: "/demo",        label: "Demos",   icon: "bx-play-circle"  },
  { to: "/blog",        label: "Blog",    icon: "bx-news"         },
];

const mobileNav = [
  { to: "/",            label: "Home",    icon: "bx-home"         },
  // { to: "/PricingPage", label: "Pricing", icon: "bx-purchase-tag" },
  { to: "/demo",       label: "Demos",   icon: "bx-play-circle"  },
  // { to: "/reviews",     label: "Reviews", icon: "bx-star"         },
  { to: "/blog",        label: "Blog",    icon: "bx-news"         },
  { to: "/contact",     label: "Contact", icon: "bx-envelope"     },
];

// ── dynamic mega-menu building blocks ─────────────────────────────────────────
// No "tab/type" field exists on templates, only `category`. So each unique
// category becomes its own tab, and the individual templates inside that
// category become the links — all derived live from the API response.

const TAB_ICONS = ["bx-globe", "bx-code-alt", "bx-buildings", "bx-star", "bx-shape-triangle", "bx-category", "bx-grid-alt", "bx-layer"];
const FEATURED_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
  "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
];

function slugify(str) {
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "general";
}

// Build mega-menu tabs dynamically from the fetched templates list.
function buildMegaMenuTabs(allTemplates) {
  if (!allTemplates.length) return [];

  const groups = new Map();
  allTemplates.forEach((t) => {
    const key = t.category || "General";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(t);
  });

  return Array.from(groups.entries()).map(([category, items], idx) => {
    const featuredItem = items.find((t) => t.tag === "FREE") || items[0];
    return {
      id: slugify(category),
      label: category,
      icon: TAB_ICONS[idx % TAB_ICONS.length],
      links: items.slice(0, 6).map((t) => ({
        id: t._id || t.id,
        to: `/templates?q=${encodeURIComponent(t.title)}`,
        label: t.title,
        desc: t.tag === "FREE" ? "Free template" : "Premium template",
      })),
      featured: {
        tag: featuredItem.tag === "FREE" ? "Free" : "Popular",
        title: featuredItem.title,
        desc: `Explore ${items.length} template${items.length === 1 ? "" : "s"} in ${category}.`,
        cta: "View All →",
        to: `/templates?q=${encodeURIComponent(category)}`,
        bg: FEATURED_GRADIENTS[idx % FEATURED_GRADIENTS.length],
      },
    };
  });
}

// ── resolve thumbnail from API template ───────────────────────────────────────
function resolveImage(t) {
  const origin = API_BASE.replace(/\/api$/, "");
  const raw = Array.isArray(t.images) && t.images.length > 0 ? t.images[0] : null;
  if (!raw) return null;
  return raw.startsWith("http") ? raw : `${origin}${raw}`;
}

// ── Suggestions dropdown (shared by desktop + mobile) ─────────────────────────
function SuggestionList({ suggestions, query, onSelect }) {
  if (!suggestions.length) return null;

  // Bold-highlight the matched portion
  const highlight = (text) => {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
      <>
        {text.slice(0, idx)}
        <strong className="text-[var(--color6)]">{text.slice(idx, idx + query.length)}</strong>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div className="absolute left-0 right-0 top-full mt-2 bg-[var(--color5)] border border-[var(--color6)]/15 rounded-2xl shadow-2xl overflow-hidden z-[9999999]">
      <div className="max-h-[340px] overflow-y-auto overscroll-contain scrollbar-thin">
        {suggestions.map((t) => (
          <button
            key={t.id}
            onMouseDown={(e) => { e.preventDefault(); onSelect(t); }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color11)] transition-colors duration-150 text-left border-0 bg-transparent cursor-pointer border-b border-[var(--color6)]/5 last:border-b-0"
          >
            {t.image && (
              <img src={t.image} alt="" className="w-14 h-10 object-cover rounded-lg shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="fontStyle9 text-[var(--color6)] truncate">
                {highlight(t.title)}
              </p>
              <p className="fontStyle10 text-[var(--color4)] truncate opacity-60">
              {t.category}
              {t.frameworks && t.frameworks.length > 0 && (
              <span className="opacity-70">
              {" • "}
              {t.frameworks.map((f, i) => (
              <span key={f}>
              {i > 0 && ", "}
              {highlight(f)}
              </span>
              ))}
              </span>
              )}
              </p>
            </div>
            <span className={`fontStyle10 font-bold px-2.5 py-0.5 rounded-full shrink-0 ${t.tag === "FREE" ? "text-green-500 bg-green-500/10" : "text-orange-400 bg-orange-400/10"}`}>
              {t.tag}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── component ─────────────────────────────────────────────────────────────────

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const cart = useSelector(selectCartItems);
  const navigate = useNavigate();

  const [fetchTemplates, { data: templatesData }] = useLazyGetTemplatesQuery();

  const [changeMode,   setChangeMode]   = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [megaOpen,     setMegaOpen]     = useState(false);
  const [activeTab,    setActiveTab]    = useState(null);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [mobileQuery,  setMobileQuery]  = useState("");
  const [scrolled,     setScrolled]     = useState(false);

  // ── all templates cached once for instant suggestions + mega menu ──
  const [allTemplates,       setAllTemplates]       = useState([]);
  const [desktopSuggestions, setDesktopSuggestions] = useState([]);
  const [mobileSuggestions,  setMobileSuggestions]  = useState([]);

  const desktopSearchRef = useRef(null);
  const mobileSearchRef  = useRef(null);
  const debounceRef      = useRef(null);

  // ── mega menu tabs built dynamically from live API data ────────────────────
  const megaMenuTabs = useMemo(() => buildMegaMenuTabs(allTemplates), [allTemplates]);
  const activeTabData = megaMenuTabs.find((t) => t.id === activeTab) || megaMenuTabs[0];

  // ── update allTemplates when RTK Query data arrives ──
  useEffect(() => {
    if (templatesData) {
      const raw = Array.isArray(templatesData) ? templatesData : templatesData.templates ?? [];
      setAllTemplates(raw.map((t) => ({
        id:       t._id,
        title:    t.name || "Untitled",
        category: t.category || t.subtitle || "General",
        tag:      t.price === 0 ? "FREE" : "PRO",
        image:    resolveImage(t),
        frameworks: Array.isArray(t.frameworks) ? t.frameworks : [],
      })));
    }
  }, [templatesData]);

  // Keep activeTab valid once dynamic tabs load / change
  useEffect(() => {
    if (megaMenuTabs.length === 0) return;
    if (!activeTab || !megaMenuTabs.some((t) => t.id === activeTab)) {
      setActiveTab(megaMenuTabs[0].id);
    }
  }, [megaMenuTabs, activeTab]);

  // ── debounced suggestion filter ────────────────────────────────────────────
const getSuggestions = useCallback((q) => {
  if (!q.trim()) return [];
  const lower = q.toLowerCase();
  return allTemplates
    .filter((t) =>
      t.title.toLowerCase().includes(lower) ||
      t.category.toLowerCase().includes(lower) ||
      t.tag.toLowerCase().includes(lower) ||
      (t.frameworks || []).some((f) => f.toLowerCase().includes(lower))
    )
    .slice(0, 6);
}, [allTemplates]);

  const handleDesktopQueryChange = (val) => {
    setSearchQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDesktopSuggestions(getSuggestions(val));
    }, 180);
  };

  const handleMobileQueryChange = (val) => {
    setMobileQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setMobileSuggestions(getSuggestions(val));
    }, 180);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "dark") {
      document.body.classList.add("dark");
      setChangeMode(true);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen) {
      if (!allTemplates.length) fetchTemplates();
      if (desktopSearchRef.current) desktopSearchRef.current.focus();
    }
    if (!searchOpen) { setSearchQuery(""); setDesktopSuggestions([]); }
  }, [searchOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") { setSearchOpen(false); }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const toggleMode = () => {
    if (changeMode) {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setChangeMode(!changeMode);
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
    setMegaOpen(false);
    setMobileQuery("");
    setMobileSuggestions([]);
  };

  // ── navigate on submit ─────────────────────────────────────────────────────
  const handleDesktopSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    navigate(`/templates?q=${encodeURIComponent(q)}`);
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    const q = mobileQuery.trim();
    if (!q) return;
    closeMobileMenu();
    navigate(`/templates?q=${encodeURIComponent(q)}`);
  };

  // ── click a suggestion → open Templates page filtered by that title ─────────
  const selectDesktopSuggestion = (t) => {
    setSearchOpen(false);
    setSearchQuery("");
    setDesktopSuggestions([]);
    navigate(`/templates?q=${encodeURIComponent(t.title)}`);
  };

  const selectMobileSuggestion = (t) => {
    closeMobileMenu();
    navigate(`/templates?q=${encodeURIComponent(t.title)}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      {/* ===== Main Header ===== */}
      <header className={`header ${scrolled ? "header_scrolled" : ""} ${changeMode ? "bg-[var(--color1)]" : "bg-[var(--color5)] border-b border-gray-200"}`}>
        <div className="w-width">
          <div className="flex justify-between items-center">

            <div className="logo">
              <Link to="/" className="fontStyle5 font-bold">
                <img src={logo} alt="Logo" className="w-17" />
              </Link>
            </div>

            {/* ===== Desktop Navigation ===== */}
            <nav className="nav_bar hidden lg:block">
              <ul className="flex items-center gap-10 fontStyle8 text-[var(--color6)]">

                <li>
                  <Link to="/" className="hover:opacity-70 transition duration-300 flex items-center gap-1.5">
                    <i className="bx bx-home text-base"></i> Home
                  </Link>
                </li>

                {/* ── Templates mega menu ── */}
                <li className="relative group" onMouseEnter={() => { if (!allTemplates.length) fetchTemplates(); }}>
                  <Link
                    to="/templates"
                    className="hover:opacity-70 transition duration-300 flex items-center gap-1.5"
                  >
                    <i className="bx bx-layout text-base"></i>
                    Templates
                    <i className="bx bx-chevron-down text-base transition-transform duration-300 group-hover:rotate-180"></i>
                  </Link>

                  {/* Dropdown panel */}
                  {megaMenuTabs.length > 0 && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 hidden group-hover:block z-[9999]">
                      <div className="relative shadow-2xl rounded-2xl border border-[var(--color11)] w-[860px] bg-[var(--color5)]">

                        {/* arrow */}
                        <div className="absolute -top-[9px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--color5)] border-l border-t border-[var(--color11)] rotate-45 z-10"></div>

                        <div className="flex min-h-[340px]">

                          {/* LEFT — tab list */}
                          <div className="flex flex-col py-4 px-3 gap-1 border-r border-[var(--color11)] w-[210px] bg-[var(--color5)] rounded-l-2xl overflow-y-auto max-h-[400px]">
                            {megaMenuTabs.map((tab) => (
                              <button
                                key={tab.id}
                                onMouseEnter={() => setActiveTab(tab.id)}
                                className={`w-full text-left flex items-center justify-between gap-2 px-3 py-3 rounded-xl transition-all duration-200 fontStyle8 cursor-pointer border-0 outline-none
                                  ${activeTab === tab.id
                                    ? "bg-[rgba(99,102,241,0.08)] text-[var(--color4)] font-semibold"
                                    : "bg-transparent text-[var(--color6)] hover:bg-[var(--color11)] hover:bg-opacity-40"
                                  }`}
                              >
                                <span className="flex items-center gap-2.5 truncate">
                                  <i className={`bx ${tab.icon} text-base shrink-0`}></i>
                                  <span className="truncate">{tab.label}</span>
                                </span>
                                <i className="bx bx-chevron-right text-sm opacity-50 shrink-0"></i>
                              </button>
                            ))}

                            <div className="mt-auto pt-3 border-t border-[var(--color11)]">
                              <Link
                                to="/templates"
                                className="flex items-center gap-2 px-3 py-2.5 fontStyle9 text-[var(--color4)] font-semibold hover:opacity-70 transition duration-200"
                              >
                                <i className="bx bx-grid-alt text-sm"></i>
                                All Templates
                              </Link>
                            </div>
                          </div>

                          {/* MIDDLE — links for active tab */}
                          <div className="flex-1 py-6 px-6">
                            <p className="fontStyle9 font-bold text-[var(--color4)] uppercase tracking-widest mb-4 opacity-60">
                              {activeTabData?.label}
                            </p>
                            <ul className="space-y-1">
                              {activeTabData?.links.map((item) => (
                                <li key={item.id ?? item.to}>
                                  <Link
                                    to={item.to}
                                    className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color11)] hover:bg-opacity-40 transition duration-200 group/item"
                                  >
                                    <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-[rgba(99,102,241,0.1)]">
                                      <i className="bx bx-link-external text-xs text-[var(--color4)]"></i>
                                    </span>
                                    <div>
                                      <p className="fontStyle8 font-semibold text-[var(--color6)] group-hover/item:text-[var(--color4)] transition duration-200">
                                        {item.label}
                                      </p>
                                      <p className="fontStyle9 text-[var(--color6)] opacity-50 text-xs mt-0.5">
                                        {item.desc}
                                      </p>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* RIGHT — featured card */}
                          <div className="py-6 px-5 flex flex-col justify-between w-[240px] border-l border-[var(--color11)] rounded-r-2xl">
                            <div>
                              <p className="fontStyle9 font-bold text-[var(--color4)] uppercase tracking-widest mb-4 opacity-60">
                                Featured
                              </p>

                              <div
                                className="rounded-xl overflow-hidden mb-4 h-[148px] relative"
                                style={{ background: activeTabData?.featured.bg }}
                              >
                                <div className="absolute -top-5 -right-5 w-[100px] h-[100px] rounded-full bg-white/[0.08]" />
                                <div className="absolute -bottom-[30px] -left-5 w-[130px] h-[130px] rounded-full bg-white/[0.06]" />
                                <span className="absolute top-3 left-3 fontStyle9 font-bold text-xs px-2 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                                  {activeTabData?.featured.tag}
                                </span>
                                <div className="absolute bottom-3 left-3 right-3 rounded-lg p-2 bg-white/[0.15] backdrop-blur-md">
                                  <div className="flex gap-1 mb-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
                                  </div>
                                  <div className="h-1 rounded-sm bg-white/40 mb-[3px]" />
                                  <div className="h-1 rounded-sm bg-white/25 w-[70%]" />
                                </div>
                              </div>

                              <p className="fontStyle8 font-bold text-[var(--color6)] mb-1">
                                {activeTabData?.featured.title}
                              </p>
                              <p className="fontStyle9 text-[var(--color6)] opacity-50 text-xs leading-relaxed">
                                {activeTabData?.featured.desc}
                              </p>
                            </div>

                            <Link
                              to={activeTabData?.featured.to}
                              className="fontStyle9 font-semibold text-[var(--color4)] hover:opacity-70 transition duration-200 mt-4 inline-flex items-center gap-1"
                            >
                              {activeTabData?.featured.cta}
                            </Link>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}
                </li>

                {desktopNav.slice(1).map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="hover:opacity-70 transition duration-300 flex items-center gap-1.5">
                      <i className={`bx ${item.icon} text-base`}></i> {item.label}
                    </Link>
                  </li>
                ))}

              </ul>
            </nav>

            {/* ===== Desktop Login / Search / Dark Mode ===== */}
            <div className="login_sign hidden lg:flex gap-4 items-center">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-[var(--color6)] text-xl cursor-pointer bg-transparent hover:opacity-70 transition duration-300"
                aria-label="Open search"
              >
                <i className="bx bx-search text-xl"></i>
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                  {/* Cart circle with count — only when cart has items */}
                  {cart.length > 0 && (
                    <Link
                      to="/cart"
                      className="relative w-9 h-9 rounded-full bg-[var(--color6)] text-[var(--color5)] flex items-center justify-center hover:opacity-90 transition duration-300"
                    >
                      <i className="bx bx-cart text-lg"></i>
                      <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                        {cart.length}
                      </span>
                    </Link>
                  )}

                  {/* User dropdown */}
                  <div className="relative group">
                    <button className="fontStyle8 bg-[var(--color6)] text-[var(--color5)] pl-1.5 pr-4 py-1.5 rounded-full hover:opacity-90 transition duration-300 flex items-center gap-2 border-0 cursor-pointer">
                      <span className="w-7 h-7 rounded-full bg-[var(--color5)] text-[var(--color6)] flex items-center justify-center fontStyle9 font-bold uppercase">
                        {user.name.charAt(0)}
                      </span>
                      {user.name.split(" ")[0]}
                      <i className="bx bx-chevron-down text-sm transition-transform duration-300 group-hover:rotate-180"></i>
                    </button>
                    <div className="absolute right-0 top-full pt-3 hidden group-hover:block z-[9999]">
                      <div className="bg-[var(--color5)] border border-[var(--color11)] rounded-2xl shadow-2xl w-56 overflow-hidden">
                        <div className="px-4 py-4 border-b border-[var(--color11)]">
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-full bg-[var(--color6)] text-[var(--color5)] flex items-center justify-center fontStyle8 font-bold uppercase shrink-0">
                              {user.name.charAt(0)}
                            </span>
                            <div className="min-w-0">
                              <p className="fontStyle8 font-semibold text-[var(--color6)] truncate">{user.name}</p>
                              {user.email && <p className="fontStyle10 text-[var(--color6)] opacity-40 truncate">{user.email}</p>}
                            </div>
                          </div>
                        </div>
                        <div className="py-1.5 px-1.5">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-3 py-2.5 fontStyle9 text-[var(--color6)] hover:bg-[var(--color11)] rounded-xl transition duration-200"
                          >
                            <span className="w-8 h-8 rounded-lg bg-[var(--color11)] flex items-center justify-center shrink-0">
                              <i className="bx bx-user text-base text-[var(--color6)] opacity-60"></i>
                            </span>
                            <span>Profile</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-3 px-3 py-2.5 fontStyle9 text-red-500 hover:bg-red-500/10 rounded-xl transition duration-200 bg-transparent border-0 cursor-pointer"
                          >
                            <span className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                              <i className="bx bx-log-out text-base"></i>
                            </span>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="fontStyle8 bg-[var(--color6)] text-[var(--color5)] px-5 py-2 rounded-full hover:opacity-90 transition duration-300 flex items-center gap-1.5">
                  Log In
                </Link>
              )}

              <div onClick={toggleMode} className="cursor-pointer text-2xl text-[var(--color6)]">
                <i className={`bx ${changeMode ? "bx-moon" : "bx-sun"}`}></i>
              </div>
            </div>

            {/* ===== Mobile controls ===== */}
            <div className="flex items-center gap-3 lg:hidden">
              {user && cart.length > 0 && (
                <Link
                  to="/cart"
                  className="relative w-10 h-10 rounded-xl bg-[var(--color11)] text-[var(--color6)] flex items-center justify-center hover:bg-[var(--color6)] hover:text-[var(--color5)] transition-all duration-300"
                >
                  <i className="bx bx-cart text-lg"></i>
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                    {cart.length}
                  </span>
                </Link>
              )}
              {user ? (
                <Link
                  to="/profile"
                  className="w-10 h-10 rounded-xl bg-[var(--color6)] text-[var(--color5)] flex items-center justify-center fontStyle9 font-bold uppercase hover:opacity-80 transition-all duration-300"
                >
                  {user.name.charAt(0)}
                </Link>
              ) : (
                <Link to="/login" className="fontStyle9 bg-[var(--color6)] text-[var(--color5)] px-4 py-2 rounded-xl hover:opacity-90 transition-all duration-300 flex items-center gap-1.5">
                  <i className="bx bx-log-in text-base"></i>
                </Link>
              )}
              <button
                onClick={toggleMode}
                className="w-10 h-10 rounded-xl bg-[var(--color11)] text-[var(--color6)] flex items-center justify-center hover:bg-[var(--color6)] hover:text-[var(--color5)] transition-all duration-300"
              >
                <i className={`bx ${changeMode ? "bx-moon" : "bx-sun"} text-lg`}></i>
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 rounded-xl bg-[var(--color11)] flex items-center justify-center text-[var(--color6)] hover:bg-[var(--color6)] hover:text-[var(--color5)] transition-all duration-300"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ===== Mobile Overlay (Slide-in) ===== */}
      <div
        className={`mobile_overlay fixed inset-0 z-[99999] lg:hidden flex flex-col bg-[var(--color5)] ${
          menuOpen ? "mobile_overlay_open" : "mobile_overlay_closed"
        }`}
      >
        {/* Top bar */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-[var(--color11)]">
          <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-10" />
          </Link>
          <button
            onClick={closeMobileMenu}
            className="w-10 h-10 rounded-xl bg-[var(--color11)] flex items-center justify-center text-[var(--color6)] hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
            aria-label="Close menu"
          >
            <i className="bx bx-x text-xl"></i>
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-4 relative">
          <form onSubmit={handleMobileSearch} className="mobile_search_bar">
            <i className="bx bx-search text-lg text-[var(--color6)] opacity-40 shrink-0"></i>
            <input
              ref={mobileSearchRef}
              type="text"
              value={mobileQuery}
              onChange={(e) => handleMobileQueryChange(e.target.value)}
              placeholder="Search templates..."
              className="flex-1 bg-transparent outline-none fontStyle8 text-[var(--color6)] placeholder-[var(--color6)] placeholder-opacity-30 text-[15px]"
            />
            {mobileQuery && (
              <button
                type="button"
                onClick={() => { setMobileQuery(""); setMobileSuggestions([]); }}
                className="w-7 h-7 rounded-full bg-[var(--color6)]/10 flex items-center justify-center text-[var(--color6)] hover:bg-red-500/15 hover:text-red-500 transition-all duration-200"
              >
                <i className="bx bx-x text-sm"></i>
              </button>
            )}
          </form>
          <SuggestionList
            suggestions={mobileSuggestions}
            query={mobileQuery}
            onSelect={selectMobileSuggestion}
          />
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-5 pb-4">
          <div className="space-y-1">
            {/* Home */}
            <Link to="/" className="mobile_nav_item text-[var(--color6)] fontStyle7 font-medium" onClick={closeMobileMenu}>
              <span className="w-10 h-10 rounded-xl bg-[var(--color11)] flex items-center justify-center shrink-0">
                <i className="bx bx-home text-lg"></i>
              </span>
              <span className="flex-1">Home</span>
              <i className="bx bx-chevron-right text-lg opacity-20"></i>
            </Link>

            {/* Templates (expandable) */}
            <div>
              <button
                onClick={() => { setMegaOpen(!megaOpen); if (!allTemplates.length) fetchTemplates(); }}
                className="w-full mobile_nav_item text-[var(--color6)] fontStyle7 font-medium"
              >
                <span className="w-10 h-10 rounded-xl bg-[rgba(99,102,241,0.1)] flex items-center justify-center shrink-0">
                  <i className="bx bx-layout text-lg text-[var(--color4)]"></i>
                </span>
                <span className="flex-1 text-left">Templates</span>
                <i className={`bx bx-chevron-right text-lg opacity-20 transition-transform duration-300 ${megaOpen ? "rotate-90" : ""}`}></i>
              </button>

              {megaOpen && megaMenuTabs.length > 0 && (
                <div className="ml-4 mt-1 mb-3 pl-6 border-l-2 border-[var(--color11)]">
                  <div className="flex gap-2 overflow-x-auto pb-3 pt-2 no-scrollbar">
                    {megaMenuTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`shrink-0 px-4 py-2 rounded-full fontStyle9 text-xs font-semibold transition-all duration-200 border-0 cursor-pointer
                          ${activeTab === tab.id
                            ? "bg-[var(--color6)] text-[var(--color5)] shadow-lg"
                            : "bg-[var(--color11)] text-[var(--color6)]"
                          }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <ul className="space-y-0.5 mt-1">
                    {activeTabData?.links.map((item) => (
                      <li key={item.id ?? item.to}>
                        <Link
                          to={item.to}
                          className="flex items-center gap-3 py-2.5 px-2 text-[var(--color6)] fontStyle8 rounded-lg hover:bg-[var(--color11)] transition duration-200"
                          onClick={closeMobileMenu}
                        >
                          <i className="bx bx-link-external text-xs opacity-30"></i>
                          <div>
                            <p className="font-medium text-[15px]">{item.label}</p>
                            <p className="text-xs opacity-40 mt-0.5">{item.desc}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Remaining nav items */}
            {mobileNav.slice(1).map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                className="mobile_nav_item text-[var(--color6)] fontStyle7 font-medium"
                onClick={closeMobileMenu}
              >
                <span className="w-10 h-10 rounded-xl bg-[var(--color11)] flex items-center justify-center shrink-0">
                  <i className={`bx ${item.icon} text-lg`}></i>
                </span>
                <span className="flex-1">{item.label}</span>
                <i className="bx bx-chevron-right text-lg opacity-20"></i>
              </Link>
            ))}
          </div>

          {/* User section at bottom of nav */}
          {user && (
            <div className="mt-4 pt-4 border-t border-[var(--color11)] space-y-1">
              <Link to="/profile" className="mobile_nav_item text-[var(--color6)] fontStyle7 font-medium" onClick={closeMobileMenu}>
                <span className="w-10 h-10 rounded-xl bg-[var(--color11)] flex items-center justify-center shrink-0">
                  <i className="bx bx-user text-lg"></i>
                </span>
                <span className="flex-1">Profile</span>
                <i className="bx bx-chevron-right text-lg opacity-20"></i>
              </Link>
              <button
                onClick={() => { dispatch(logout()); closeMobileMenu(); navigate("/"); }}
                className="w-full mobile_nav_item text-red-500 fontStyle7 font-medium"
              >
                <span className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                  <i className="bx bx-log-out text-lg"></i>
                </span>
                <span className="flex-1 text-left">Logout</span>
              </button>
            </div>
          )}
        </nav>

        {/* Bottom CTA */}
        <div className="px-5 py-4 border-t border-[var(--color11)]">
          {!user && (
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[var(--color6)] text-[var(--color5)] fontStyle8 font-semibold hover:opacity-90 transition duration-300"
            >
              <i className="bx bx-log-in text-lg"></i>
              Log In
            </Link>
          )}
          <div className="flex justify-center gap-5 mt-4">
            {["Terms","Privacy","Refund"].map((l) => (
              <Link key={l} to={`/${l.toLowerCase().replace(/ /g,"-")}`} className="fontStyle10 text-[var(--color6)] opacity-30 hover:opacity-60 transition duration-300" onClick={closeMobileMenu}>{l}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Desktop Search Overlay ===== */}
      <div
        className={`fixed inset-0 z-[999999] flex flex-col items-center justify-start pt-32 px-6 transition-all duration-300 bg-black/60 backdrop-blur-sm ${
          searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
      >
        <div className="w-full max-w-2xl relative">
          <form
            onSubmit={handleDesktopSearch}
            className="flex items-center gap-4 bg-[var(--color5)] rounded-2xl px-6 py-4 shadow-2xl"
          >
            <i className="bx bx-search text-2xl text-[var(--color6)] opacity-50 shrink-0"></i>
            <input
              ref={desktopSearchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleDesktopQueryChange(e.target.value)}
              placeholder="Search templates..."
              className="flex-1 bg-transparent outline-none fontStyle7 text-[var(--color6)] text-lg placeholder-opacity-40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setDesktopSuggestions([]); }}
                className="text-[var(--color6)] opacity-50 hover:opacity-100 transition duration-200 bg-transparent"
              >
                <i className="bx bx-x text-2xl"></i>
              </button>
            )}
          </form>

          {/* Suggestions */}
          <SuggestionList
            suggestions={desktopSuggestions}
            query={searchQuery}
            onSelect={selectDesktopSuggestion}
          />

          <p className="text-center text-white opacity-40 text-sm mt-4 fontStyle9">
            Press <kbd className="px-2 py-0.5 rounded bg-white/20 text-white text-xs">Esc</kbd> to close
          </p>
        </div>
      </div>
    </>
  );
}