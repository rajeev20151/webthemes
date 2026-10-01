import { Link } from "react-router-dom";

// Desktop right-hand cluster: search trigger, cart, user dropdown, theme toggle.
export default function HeaderActions({ user, cartCount, onOpenSearch, onLogout, isDark, onToggleTheme }) {
  return (
    <div className="login_sign hidden lg:flex gap-4 items-center">
      <button
        onClick={onOpenSearch}
        className="text-[var(--color6)] text-xl cursor-pointer bg-transparent hover:opacity-70 transition duration-300"
        aria-label="Open search"
      >
        <i className="bx bx-search text-xl"></i>
      </button>

      {user ? (
        <div className="flex items-center gap-3">
          {/* Cart circle with count — only when cart has items */}
          {cartCount > 0 && (
            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-full bg-[var(--color6)] text-[var(--color5)] flex items-center justify-center hover:opacity-90 transition duration-300"
            >
              <i className="bx bx-cart text-lg"></i>
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                {cartCount}
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
                    onClick={onLogout}
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

      <div onClick={onToggleTheme} className="cursor-pointer text-2xl text-[var(--color6)]">
        <i className={`bx ${isDark ? "bx-moon" : "bx-sun"}`}></i>
      </div>
    </div>
  );
}
