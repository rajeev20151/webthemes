import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  adminGetNotificationsAPI,
  adminMarkAllNotificationsReadAPI,
  adminMarkNotificationReadAPI,
} from "../services/adminApi";

const notificationTime = (date) => {
  const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return new Date(date).toLocaleDateString();
};

const IconSun = () => (
  <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
  </svg>
);

const IconMoon = () => (
  <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
  </svg>
);

export default function Header({ onMenuClick }) {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("admin-theme") === "dark";
  });
  const [mobileSearch, setMobileSearch] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsError, setNotificationsError] = useState("");

  const loadNotifications = useCallback(async () => {
    try {
      const res = await adminGetNotificationsAPI();
      if (!res.success) throw new Error(res.message || "Failed to load notifications");
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
      setNotificationsError("");
    } catch (err) {
      console.error("Failed to load admin notifications", err);
      setNotificationsError(err.message || "Failed to load notifications");
    }
  }, []);

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

  useEffect(() => {
    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, 30000);
    return () => window.clearInterval(intervalId);
  }, [loadNotifications]);

  const handleLogout = () => {
    logout();
    navigate("/batman/login");
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.readAt) {
      try {
        const res = await adminMarkNotificationReadAPI(notification._id);
        if (!res.success) throw new Error(res.message || "Failed to mark notification as read");
        setNotifications((current) => current.map((item) =>
          item._id === notification._id ? res.notification : item
        ));
        setUnreadCount((count) => Math.max(0, count - 1));
      } catch (err) {
        console.error("Failed to mark notification as read", err);
        setNotificationsError(err.message || "Failed to mark notification as read");
        return;
      }
    }
    setNotificationsOpen(false);
    navigate(notification.link);
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await adminMarkAllNotificationsReadAPI();
      if (!res.success) throw new Error(res.message || "Failed to mark notifications as read");
      const readAt = new Date().toISOString();
      setNotifications((current) => current.map((item) => ({ ...item, readAt: item.readAt || readAt })));
      setUnreadCount(0);
      setNotificationsError("");
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
      setNotificationsError(err.message || "Failed to mark notifications as read");
    }
  };

  return (
    <header className="admin-header sticky top-0 z-50 w-full border-b border-[var(--admin-border)] bg-[var(--admin-surface)]/90 shadow-sm backdrop-blur-xl transition-colors duration-300">
      <div className="flex min-h-[64px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6">

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
          <div className="hidden sm:flex items-center">
            <div className="flex items-center gap-1 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-1" role="group" aria-label="Color theme">
              <button
                type="button"
                onClick={() => setDark(false)}
                aria-label="Use light mode"
                aria-pressed={!dark}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/30 ${
                  !dark
                    ? "bg-[var(--admin-surface)] text-amber-500 shadow-sm"
                    : "bg-transparent text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
                }`}
              >
                <IconSun />
              </button>
              <button
                type="button"
                onClick={() => setDark(true)}
                aria-label="Use dark mode"
                aria-pressed={dark}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/30 ${
                  dark
                    ? "bg-[var(--admin-surface)] text-indigo-400 shadow-sm"
                    : "bg-transparent text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
                }`}
              >
                <IconMoon />
              </button>
            </div>
          </div>

          {/* Mobile Dark Toggle */}
          <button
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-[var(--admin-hover)] text-[var(--admin-muted)] hover:text-[var(--admin-accent)] hover:border-[var(--admin-accent)]/20 transition-all duration-200 active:scale-90"
            onClick={() => setDark(!dark)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <IconSun /> : <IconMoon />}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
              aria-expanded={notificationsOpen}
              onClick={() => {
                setNotificationsOpen((open) => !open);
                loadNotifications();
              }}
              className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-muted)] transition-all duration-200 hover:bg-[var(--admin-hover)] hover:text-[var(--admin-accent)] hover:border-[var(--admin-border-hover)] active:scale-90"
            >
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 z-10 flex min-w-4 h-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white ring-2 ring-[var(--admin-surface)]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
              <svg className="fill-current" width="16" height="16" viewBox="0 0 20 20">
                <path d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z" fill="currentColor"/>
              </svg>
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-[100] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-xl">
                <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-4 py-3">
                  <div>
                    <p className="m-0 fontStyle9 font-bold text-[var(--admin-text)]">Notifications</p>
                    <p className="m-0 mt-0.5 fontStyle9 text-[var(--admin-muted)]">{unreadCount} unread</p>
                  </div>
                  <button
                    type="button"
                    disabled={!unreadCount}
                    onClick={handleMarkAllRead}
                    className="border-0 bg-transparent p-1 fontStyle9 font-semibold text-[var(--admin-accent)] disabled:cursor-default disabled:opacity-50"
                  >
                    Mark all read
                  </button>
                </div>
                {notificationsError && (
                  <p role="alert" className="m-0 px-4 py-3 fontStyle9 text-[var(--admin-danger)]">{notificationsError}</p>
                )}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 && !notificationsError ? (
                    <p className="m-0 px-4 py-8 text-center fontStyle9 text-[var(--admin-muted)]">No notifications yet.</p>
                  ) : notifications.map((notification) => (
                    <button
                      type="button"
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`flex w-full gap-3 border-0 border-b border-[var(--admin-border)] px-4 py-3 text-left transition-colors hover:bg-[var(--admin-hover)] ${
                        notification.readAt ? "bg-transparent" : "bg-[var(--admin-accent-soft)]/40"
                      }`}
                    >
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        notification.readAt ? "bg-transparent" : "bg-[var(--admin-accent)]"
                      }`} />
                      <span className="min-w-0 flex-1">
                        <span className="block fontStyle9 font-semibold text-[var(--admin-text)]">{notification.title}</span>
                        <span className="mt-0.5 block truncate fontStyle9 text-[var(--admin-muted)]">{notification.message}</span>
                        <span className="mt-1 block fontStyle9 text-[var(--admin-muted)]">{notificationTime(notification.createdAt)}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
