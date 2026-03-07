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
      { label: "Home", to: "/admin"},
      { label: "Templates", to: "/admin/add-template"},
      { label: "Manage Templates", to: "/admin/manage-templates"},
      { label: "Manage Pricing", to: "/admin/manage-pricing"},
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
      { label: "Overview", to: "/analytics" },
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
      { label: "All Users", to: "/admin/users" },   
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
    to: "/settings",
  },
];

/* ─────────────────────────────────────────────────────────
   All colours come from admin.css CSS variables.
   When .dark is toggled on <html>, variables auto-update
   and every inline style here reacts instantly.
───────────────────────────────────────────────────────── */
function MenuItem({ item }) {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = hasChildren
    ? item.children.some((c) => c.to === location.pathname)
    : item.to === location.pathname;

  const [open, setOpen] = useState(isActive);

  const rowStyle = {
    background: isActive ? "var(--admin-accent-soft)" : "transparent",
    color: isActive ? "var(--admin-accent)" : "var(--admin-subtext)",
    transition: "background 0.2s ease, color 0.2s ease",
  };

  const hoverOn = (e) => {
    if (!isActive) {
      e.currentTarget.style.background = "var(--admin-hover)";
      e.currentTarget.style.color = "var(--admin-text)";
    }
  };
  const hoverOff = (e) => {
    if (!isActive) {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = "var(--admin-subtext)";
    }
  };

  const iconStyle = {
    color: isActive ? "var(--admin-accent)" : "var(--admin-muted)",
    transition: "color 0.2s ease",
  };

  const chevronStyle = {
    color: open ? "var(--admin-accent)" : "var(--admin-muted)",
    transform: open ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.2s ease, color 0.2s ease",
  };

  if (!hasChildren) {
    return (
      <li>
        <Link
          to={item.to}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl fontStyle9 w-full"
          style={rowStyle}
          onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}
        >
          <span style={iconStyle}>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl fontStyle9"
        style={rowStyle}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
      >
        <span className="flex items-center gap-3">
          <span style={iconStyle}>{item.icon}</span>
          {item.label}
        </span>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={chevronStyle}>
          <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── Dropdown children ── */}
      <div
        style={{
          maxHeight: open ? "200px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <ul
          className="mt-1 ml-9 pl-3 space-y-0.5"
          style={{ borderLeft: "1px solid var(--admin-border)" }}
        >
          {item.children.map((child) => {
            const childActive = location.pathname === child.to;
            return (
              <li key={child.to}>
                <Link
                  to={child.to}
                  className="block py-2 fontStyle10"
                  style={{
                    color: childActive ? "var(--admin-accent)" : "var(--admin-muted)",
                    fontWeight: childActive ? "600" : "400",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => { if (!childActive) e.currentTarget.style.color = "var(--admin-text)"; }}
                  onMouseLeave={(e) => { if (!childActive) e.currentTarget.style.color = "var(--admin-muted)"; }}
                >
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

export default function Sidebar() {
  return (
    <div
      className="fixed flex flex-col top-0 left-0 h-screen z-50 w-[290px] -translate-x-full xl:translate-x-0 transition-transform duration-300 ease-in-out"
      style={{
        background: "var(--admin-surface)",
        borderRight: "1px solid var(--admin-border)",
        color: "var(--admin-text)",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* ===== Logo ===== */}
      <div className="py-8 px-5 flex justify-start flex-shrink-0">
        <a href="/">
          <img alt="Logo" width="150" height="40" src="/images/logo/logo.svg" />
        </a>
      </div>

      {/* ===== Section Label ===== */}
      <div className="px-5 mb-2">
        <p
          className="fontStyle10 uppercase tracking-widest font-semibold"
          style={{ color: "var(--admin-muted)" }}
        >
          Main Menu
        </p>
      </div>

      {/* ===== Menu ===== */}
      <div className="flex flex-col overflow-y-auto flex-1 px-5 pb-6 no-scrollbar">
        <nav>
          <ul className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <MenuItem key={item.label} item={item} />
            ))}
          </ul>
        </nav>
      </div>

      {/* ===== Bottom User Card ===== */}
      <div
        className="px-5 py-4 flex-shrink-0"
        style={{ borderTop: "1px solid var(--admin-border)" }}
      >
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
          style={{ transition: "background 0.2s ease" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--admin-hover)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <span
            className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
            style={{ outline: "2px solid var(--admin-border)", outlineOffset: "1px" }}
          >
            <img src="/images/user/owner.png" alt="User" className="w-full h-full object-cover" />
          </span>
          <div className="flex-1 min-w-0">
            <p
              className="fontStyle9 font-semibold truncate"
              style={{ color: "var(--admin-text)" }}
            >
              Musharof
            </p>
            <p className="fontStyle10 truncate" style={{ color: "var(--admin-muted)" }}>
              Admin
            </p>
          </div>
          <svg
            width="16" height="16" viewBox="0 0 20 20" fill="none"
            style={{ color: "var(--admin-muted)", flexShrink: 0 }}
          >
            <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}