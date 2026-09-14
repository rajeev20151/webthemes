import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function Header({ onMenuClick }) {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("admin-theme") === "dark";
  });
  const [mobileSearch, setMobileSearch] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
      localStorage.setItem("admin-theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("admin-theme", "light");
    }
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate("/batman/login");
  };

  return (
    <header className="admin-header sticky top-0 z-50 w-full backdrop-blur-xl bg-[var(--admin-bg)]/80 border-b border-[var(--admin-border)]">
      <div className="flex items-center justify-between w-full px-4 py-[11px] sm:px-6 xl:py-[11px]">

        {/* Left — Hamburger + Mobile Search Toggle */}
        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-[var(--admin-hover)] text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:border-[var(--admin-border-hover)] transition-all duration-200 active:scale-90"
            aria-label="Toggle Sidebar"
            onClick={onMenuClick}
          >
            <svg width="15" height="11" viewBox="0 0 16 12" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z" fill="currentColor"/>
            </svg>
          </button>

          {/* Mobile Search Icon */}
          <button
            className="flex xl:hidden items-center justify-center w-9 h-9 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-[var(--admin-hover)] text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:border-[var(--admin-border-hover)] transition-all duration-200 active:scale-90"
            onClick={() => setMobileSearch(!mobileSearch)}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        {/* Center — Desktop Search */}
        <div className="hidden xl:block flex-1 max-w-[480px] mx-8">
          <div className="relative group">
            <span className="absolute -translate-y-1/2 pointer-events-none left-3.5 top-1/2 text-[var(--admin-muted)] group-focus-within:text-[var(--admin-accent)] transition-colors duration-200">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" fill="currentColor"/>
              </svg>
            </span>
            <input
              placeholder="Search..."
              className="h-9 w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] py-2 pl-10 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/15 focus:border-[var(--admin-accent)] text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] transition-all duration-200"
              type="text"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[var(--admin-muted)] bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-md px-1.5 py-0.5">⌘K</kbd>
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">

          {/* Dark/Light Toggle */}
          <div className="hidden sm:flex items-center h-9 px-1 gap-0.5 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
            <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-all duration-200 ${!dark ? 'text-amber-500 bg-amber-500/10' : 'text-[var(--admin-muted)]'}`}>☀</span>
            <button
              className="relative w-8 h-[18px] rounded-full bg-[var(--admin-border)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20 shrink-0"
              onClick={() => setDark(!dark)}
              aria-label="Toggle dark mode"
            >
              <span className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all duration-300 ${dark ? 'translate-x-[16px]' : 'translate-x-0'}`} />
            </button>
            <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-all duration-200 ${dark ? 'text-indigo-400 bg-indigo-500/10' : 'text-[var(--admin-muted)]'}`}>🌙</span>
          </div>

          {/* Mobile Dark Toggle */}
          <button
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-[var(--admin-hover)] text-[var(--admin-muted)] hover:text-[var(--admin-accent)] hover:border-[var(--admin-accent)]/20 transition-all duration-200 active:scale-90"
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
          >
            <span className="text-sm">{dark ? '☀' : '🌙'}</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-muted)] transition-all duration-200 hover:bg-[var(--admin-hover)] hover:text-[var(--admin-accent)] hover:border-[var(--admin-border-hover)] active:scale-90">
              <span className="absolute -right-0.5 -top-0.5 z-10 w-2.5 h-2.5 rounded-full bg-orange-500 ring-[2.5px] ring-[var(--admin-surface)]">
                <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping" />
              </span>
              <svg className="fill-current" width="16" height="16" viewBox="0 0 20 20">
                <path d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          {/* Profile Avatar */}
          {/* <div className="relative w-9 h-9 shrink-0 group cursor-pointer">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-[var(--admin-border)] transition-all duration-200 group-hover:border-[var(--admin-accent)] group-hover:shadow-[0_0_0_3px_var(--admin-accent-soft)]">
              <img src="/images/user/owner.png" alt="Admin" className="w-full h-full object-cover" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-[2px] border-[var(--admin-surface)] ring-0" />
          </div> */}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[var(--admin-danger)]/20 bg-[var(--admin-danger-soft)] text-[var(--admin-danger)] fontStyle9 font-semibold hover:bg-[var(--admin-danger)] hover:text-white hover:border-[var(--admin-danger)] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>

          {/* Mobile Logout */}
          <button
            onClick={handleLogout}
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--admin-danger)]/20 bg-[var(--admin-danger-soft)] text-[var(--admin-danger)] hover:bg-[var(--admin-danger)] hover:text-white transition-all duration-200 active:scale-90 cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar — expandable */}
      {mobileSearch && (
        <div className="xl:hidden px-4 pb-3 animate-slide-down">
          <div className="relative">
            <span className="absolute -translate-y-1/2 pointer-events-none left-3 top-1/2 text-[var(--admin-muted)]">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" fill="currentColor"/>
              </svg>
            </span>
            <input
              placeholder="Search..."
              className="h-9 w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/15 focus:border-[var(--admin-accent)] text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] transition-all duration-200"
              type="text"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
