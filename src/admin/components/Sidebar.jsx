import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const menuItems = [
  {
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.3"/>
        <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor"/>
        <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor"/>
        <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" opacity="0.3"/>
      </svg>
    ),
    children: [
      { label: "Home", to: "/admin" },
      { label: "Manage Templates", to: "/admin/manage-templates" },
      { label: "Manage Pricing", to: "/admin/manage-pricing" },
      { label: "Manage Content", to: "/admin/manage-content" },
    ],
  },
  {
    label: "Analytics",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 17L8 12L12 16L16 10L21 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 17V20H21V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
      </svg>
    ),
    children: [
      { label: "Overview", to: "/analytics"},
      { label: "Reports", to: "/reports" },
    ],
  },
  {
    label: "Users",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="4" fill="currentColor" opacity="0.3"/>
        <path d="M3 21C3 17.134 5.686 14 9 14C12.314 14 15 17.134 15 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="17" cy="8" r="3" fill="currentColor" opacity="0.6"/>
        <path d="M21 21C21 18.239 19.209 16 17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    children: [
      { label: "All Users", to: "/admin/users"},
      { label: "Manage Chats", to: "/admin/manage-chats", icon: "bx-chat" },
      { label: "Manage Reviews", to: "/admin/manage-reviews", icon: "bx-star" },
      { label: "Manage Contact", to: "/admin/manage-contact", icon: "bx-mail-send"}
    ],
  },
  {
    label: "Settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
        <path d="M12 2V4M12 20V22M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M2 12H4M20 12H22M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    to: "/admin/setting",
  },
];

function MenuItem({ item, onClose }) {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = hasChildren
    ? item.children.some((c) => c.to === location.pathname)
    : item.to === location.pathname;

  const [open, setOpen] = useState(isActive);

  const rowBase = "group flex items-center gap-3 px-3 py-2.5 rounded-lg fontStyle9 w-full transition-all duration-200 relative";
  const rowActive = "bg-[var(--admin-accent-soft)] text-[var(--admin-accent)] font-medium";
  const rowIdle = "bg-transparent text-[var(--admin-subtext)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]";

  const iconClass = isActive
    ? "text-[var(--admin-accent)] transition-colors duration-200"
    : "text-[var(--admin-muted)] group-hover:text-[var(--admin-text)] transition-colors duration-200";

  const chevronClass = `transition-transform duration-300 ease-out text-[var(--admin-muted)] ${open ? "rotate-180 text-[var(--admin-accent)]" : "rotate-0"}`;

  if (!hasChildren) {
    return (
      <li>
        <Link
          to={item.to}
          onClick={onClose}
          className={`${rowBase} ${isActive ? rowActive : rowIdle}`}
        >
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[var(--admin-accent)] rounded-r-full" />
          )}
          <span className={iconClass}>{item.icon}</span>
          <span className="truncate">{item.label}</span>
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        className={`${rowBase} justify-between ${isActive ? rowActive : rowIdle}`}
      >
        <span className="flex items-center gap-3">
          <span className={iconClass}>{item.icon}</span>
          <span className="truncate">{item.label}</span>
        </span>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className={chevronClass}>
          <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-[300px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
        <ul className="ml-9 pl-3 space-y-0.5 border-l-2 border-[var(--admin-border)]">
          {item.children.map((child) => {
            const childActive = location.pathname === child.to;
            return (
              <li key={child.to}>
                <Link
                  to={child.to}
                  onClick={onClose}
                  className={`group/child flex items-center gap-2.5 py-2 pl-3 pr-2 rounded-md fontStyle10 transition-all duration-150 ${
                    childActive
                      ? "text-[var(--admin-accent)] font-semibold bg-[var(--admin-accent-soft)]/50"
                      : "text-[var(--admin-muted)] font-normal hover:text-[var(--admin-text)] hover:bg-[var(--admin-hover)]/50"
                  }`}
                >
                  {childActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--admin-accent)] flex-shrink-0" />
                  )}
                  {!childActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--admin-border)] group-hover/child:bg-[var(--admin-muted)] flex-shrink-0 transition-colors duration-150" />
                  )}
                  <span className="truncate">{child.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <div className={`fixed flex flex-col top-0 left-0 h-screen z-50 w-[280px] transition-transform duration-300 ease-in-out bg-[var(--admin-surface)] border-r border-[var(--admin-border)] text-[var(--admin-text)] shadow-sm ${isOpen ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0 xl:shadow-none`}>

      {/* Logo */}
      <div className="h-16 px-6 flex items-center flex-shrink-0 border-b border-[var(--admin-border)]/50">
        <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img alt="Logo" width="140" height="36" src="/images/logo/logo.svg" className="h-8 w-auto" />
        </a>
      </div>

      {/* Section Label */}
      <div className="px-6 pt-6 pb-2">
        <p className="fontStyle10 uppercase tracking-[0.15em] font-semibold text-[var(--admin-muted)]/70 text-[11px]">
          Main Menu
        </p>
      </div>

      {/* Menu */}
      <div className="flex flex-col overflow-y-auto flex-1 px-4 pb-6 no-scrollbar">
        <nav>
          <ul className="flex flex-col gap-0.5">
            {menuItems.map((item) => (
              <MenuItem key={item.label} item={item} onClose={onClose} />
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom User Card */}
      <div className="px-4 py-3 flex-shrink-0 border-t border-[var(--admin-border)]/50 bg-[var(--admin-surface)]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:bg-[var(--admin-hover)] group">
          <span className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[var(--admin-border)] ring-offset-2 ring-offset-[var(--admin-surface)] transition-all duration-200 group-hover:ring-[var(--admin-accent)]/30">
            <img src="/images/user/owner.png" alt="User" className="w-full h-full object-cover" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="fontStyle9 font-semibold truncate text-[var(--admin-text)] leading-tight">
              Musharof
            </p>
            <p className="fontStyle10 truncate text-[var(--admin-muted)] text-[11px] mt-0.5">
              Admin
            </p>
          </div>
          <svg
            width="14" height="14" viewBox="0 0 20 20" fill="none"
            className="text-[var(--admin-muted)] flex-shrink-0 transition-transform duration-200 group-hover:translate-y-0.5"
          >
            <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}