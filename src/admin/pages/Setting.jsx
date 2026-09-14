import { useState } from "react";

/* ── Icons ── */
const IconUser     = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IconLock     = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconBell     = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IconPalette  = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10c0 2-2 3-4 2l-2-1a2 2 0 0 0-2 2v1a2 2 0 0 1-2 2 10 10 0 0 1 0-20z"/></svg>;
const IconShield   = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconCheck    = () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>;
const IconCamera   = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;

/* ── Tabs config ── */
const TABS = [
  { id: "profile",       label: "Profile",       icon: <IconUser />     },
  { id: "security",      label: "Security",      icon: <IconLock />     },
  { id: "notifications", label: "Notifications", icon: <IconBell />     },
  { id: "appearance",    label: "Appearance",    icon: <IconPalette />  },
  { id: "privacy",       label: "Privacy",       icon: <IconShield />   },
];

/* ── Reusable field components ── */
const inputCls = "w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-xl px-4 py-2.5 fontStyle9 text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-muted)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent-soft)] transition-all duration-200";
const labelCls = "block fontStyle9 font-semibold uppercase tracking-wider text-[var(--admin-muted)] mb-1.5";

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function SectionTitle({ title, desc }) {
  return (
    <div className="pb-4 mb-5 border-b border-[var(--admin-border)]">
      <p className="fontStyle7 font-bold text-[var(--admin-text)] m-0">{title}</p>
      {desc && <p className="fontStyle9 text-[var(--admin-muted)] mt-1 m-0">{desc}</p>}
    </div>
  );
}

/* ── Toggle Switch ── */
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full border transition-all duration-300 cursor-pointer shrink-0 outline-none
        ${checked
          ? "bg-[var(--admin-accent)] border-[var(--admin-accent)]"
          : "bg-[var(--admin-border)] border-[var(--admin-border)]"
        }`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300
        ${checked ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

/* ── Notification Row ── */
function NotifRow({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-[var(--admin-border)] last:border-0">
      <div>
        <p className="fontStyle9 font-semibold text-[var(--admin-text)] m-0">{label}</p>
        <p className="fontStyle9 text-[var(--admin-muted)] mt-0.5 m-0">{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

/* ── Save Button ── */
function SaveBtn({ loading, className = "" }) {
  return (
    <button
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl fontStyle9 font-bold text-white border-none cursor-pointer transition-opacity duration-200 hover:opacity-90 shadow-[0_4px_14px_rgba(99,102,241,0.3)] ${className}`}
      style={{ background: "var(--admin-accent-grad)" }}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      ) : <IconCheck />}
      {loading ? "Saving..." : "Save Changes"}
    </button>
  );
}

/* ════════════════════════════════════
   TAB PANELS
════════════════════════════════════ */

/* Profile */
function ProfilePanel() {
  const [saving, setSaving] = useState(false);
  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 1200); };
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="Profile Information" desc="Update your personal details and public profile." />

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-[var(--admin-accent-soft)] flex items-center justify-center fontStyle7 font-extrabold text-[var(--admin-accent)]">
            A
          </div>
          <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[var(--admin-accent)] text-white flex items-center justify-center border-2 border-[var(--admin-surface)] cursor-pointer hover:opacity-90 transition-opacity">
            <IconCamera />
          </button>
        </div>
        <div>
          <p className="fontStyle9 font-semibold text-[var(--admin-text)] m-0">Profile Photo</p>
          <p className="fontStyle9 text-[var(--admin-muted)] mt-0.5 m-0">JPG, PNG up to 2MB</p>
          <button className="mt-2 fontStyle9 font-semibold text-[var(--admin-accent)] hover:underline cursor-pointer bg-transparent border-none p-0">
            Upload new photo
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name">
          <input className={inputCls} defaultValue="Admin" placeholder="First name" />
        </Field>
        <Field label="Last Name">
          <input className={inputCls} defaultValue="User" placeholder="Last name" />
        </Field>
      </div>
      <Field label="Email Address">
        <input className={inputCls} type="email" defaultValue="admin@demo.com" placeholder="Email" />
      </Field>
      <Field label="Username">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 fontStyle9 text-[var(--admin-muted)]">@</span>
          <input className={`${inputCls} pl-8`} defaultValue="admin" placeholder="username" />
        </div>
      </Field>
      <Field label="Bio">
        <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Write a short bio..." />
      </Field>

      <div className="flex sm:justify-end pt-2">
        <SaveBtn loading={saving} onClick={save} className="w-full sm:w-auto" />
      </div>
    </div>
  );
}

/* Security */
function SecurityPanel() {
  const [show, setShow] = useState({ cur: false, new: false, con: false });
  const [saving, setSaving] = useState(false);
  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 1200); };
  const EyeBtn = ({ k }) => (
    <button onClick={() => setShow(s => ({ ...s, [k]: !s[k] }))}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] hover:text-[var(--admin-text)] transition-colors bg-transparent border-none cursor-pointer p-0">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {show[k]
          ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M1 1l22 22"/></>
          : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
        }
      </svg>
    </button>
  );
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="Change Password" desc="Choose a strong password to keep your account secure." />
      <Field label="Current Password">
        <div className="relative">
          <input className={`${inputCls} pr-11`} type={show.cur ? "text" : "password"} placeholder="••••••••" />
          <EyeBtn k="cur" />
        </div>
      </Field>
      <Field label="New Password">
        <div className="relative">
          <input className={`${inputCls} pr-11`} type={show.new ? "text" : "password"} placeholder="••••••••" />
          <EyeBtn k="new" />
        </div>
      </Field>
      <Field label="Confirm New Password">
        <div className="relative">
          <input className={`${inputCls} pr-11`} type={show.con ? "text" : "password"} placeholder="••••••••" />
          <EyeBtn k="con" />
        </div>
      </Field>

      {/* 2FA */}
      <div className="admin-card p-5 flex items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--admin-success-soft)] flex items-center justify-center text-[var(--admin-success)] shrink-0">
            <IconShield />
          </div>
          <div>
            <p className="fontStyle9 font-semibold text-[var(--admin-text)] m-0">Two-Factor Authentication</p>
            <p className="fontStyle9 text-[var(--admin-muted)] mt-0.5 m-0">Add an extra layer of security</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full fontStyle9 font-bold admin-badge-warning">Off</span>
      </div>

      <div className="flex sm:justify-end pt-2">
        <SaveBtn loading={saving} onClick={save} className="w-full sm:w-auto" />
      </div>
    </div>
  );
}

/* Notifications */
function NotificationsPanel() {
  const [notifs, setNotifs] = useState({
    email_orders:   true,
    email_updates:  false,
    email_security: true,
    push_orders:    true,
    push_messages:  false,
    push_reports:   true,
  });
  const toggle = (k) => setNotifs(n => ({ ...n, [k]: !n[k] }));
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="Notification Preferences" desc="Choose what you want to be notified about." />

      <div className="admin-card px-5">
        <p className="fontStyle9 font-bold uppercase tracking-wider text-[var(--admin-muted)] pt-4 pb-2 m-0">Email Notifications</p>
        <NotifRow label="New Orders"        desc="Get notified when a new order is placed"      checked={notifs.email_orders}   onChange={() => toggle("email_orders")}   />
        <NotifRow label="Product Updates"   desc="Receive emails about product changes"         checked={notifs.email_updates}  onChange={() => toggle("email_updates")}  />
        <NotifRow label="Security Alerts"   desc="Important security notifications"             checked={notifs.email_security} onChange={() => toggle("email_security")} />
      </div>

      <div className="admin-card px-5">
        <p className="fontStyle9 font-bold uppercase tracking-wider text-[var(--admin-muted)] pt-4 pb-2 m-0">Push Notifications</p>
        <NotifRow label="Order Updates"     desc="Real-time order status changes"               checked={notifs.push_orders}    onChange={() => toggle("push_orders")}    />
        <NotifRow label="New Messages"      desc="When someone sends you a message"             checked={notifs.push_messages}  onChange={() => toggle("push_messages")}  />
        <NotifRow label="Weekly Reports"    desc="Summary of your weekly performance"           checked={notifs.push_reports}   onChange={() => toggle("push_reports")}   />
      </div>
    </div>
  );
}

/* Appearance */
function AppearancePanel() {
  const [theme,  setTheme]  = useState("light");
  const [accent, setAccent] = useState("#6366f1");
  const [font,   setFont]   = useState("Google Sans");

  const accents = ["#6366f1","#0ea5e9","#34d399","#f87171","#fbbf24","#a78bfa"];
  const themes  = [
    { id: "light", label: "Light",  bg: "bg-white",       border: "border-slate-200" },
    { id: "dark",  label: "Dark",   bg: "bg-slate-800",   border: "border-slate-700" },
    { id: "auto",  label: "System", bg: "bg-slate-100",   border: "border-slate-200" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="Appearance" desc="Customize how the admin panel looks for you." />

      {/* Theme */}
      <div>
        <p className={labelCls}>Theme</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themes.map((t) => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className={`admin-card p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 border-2
                ${theme === t.id ? "border-[var(--admin-accent)]" : "border-transparent"}`}>
              <div className={`w-full h-10 rounded-lg ${t.bg} border ${t.border}`} />
              <p className="fontStyle9 font-semibold text-[var(--admin-text)] m-0">{t.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div>
        <p className={labelCls}>Accent Color</p>
        <div className="flex items-center gap-3 flex-wrap">
          {accents.map((c) => (
            <button key={c} onClick={() => setAccent(c)}
              className={`w-9 h-9 rounded-xl cursor-pointer border-2 transition-all duration-200 flex items-center justify-center
                ${accent === c ? "border-[var(--admin-text)] scale-110" : "border-transparent"}`}
              style={{ background: c }}>
              {accent === c && <IconCheck />}
            </button>
          ))}
        </div>
      </div>

      {/* Font */}
      <Field label="Font Family">
        <select className="admin-select" value={font} onChange={(e) => setFont(e.target.value)}>
          {["Google Sans","System UI","Roboto","Poppins","DM Sans"].map(f => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </Field>

      <div className="flex sm:justify-end pt-2">
        <SaveBtn className="w-full sm:w-auto" />
      </div>
    </div>
  );
}

/* Privacy */
function PrivacyPanel() {
  const [privacy, setPrivacy] = useState({
    profile_public:  true,
    show_email:      false,
    analytics:       true,
    data_collection: false,
  });
  const toggle = (k) => setPrivacy(p => ({ ...p, [k]: !p[k] }));
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="Privacy Settings" desc="Control your data and how others see you." />
      <div className="admin-card px-5">
        <NotifRow label="Public Profile"     desc="Allow others to view your profile"           checked={privacy.profile_public}  onChange={() => toggle("profile_public")}  />
        <NotifRow label="Show Email Address" desc="Display your email on your public profile"   checked={privacy.show_email}      onChange={() => toggle("show_email")}      />
        <NotifRow label="Usage Analytics"    desc="Help improve the product with usage data"    checked={privacy.analytics}       onChange={() => toggle("analytics")}       />
        <NotifRow label="Data Collection"    desc="Allow third-party data collection"           checked={privacy.data_collection} onChange={() => toggle("data_collection")} />
      </div>

      {/* Danger Zone */}
      <div className="admin-card p-5 border border-[var(--admin-danger)] rounded-2xl">
        <p className="fontStyle9 font-bold text-[var(--admin-danger)] m-0 mb-1">Danger Zone</p>
        <p className="fontStyle9 text-[var(--admin-muted)] m-0 mb-4">These actions are irreversible. Please proceed with caution.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 py-2.5 rounded-xl fontStyle9 font-semibold border border-[var(--admin-border)] text-[var(--admin-subtext)] bg-transparent hover:bg-[var(--admin-hover)] transition-colors cursor-pointer">
            Export My Data
          </button>
          <button className="flex-1 py-2.5 rounded-xl fontStyle9 font-bold border-none admin-badge-danger cursor-pointer hover:opacity-80 transition-opacity">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   MAIN
════════════════════════════════════ */
const PANELS = { profile: <ProfilePanel />, security: <SecurityPanel />, notifications: <NotificationsPanel />, appearance: <AppearancePanel />, privacy: <PrivacyPanel /> };

export default function Setting() {
  const [active, setActive] = useState("profile");

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center">
        <div>
          <h1 className="fontStyle7 font-bold text-[var(--admin-text)] m-0">Settings</h1>
          <p className="fontStyle9 text-[var(--admin-muted)] mt-1 m-0">Manage your account preferences</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* ── Sidebar Tabs ── */}
        <div className="admin-card p-2 flex lg:flex-col gap-1 w-full lg:w-52 shrink-0 flex-row overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl fontStyle9 font-semibold transition-all duration-200 cursor-pointer border-none text-left whitespace-nowrap lg:w-full
                ${active === tab.id
                  ? "bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]"
                  : "bg-transparent text-[var(--admin-subtext)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]"
                }`}
            >
              <span className={active === tab.id ? "text-[var(--admin-accent)]" : "text-[var(--admin-muted)]"}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Panel ── */}
        <div className="admin-card p-6 flex-1 w-full min-w-0">
          {PANELS[active]}
        </div>

      </div>
    </div>
  );
}