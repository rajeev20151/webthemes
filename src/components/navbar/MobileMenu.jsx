import { Link } from "react-router-dom";
import logo from "../../assets/icons/logo.png";
import SuggestionList from "./SuggestionList";
import { mobileNav } from "./navbarData";

const FOOTER_LINKS = ["Terms", "Privacy", "Refund"];

// Full-screen slide-in menu for < lg. All state/handlers come from Navbar.
export default function MobileMenu({
  open, onClose,
  user, onLogout,
  query, onQueryChange, onClearQuery, suggestions, onSubmitSearch, onSelectSuggestion, searchInputRef,
  megaOpen, onToggleMega, tabs, activeTab, onTabChange,
}) {
  const activeTabData = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div
      className={`mobile_overlay fixed inset-0 z-[99999] lg:hidden flex flex-col bg-[var(--color5)] ${
        open ? "mobile_overlay_open" : "mobile_overlay_closed"
      }`}
    >
      {/* Top bar */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-[var(--color11)]">
        <Link to="/" onClick={onClose} className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10" />
        </Link>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-[var(--color11)] flex items-center justify-center text-[var(--color6)] hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
          aria-label="Close menu"
        >
          <i className="bx bx-x text-xl"></i>
        </button>
      </div>

      {/* Search */}
      <div className="px-5 py-4 relative">
        <form onSubmit={onSubmitSearch} className="mobile_search_bar">
          <i className="bx bx-search text-lg text-[var(--color6)] opacity-40 shrink-0"></i>
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search templates..."
            className="flex-1 bg-transparent outline-none fontStyle8 text-[var(--color6)] placeholder-[var(--color6)] placeholder-opacity-30 text-[15px]"
          />
          {query && (
            <button
              type="button"
              onClick={onClearQuery}
              className="w-7 h-7 rounded-full bg-[var(--color6)]/10 flex items-center justify-center text-[var(--color6)] hover:bg-red-500/15 hover:text-red-500 transition-all duration-200"
            >
              <i className="bx bx-x text-sm"></i>
            </button>
          )}
        </form>
        <SuggestionList
          suggestions={suggestions}
          query={query}
          onSelect={onSelectSuggestion}
        />
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="space-y-1">
          {/* Home */}
          <Link to="/" className="mobile_nav_item text-[var(--color6)] fontStyle7 font-medium" onClick={onClose}>
            <span className="w-10 h-10 rounded-xl bg-[var(--color11)] flex items-center justify-center shrink-0">
              <i className="bx bx-home text-lg"></i>
            </span>
            <span className="flex-1">Home</span>
            <i className="bx bx-chevron-right text-lg opacity-20"></i>
          </Link>

          {/* Templates (expandable) */}
          <div>
            <button
              onClick={onToggleMega}
              className="w-full mobile_nav_item text-[var(--color6)] fontStyle7 font-medium"
            >
              <span className="w-10 h-10 rounded-xl bg-[rgba(99,102,241,0.1)] flex items-center justify-center shrink-0">
                <i className="bx bx-layout text-lg text-[var(--color4)]"></i>
              </span>
              <span className="flex-1 text-left">Templates</span>
              <i className={`bx bx-chevron-right text-lg opacity-20 transition-transform duration-300 ${megaOpen ? "rotate-90" : ""}`}></i>
            </button>

            {megaOpen && tabs.length > 0 && (
              <div className="ml-4 mt-1 mb-3 pl-6 border-l-2 border-[var(--color11)]">
                <div className="flex gap-2 overflow-x-auto pb-3 pt-2 no-scrollbar">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange(tab.id)}
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
                        onClick={onClose}
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
          {mobileNav.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="mobile_nav_item text-[var(--color6)] fontStyle7 font-medium"
              onClick={onClose}
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
            <Link to="/profile" className="mobile_nav_item text-[var(--color6)] fontStyle7 font-medium" onClick={onClose}>
              <span className="w-10 h-10 rounded-xl bg-[var(--color11)] flex items-center justify-center shrink-0">
                <i className="bx bx-user text-lg"></i>
              </span>
              <span className="flex-1">Profile</span>
              <i className="bx bx-chevron-right text-lg opacity-20"></i>
            </Link>
            <button
              onClick={onLogout}
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
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[var(--color6)] text-[var(--color5)] fontStyle8 font-semibold hover:opacity-90 transition duration-300"
          >
            <i className="bx bx-log-in text-lg"></i>
            Log In
          </Link>
        )}
        <div className="flex justify-center gap-5 mt-4">
          {FOOTER_LINKS.map((l) => (
            <Link
              key={l}
              to={`/${l.toLowerCase().replace(/ /g, "-")}`}
              className="fontStyle10 text-[var(--color6)] opacity-30 hover:opacity-60 transition duration-300"
              onClick={onClose}
            >
              {l}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
