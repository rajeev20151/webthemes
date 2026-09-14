import { useState, useEffect, useRef } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { getUsersAPI,updateUserAPI, deleteUserAPI} from "../../services/adminApi";

const emptyForm = { name: "", email: "", role: "Viewer", status: "Active" };

const ROLES    = ["Admin", "Editor", "Viewer"];
const STATUSES = ["Active", "Inactive", "Banned"];

const AVATAR_COLORS = [
  "bg-indigo-500", "bg-sky-500", "bg-emerald-500",
  "bg-violet-500", "bg-rose-500", "bg-amber-500",
];
const avatarColor = (index) => AVATAR_COLORS[index % AVATAR_COLORS.length];

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const getStatus = (user) => {
  if (user.status) return user.status;
  if (user.isBanned) return "Banned";
  if (user.isVerified) return "Active";
  return "Inactive";
};

/* ── Status badge ── */
function StatusBadge({ status }) {
  const map = {
    Active:   "admin-badge-success",
    Inactive: "admin-badge-warning",
    Banned:   "admin-badge-danger",
  };
  return (
    <span className={`${map[status] || ""} px-2.5 py-1 rounded-full fontStyle9 font-semibold whitespace-nowrap`}>
      {status}
    </span>
  );
}

/* ── Role badge ── */
function RoleBadge({ role }) {
  const display = role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : role;
  const map = {
    Admin:  "bg-indigo-500/10 text-indigo-500",
    Editor: "bg-sky-500/10 text-sky-500",
    Viewer: "bg-slate-500/10 text-slate-500 dark:bg-slate-400/10 dark:text-slate-400",
  };
  return (
    <span className={`${map[display] || "bg-slate-500/10 text-slate-500"} px-2.5 py-1 rounded-full fontStyle9 font-semibold whitespace-nowrap`}>
      {display}
    </span>
  );
}

/* ── Icons ── */
const IconPlus   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconEdit   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconDelete = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconClose  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconUsers  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" fill="currentColor" opacity="0.3"/><path d="M3 21C3 17.134 5.686 14 9 14c3.314 0 6 3.134 6 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="17" cy="8" r="3" fill="currentColor" opacity="0.6"/><path d="M21 21c0-2.761-1.791-5-4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;

/* ── Shared input class ── */
const inp = [
  "w-full px-3 py-2.5 rounded-xl outline-none transition-colors fontStyle9 box-border",
  "bg-(--admin-bg) border border-(--admin-border)",
  "text-(--admin-text) placeholder:text-(--admin-muted)",
  "focus:border-(--admin-accent)",
].join(" ");

const lbl = "block fontStyle9 font-semibold uppercase tracking-wider text-(--admin-muted) mb-1.5";

/* ════════════════════════════════════════
   USER MODAL  (Add / Edit)
════════════════════════════════════════ */
function UserModal({ mode, data, onClose, onSave }) {
  const [form, setForm] = useState({ ...data });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-(--admin-surface) border border-(--admin-border) relative z-[9999]">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-(--admin-border)">
          <p className="fontStyle7 font-bold m-0 text-(--admin-text)">
            {mode === "add" ? "Add New User" : "Edit User"}
          </p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border-0 bg-(--admin-hover) text-(--admin-muted) hover:opacity-70 transition-opacity"
          >
            <IconClose />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 py-5 flex flex-col gap-4">
          <div>
            <label className={lbl}>Full Name</label>
            <input
              className={inp}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Musharof Chy"
            />
          </div>
          <div>
            <label className={lbl}>Email Address</label>
            <input
              className={inp}
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="e.g. user@example.com"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Role</label>
              <select className="admin-select" value={form.role} onChange={(e) => set("role", e.target.value)}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Status</label>
              <select className="admin-select" value={form.status} onChange={(e) => set("status", e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t border-(--admin-border)">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl fontStyle9 font-semibold cursor-pointer border border-(--admin-border) bg-transparent text-(--admin-subtext) hover:bg-(--admin-hover) transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl fontStyle9 font-bold text-white border-0 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: "var(--admin-accent-grad)", boxShadow: "0 4px 14px rgba(99,102,241,0.25)" }}
          >
            {mode === "add" ? "Add User" : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   DELETE CONFIRM
════════════════════════════════════════ */
function DeleteConfirm({ name, onClose, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl p-6 sm:p-8 text-center shadow-2xl bg-(--admin-surface) border border-(--admin-border) relative z-[9999]">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-(--admin-danger-soft)">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
              stroke="var(--admin-danger)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="fontStyle7 font-bold m-0 mb-2 text-(--admin-text)">Delete User?</p>
        <p className="fontStyle9 m-0 mb-6 text-(--admin-muted) break-words">
          "<strong className="text-(--admin-subtext)">{name}</strong>" will be permanently deleted.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl fontStyle9 font-semibold cursor-pointer border border-(--admin-border) bg-transparent text-(--admin-subtext) hover:bg-(--admin-hover) transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-xl fontStyle9 font-bold text-white border-0 cursor-pointer bg-(--admin-danger) hover:opacity-85 transition-opacity"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function ManageUsers() {
  const [users, setUsers]               = useState([]);
  const [search, setSearch]             = useState("");
  const [filterRole, setFilterRole]     = useState("All");
  const [filterCountry, setFilterCountry] = useState("");
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(null);
  const panStart = useRef(null);
  const mapContainerRef = useRef(null);
  const [modal, setModal]               = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;
    const handler = (e) => {
      e.preventDefault();
      setMapZoom((z) => {
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        return Math.min(Math.max(z + delta, 0.5), 3);
      });
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  /* ── Drag / Pan handlers ── */
  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...mapPan };
    e.currentTarget.style.cursor = "grabbing";
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setMapPan({
      x: panStart.current.x + dx,
      y: panStart.current.y + dy,
    });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    dragStart.current = null;
    panStart.current = null;
    if (e.currentTarget) e.currentTarget.style.cursor = "grab";
  };

  const resetMapView = () => {
    setMapZoom(1);
    setMapPan({ x: 0, y: 0 });
  };

  const loadUsers = async () => {
    try {
      const res = await getUsersAPI();
      if (!res.success) {
        alert(res.message || "Failed to load users");
        return;
      }
      // Normalize DB fields to UI fields
      const normalized = (res.users || []).map((u) => ({
        ...u,
        id:     u._id || u.id,
        role:   u.role
                  ? u.role.charAt(0).toUpperCase() + u.role.slice(1).toLowerCase()
                  : "Viewer",
        status: u.status
                  ? u.status
                  : u.isBanned
                  ? "Banned"
                  : u.isVerified
                  ? "Active"
                  : "Inactive",
        avatar: getInitials(u.name),
        joined: u.createdAt
                  ? new Date(u.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric",
                    })
                  : "—",
        location: [u.city, u.state, u.country].filter(Boolean).join(", ") || "—",
        ip: u.ip || "—",
        lastLogin: u.lastLogin
                  ? new Date(u.lastLogin).toLocaleString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })
                  : "Never",
      }));
      setUsers(normalized);
    } catch (err) {
      alert("Failed to load users: " + (err.message || "Something went wrong"));
    }
  };

  /* ── Filter ── */
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole   = filterRole === "All" || u.role === filterRole;
    const matchCountry = !filterCountry || u.country === filterCountry;
    return matchSearch && matchRole && matchCountry;
  });

  /* ── Stats ── */
  const total    = users.length;
  const active   = users.filter((u) => u.status === "Active").length;
  const inactive = users.filter((u) => u.status === "Inactive").length;
  const banned   = users.filter((u) => u.status === "Banned").length;

/* ── Save ── */
  const handleSave = async (form) => {
    if (!modal) return;
    if (modal.mode === "add") {
      setUsers((prev) => [
        ...prev,
        {
          ...form,
          id:     `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          avatar: getInitials(form.name),
          joined: new Date().toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          }),
          location: "—",
          ip: "—",
          lastLogin: "Never",
        },
      ]);
      setModal(null);
    } else {
      try {
        if (!form.id) {
          alert("Invalid user ID");
          return;
        }
        const res = await updateUserAPI(form.id, {
          name:   form.name,
          email:  form.email,
          role:   form.role.toLowerCase(),
          status: form.status,
        });
        if (!res.success) {
          alert(res.message || "Update failed");
          return;
        }
        setUsers((prev) =>
          prev.map((u) =>
            u.id === form.id ? { ...u, ...form, avatar: getInitials(form.name) } : u
          )
        );
        setModal(null);
      } catch (err) {
        alert("Update failed: " + (err.message || "Something went wrong"));
      }
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    try {
      const res = await deleteUserAPI(deleteTarget.id);
      if (!res.success) {
        alert(res.message || "Delete failed");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert("Delete failed: " + (err.message || "Something went wrong"));
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-full overflow-x-hidden">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="fontStyle7 font-bold m-0 text-(--admin-text)">Manage Users</h1>
          <p className="fontStyle9 mt-1 m-0 text-(--admin-muted)">{total} users registered</p>
        </div>
        <button
          onClick={() => setModal({ mode: "add", data: { ...emptyForm } })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl fontStyle9 font-bold text-white border-0 cursor-pointer whitespace-nowrap hover:opacity-90 transition-opacity"
          style={{ background: "var(--admin-accent-grad)", boxShadow: "0 4px 14px rgba(99,102,241,0.25)" }}
        >
          <IconPlus /> Add User
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: "Total Users", value: total,    cls: "text-(--admin-accent)"  },
          { label: "Active",      value: active,   cls: "text-(--admin-success)" },
          { label: "Inactive",    value: inactive, cls: "text-(--admin-warning)" },
          { label: "Banned",      value: banned,   cls: "text-(--admin-danger)"  },
        ].map((s) => (
          <div key={s.label} className="admin-card p-4 flex items-center gap-3 sm:gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-(--admin-accent-soft)">
              <IconUsers />
            </div>
            <div className="min-w-0">
              <p className={`fontStyle7 font-extrabold m-0 ${s.cls}`}>{s.value}</p>
              <p className="fontStyle9 m-0 text-(--admin-muted) truncate">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── World Map ── */}
      {(() => {
        const countryMap = {};
        users.forEach((u) => {
          const c = u.country || "Unknown";
          if (!countryMap[c]) countryMap[c] = { country: c, count: 0, users: [] };
          countryMap[c].count++;
          countryMap[c].users.push(u);
        });
        const countries = Object.values(countryMap).sort((a, b) => b.count - a.count);
        const totalCountries = countries.length;
        const maxCount = countries.length ? countries[0].count : 1;

        const countryCoords = {
          India: [78, 20], Pakistan: [69, 30], Bangladesh: [90, 24], Nepal: [84, 28],
          "Sri Lanka": [81, 7], China: [105, 35], Japan: [138, 36], "South Korea": [128, 37],
          Thailand: [101, 15], Vietnam: [106, 16], Indonesia: [117, -2], Malaysia: [102, 2],
          Philippines: [122, 12], Singapore: [104, 1], Myanmar: [96, 20],
          USA: [-97, 38], Canada: [-100, 55], Mexico: [-102, 23], Brazil: [-48, -12],
          Argentina: [-64, -34], Colombia: [-74, 4], Chile: [-71, -35], Peru: [-76, -10],
          "United Kingdom": [-2, 54], Germany: [10, 51], France: [2, 46], Italy: [12, 42],
          Spain: [-4, 40], Netherlands: [5, 52], Poland: [20, 52], Sweden: [16, 62],
          Norway: [10, 64], Finland: [26, 64], Denmark: [10, 56], Belgium: [4, 51],
          Switzerland: [8, 47], Austria: [14, 48], Portugal: [-8, 39], Greece: [22, 39],
          Turkey: [35, 39], Russia: [90, 60], Ukraine: [32, 49],
          Australia: [134, -25], "New Zealand": [174, -41],
          "South Africa": [25, -30], Nigeria: [8, 10], Kenya: [38, 0], Egypt: [30, 27],
          Morocco: [-5, 32], Ghana: [-1, 8], Ethiopia: [39, 9], Tanzania: [35, -6],
          UAE: [54, 24], "Saudi Arabia": [45, 24], Israel: [35, 31], Qatar: [51, 25],
          Kuwait: [48, 29], Oman: [57, 21], Iraq: [44, 33], Iran: [53, 32],
          Afghanistan: [67, 34],
        };

        const getRadius = (count) => {
          const ratio = count / maxCount;
          return 4 + ratio * 14;
        };

        return (
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div>
                <h2 className="fontStyle7 font-bold m-0 text-(--admin-text)">World Users</h2>
                <p className="fontStyle9 mt-1 m-0 text-(--admin-muted)">Users across {totalCountries} countries — click a dot to filter</p>
              </div>
              {filterCountry && (
                <button
                  onClick={() => setFilterCountry("")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl fontStyle9 font-semibold cursor-pointer border-0 bg-(--admin-danger-soft) text-(--admin-danger) hover:opacity-80 transition-opacity"
                >
                  <IconClose /> Clear: {filterCountry}
                </button>
              )}
            </div>

            <div className="admin-card overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "2 / 1" }}>
                {/* Zoom controls */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
                  <button
                    onClick={() => setMapZoom((z) => Math.min(z + 0.25, 3))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800/90 border border-slate-600/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer text-sm font-bold"
                    title="Zoom In"
                  >+</button>
                  <button
                    onClick={() => setMapZoom((z) => Math.max(z - 0.25, 0.5))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800/90 border border-slate-600/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer text-sm font-bold"
                    title="Zoom Out"
                  >−</button>
                  <button
                    onClick={resetMapView}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800/90 border border-slate-600/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer text-xs"
                    title="Reset View"
                  >↺</button>
                </div>

                <div
                  ref={mapContainerRef}
                  className="absolute inset-0"
                  style={{
                    transform: `scale(${mapZoom}) translate(${mapPan.x / mapZoom}px, ${mapPan.y / mapZoom}px)`,
                    transformOrigin: "center center",
                    transition: isDragging ? "none" : "transform 0.3s ease",
                    cursor: isDragging ? "grabbing" : "grab",
                    touchAction: "none",
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                >
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    scale: 140,
                    center: [20, 10],
                  }}
                  viewBox="0 0 1000 500"
                  preserveAspectRatio="xMidYMid slice"
                  style={{ width: "100%", height: "100%" }}
                >
                  <defs>
                    <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="dotGlowActive" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="tooltipShadow">
                      <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.3" />
                    </filter>
                    <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0c1929" />
                      <stop offset="100%" stopColor="#162032" />
                    </linearGradient>
                  </defs>

                  {/* Ocean background */}
                  <rect width="1000" height="500" fill="url(#oceanGrad)" />

                  {/* Subtle grid */}
                  {Array.from({ length: 37 }, (_, i) => (
                    <line key={`gv${i}`} x1={i * 27} y1={0} x2={i * 27} y2={500} stroke="#1e3a5f" strokeWidth="0.5" opacity="0.3" />
                  ))}
                  {Array.from({ length: 19 }, (_, i) => (
                    <line key={`gh${i}`} x1={0} y1={i * 27} x2={1000} y2={i * 27} stroke="#1e3a5f" strokeWidth="0.5" opacity="0.3" />
                  ))}

                  {/* World map geographies with accurate country borders */}
                  <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#1a3650"
                          stroke="#2a5080"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none", cursor: "default" },
                            hover: { fill: "#233d5c", outline: "none", cursor: "default" },
                            pressed: { outline: "none" },
                          }}
                        />
                      ))
                    }
                  </Geographies>

                  {/* Country dots with glow */}
                  {countries.map((c) => {
                    const coords = countryCoords[c.country];
                    if (!coords) return null;
                    const r = getRadius(c.count);
                    const isActive = filterCountry === c.country;
                    const isHoveredNow = hoveredCountry === c.country;
                    const pulseR = r * 3;
                    return (
                      <Marker
                        key={c.country}
                        coordinates={coords}
                        style={{ cursor: "pointer" }}
                        onClick={() => setFilterCountry(isActive ? "" : c.country)}
                        onMouseEnter={() => setHoveredCountry(c.country)}
                        onMouseLeave={() => setHoveredCountry(null)}
                      >
                        {/* Outer glow ring */}
                        <circle r={pulseR} fill={isActive ? "url(#dotGlowActive)" : "url(#dotGlow)"} opacity={isActive ? 0.5 : 0.25} />

                        {/* Pulse animation for active */}
                        {isActive && (
                          <circle r={r} fill="none" stroke="#a78bfa" strokeWidth="2" opacity="0.6">
                            <animate attributeName="r" from={r + 2} to={r + 25} dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                          </circle>
                        )}

                        {/* Hover expand ring */}
                        {isHoveredNow && !isActive && (
                          <circle r={r + 3} fill="none" stroke="#818cf8" strokeWidth="1.5" opacity="0.5" />
                        )}

                        {/* Main dot */}
                        <circle
                          r={r}
                          fill={isActive ? "#a78bfa" : "#818cf8"}
                          opacity={isActive ? 1 : 0.85}
                          filter="url(#glow)"
                        />

                        {/* Inner bright core */}
                        <circle r={r * 0.4} fill="#fff" opacity={isActive ? 0.7 : 0.4} />

                        {/* Count badge */}
                        {(isHoveredNow || isActive || c.count >= maxCount * 0.3) && (
                          <g>
                            <rect
                              x={-14} y={-r - 22}
                              width="28" height="16" rx="4"
                              fill="#1e293b" stroke="#334155" strokeWidth="1"
                            />
                            <text y={-r - 11} textAnchor="middle" fontSize="10" fontWeight="700" fill="#e2e8f0" fontFamily="system-ui, sans-serif">
                              {c.count}
                            </text>
                          </g>
                        )}

                        {/* Tooltip on hover */}
                        {isHoveredNow && (
                          <g filter="url(#tooltipShadow)">
                            <rect
                              x={-60} y={-r - 52}
                              width="120" height="32" rx="8"
                              fill="#1e293b" stroke="#334155" strokeWidth="1"
                            />
                            <polygon
                              points={`-5,${-r - 20} 5,${-r - 20} 0,${-r - 14}`}
                              fill="#1e293b" stroke="#334155" strokeWidth="1"
                            />
                            <rect x={-5} y={-r - 21} width="10" height="2" fill="#1e293b" />
                            <text y={-r - 40} textAnchor="middle" fontSize="11" fontWeight="700" fill="#f1f5f9" fontFamily="system-ui, sans-serif">
                              {c.country}
                            </text>
                            <text y={-r - 27} textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="system-ui, sans-serif">
                              {c.count} user{c.count !== 1 ? "s" : ""} · {((c.count / total) * 100).toFixed(1)}%
                            </text>
                          </g>
                        )}
                      </Marker>
                    );
                  })}

                  {/* Unknown country dot */}
                  {countryMap["Unknown"] && (() => {
                    const c = countryMap["Unknown"];
                    const r = getRadius(c.count);
                    const isActive = filterCountry === "Unknown";
                    const isHoveredNow = hoveredCountry === "Unknown";
                    return (
                      <Marker
                        key="Unknown"
                        coordinates={[0, 0]}
                        style={{ cursor: "pointer" }}
                        onClick={() => setFilterCountry(isActive ? "" : "Unknown")}
                        onMouseEnter={() => setHoveredCountry("Unknown")}
                        onMouseLeave={() => setHoveredCountry(null)}
                      >
                        <circle r={r * 3} fill="url(#dotGlow)" opacity={0.2} />
                        <circle r={r} fill="#64748b" opacity={0.7} filter="url(#glow)" />
                        <circle r={r * 0.4} fill="#fff" opacity={0.3} />
                        {(isHoveredNow || isActive) && (
                          <g filter="url(#tooltipShadow)">
                            <rect x={-50} y={-r - 48} width="100" height="28" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                            <text y={-r - 36} textAnchor="middle" fontSize="10" fontWeight="700" fill="#f1f5f9" fontFamily="system-ui, sans-serif">Unknown Location</text>
                            <text y={-r - 25} textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="system-ui, sans-serif">{c.count} user{c.count !== 1 ? "s" : ""}</text>
                          </g>
                        )}
                      </Marker>
                    );
                  })()}
                </ComposableMap>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="px-5 py-3.5 flex items-center justify-between flex-wrap gap-3 border-t border-white/5">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#818cf8]" />
                    <span className="fontStyle10 text-slate-400">Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#a78bfa] ring-2 ring-[#a78bfa]/30" />
                    <span className="fontStyle10 text-slate-400">Selected</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="fontStyle10 text-slate-500">Total: <strong className="text-slate-300">{total}</strong></span>
                  <span className="fontStyle10 text-slate-500">Countries: <strong className="text-slate-300">{totalCountries}</strong></span>
                </div>
              </div>
            </div>

            {/* Top Countries Bar */}
            {countries.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-2">
                {countries.slice(0, 7).map((c) => {
                  const isActive = filterCountry === c.country;
                  const pct = total > 0 ? ((c.count / total) * 100).toFixed(1) : 0;
                  return (
                    <button
                      key={c.country}
                      onClick={() => setFilterCountry(isActive ? "" : c.country)}
                      className={`admin-card px-3 py-2.5 text-left cursor-pointer transition-all duration-200 border-0 ${
                        isActive ? "ring-2 ring-[#818cf8] shadow-lg shadow-[#818cf8]/10" : "hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isActive ? "bg-[#a78bfa]" : "bg-[#818cf8]"}`} />
                        <span className="fontStyle9 font-semibold text-(--admin-text) truncate">{c.country}</span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="fontStyle5 font-extrabold text-[#818cf8]">{c.count}</span>
                        <span className="fontStyle10 text-(--admin-muted)">{pct}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Table Card ── */}
      <div className="admin-card overflow-hidden min-w-0">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-3 px-4 sm:px-5 py-4 border-b border-(--admin-border)">
          <div className="relative w-full sm:w-auto sm:min-w-[240px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--admin-muted) pointer-events-none flex items-center">
              <IconSearch />
            </span>
            <input
              className={`${inp} pl-9`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email..."
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {["All", ...ROLES].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={`px-3 py-1.5 rounded-xl fontStyle9 font-semibold cursor-pointer border-0 whitespace-nowrap transition-all ${
                  filterRole === r
                    ? "bg-(--admin-accent) text-white"
                    : "bg-(--admin-bg) text-(--admin-muted) hover:text-(--admin-text) hover:bg-(--admin-hover)"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-(--admin-border) bg-(--admin-bg)">
                {[
                  { label: "User", cls: "" },
                  { label: "Email", cls: "" },
                  { label: "Role", cls: "hidden md:table-cell" },
                  { label: "Status", cls: "hidden md:table-cell" },
                  { label: "Location", cls: "hidden md:table-cell" },
                  { label: "IP", cls: "hidden md:table-cell" },
                  { label: "Last Login", cls: "hidden md:table-cell" },
                  { label: "Joined", cls: "hidden md:table-cell" },
                  { label: "Actions", cls: "" },
                ].map((h) => (
                  <th
                    key={h.label}
                    className={`text-left px-5 py-3 fontStyle9 font-semibold uppercase tracking-wider whitespace-nowrap text-(--admin-muted) ${h.cls}`}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-14 fontStyle9 text-(--admin-muted)">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`border-b border-(--admin-border) transition-colors hover:bg-(--admin-hover) ${idx === filtered.length - 1 ? "border-b-0" : ""}`}
                  >
                    {/* Avatar + Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-full flex items-center justify-center text-white fontStyle9 font-bold flex-shrink-0 ${avatarColor(idx)}`}>
                          {user.avatar}
                        </span>
                        <span className="fontStyle9 font-semibold whitespace-nowrap text-(--admin-text)">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 fontStyle9 whitespace-nowrap text-(--admin-muted)">{user.email}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="block max-w-[170px] truncate fontStyle9 text-(--admin-muted)" title={user.location}>
                        {user.location}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 fontStyle9 whitespace-nowrap text-(--admin-muted) hidden md:table-cell">{user.ip}</td>
                    <td className="px-5 py-3.5 fontStyle9 whitespace-nowrap text-(--admin-muted) hidden md:table-cell">{user.lastLogin}</td>
                    <td className="px-5 py-3.5 fontStyle9 whitespace-nowrap text-(--admin-muted) hidden md:table-cell">{user.joined}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <button
                          onClick={() => setModal({ mode: "edit", data: { ...user } })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg fontStyle9 font-semibold cursor-pointer border-0 bg-(--admin-accent-soft) text-(--admin-accent) hover:opacity-75 transition-opacity"
                        >
                          <IconEdit /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg fontStyle9 font-semibold cursor-pointer border-0 bg-(--admin-danger-soft) text-(--admin-danger) hover:opacity-75 transition-opacity"
                        >
                          <IconDelete /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 sm:px-5 py-3 flex items-center justify-between border-t border-(--admin-border)">
          <p className="fontStyle9 text-(--admin-muted) m-0">
            Showing <strong className="text-(--admin-text)">{filtered.length}</strong> of <strong className="text-(--admin-text)">{total}</strong> users
          </p>
        </div>

      </div>

      {/* ── Modals ── */}
      {modal && (
        <UserModal
          mode={modal.mode}
          data={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}

    </div>
  );
}