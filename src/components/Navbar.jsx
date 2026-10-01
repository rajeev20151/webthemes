import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/icons/logo.png";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { selectCartItems } from "../store/slices/cartSlice";
import { useLazyGetTemplatesQuery } from "../store/apiSlice";
import OfferBar from "./OfferBar";
import DesktopMegaMenu from "./navbar/DesktopMegaMenu";
import HeaderActions from "./navbar/HeaderActions";
import MobileControls from "./navbar/MobileControls";
import MobileMenu from "./navbar/MobileMenu";
import SearchOverlay from "./navbar/SearchOverlay";
import { desktopNav, buildMegaMenuTabs, resolveImage } from "./navbar/navbarData";

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

  const clearDesktopQuery = () => {
    setSearchQuery("");
    setDesktopSuggestions([]);
  };

  const clearMobileQuery = () => {
    setMobileQuery("");
    setMobileSuggestions([]);
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
    if (!searchOpen) clearDesktopQuery();
  }, [searchOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") { setSearchOpen(false); }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // ── templates are only fetched the first time they are needed ──
  const ensureTemplates = useCallback(() => {
    if (!allTemplates.length) fetchTemplates();
  }, [allTemplates.length, fetchTemplates]);

  const toggleTheme = () => {
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
    clearMobileQuery();
  };

  const toggleMega = () => {
    setMegaOpen((prev) => !prev);
    ensureTemplates();
  };

  // ── navigate on submit ─────────────────────────────────────────────────────
  const goToSearch = (e, q, after) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    after();
    navigate(`/templates?q=${encodeURIComponent(term)}`);
  };

  // ── click a suggestion → open Templates page filtered by that title ─────────
  const goToSuggestion = (t, after) => {
    after();
    navigate(`/templates?q=${encodeURIComponent(t.title)}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      {/* ===== Main Header ===== */}
      <header className={`header ${scrolled ? "header_scrolled" : ""}`}>
        <OfferBar />
        <div className="w-width">
          <div className="header_row">

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

                <DesktopMegaMenu
                  tabs={megaMenuTabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onEnsureTemplates={ensureTemplates}
                />

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
            <HeaderActions
              user={user}
              cartCount={cart.length}
              onOpenSearch={() => setSearchOpen(true)}
              onLogout={handleLogout}
              isDark={changeMode}
              onToggleTheme={toggleTheme}
            />

            {/* ===== Mobile controls ===== */}
            <MobileControls
              user={user}
              cartCount={cart.length}
              menuOpen={menuOpen}
              onToggleMenu={() => setMenuOpen(!menuOpen)}
              isDark={changeMode}
              onToggleTheme={toggleTheme}
            />

          </div>
        </div>
      </header>

      {/* ===== Mobile Overlay (Slide-in) ===== */}
      <MobileMenu
        open={menuOpen}
        onClose={closeMobileMenu}
        user={user}
        onLogout={() => { handleLogout(); closeMobileMenu(); }}
        query={mobileQuery}
        onQueryChange={handleMobileQueryChange}
        onClearQuery={clearMobileQuery}
        suggestions={mobileSuggestions}
        onSubmitSearch={(e) => goToSearch(e, mobileQuery, closeMobileMenu)}
        onSelectSuggestion={(t) => goToSuggestion(t, closeMobileMenu)}
        searchInputRef={mobileSearchRef}
        megaOpen={megaOpen}
        onToggleMega={toggleMega}
        tabs={megaMenuTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* ===== Desktop Search Overlay ===== */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        query={searchQuery}
        onQueryChange={handleDesktopQueryChange}
        onClearQuery={clearDesktopQuery}
        suggestions={desktopSuggestions}
        onSubmitSearch={(e) => goToSearch(e, searchQuery, () => setSearchOpen(false))}
        onSelectSuggestion={(t) => goToSuggestion(t, () => { setSearchOpen(false); clearDesktopQuery(); })}
        searchInputRef={desktopSearchRef}
      />
    </>
  );
}
