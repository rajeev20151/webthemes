import { Link } from "react-router-dom";

const CLOSE_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const MENU_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);

// Mobile right-hand cluster: cart, profile/login, theme toggle, hamburger.
export default function MobileControls({ user, cartCount, menuOpen, onToggleMenu, isDark, onToggleTheme }) {
  return (
    <div className="flex items-center gap-3 lg:hidden">
      {user && cartCount > 0 && (
        <Link
          to="/cart"
          className="relative w-10 h-10 rounded-xl bg-[var(--color11)] text-[var(--color6)] flex items-center justify-center hover:bg-[var(--color6)] hover:text-[var(--color5)] transition-all duration-300"
        >
          <i className="bx bx-cart text-lg"></i>
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
            {cartCount}
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
        onClick={onToggleTheme}
        className="w-10 h-10 rounded-xl bg-[var(--color11)] text-[var(--color6)] flex items-center justify-center hover:bg-[var(--color6)] hover:text-[var(--color5)] transition-all duration-300"
      >
        <i className={`bx ${isDark ? "bx-moon" : "bx-sun"} text-lg`}></i>
      </button>
      <button
        onClick={onToggleMenu}
        className="w-10 h-10 rounded-xl bg-[var(--color11)] flex items-center justify-center text-[var(--color6)] hover:bg-[var(--color6)] hover:text-[var(--color5)] transition-all duration-300"
        aria-label="Toggle menu"
      >
        {menuOpen ? CLOSE_ICON : MENU_ICON}
      </button>
    </div>
  );
}
