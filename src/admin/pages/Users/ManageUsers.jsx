import { useState, useEffect } from "react";
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
    <span className={`${map[status] || ""} px-2.5 py-1 rounded-full fs10 font-semibold`}>
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
    <span className={`${map[display] || "bg-slate-500/10 text-slate-500"} px-2.5 py-1 rounded-full fs10 font-semibold`}>
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
  "w-full px-3 py-2.5 rounded-xl outline-none transition-colors fs9 box-border",
  "bg-(--admin-bg) border border-(--admin-border)",
  "text-(--admin-text) placeholder:text-(--admin-muted)",
  "focus:border-(--admin-accent)",
].join(" ");

const lbl = "block fs10 font-semibold uppercase tracking-wider text-(--admin-muted) mb-1.5";

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
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-(--admin-surface) border border-(--admin-border)">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--admin-border)">
          <p className="fs7 font-bold m-0 text-(--admin-text)">
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
        <div className="px-6 py-5 flex flex-col gap-4">
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Role</label>
              <select className={inp} value={form.role} onChange={(e) => set("role", e.target.value)}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Status</label>
              <select className={inp} value={form.status} onChange={(e) => set("status", e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-(--admin-border)">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl fs9 font-semibold cursor-pointer border border-(--admin-border) bg-transparent text-(--admin-subtext) hover:bg-(--admin-hover) transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl fs9 font-bold text-white border-0 cursor-pointer hover:opacity-90 transition-opacity"
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
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl p-8 text-center shadow-2xl bg-(--admin-surface) border border-(--admin-border)">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-(--admin-danger-soft)">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
              stroke="var(--admin-danger)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="fs7 font-bold m-0 mb-2 text-(--admin-text)">Delete User?</p>
        <p className="fs9 m-0 mb-6 text-(--admin-muted)">
          "<strong className="text-(--admin-subtext)">{name}</strong>" will be permanently deleted.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl fs9 font-semibold cursor-pointer border border-(--admin-border) bg-transparent text-(--admin-subtext) hover:bg-(--admin-hover) transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-xl fs9 font-bold text-white border-0 cursor-pointer bg-(--admin-danger) hover:opacity-85 transition-opacity"
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
  const [modal, setModal]               = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getUsersAPI();
      if (res.success) {
        // Normalize DB fields to UI fields
        const normalized = res.users.map((u) => ({
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
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ── Filter ── */
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole   = filterRole === "All" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  /* ── Stats ── */
  const total    = users.length;
  const active   = users.filter((u) => u.status === "Active").length;
  const inactive = users.filter((u) => u.status === "Inactive").length;
  const banned   = users.filter((u) => u.status === "Banned").length;

/* ── Save ── */
  const handleSave = async (form) => {
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
    } else {
      try {
        await updateUserAPI(form.id, {
          name:   form.name,
          email:  form.email,
          role:   form.role.toLowerCase(),
          status: form.status,
        });
        setUsers((prev) =>
          prev.map((u) =>
            u.id === form.id ? { ...u, ...form, avatar: getInitials(form.name) } : u
          )
        );
      } catch (err) {
        console.log("Update failed:", err);
      }
    }
    setModal(null);
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    try {
      await deleteUserAPI(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    } catch (err) {
      console.log("Delete failed:", err);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="p-7">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="fs6 font-bold m-0 text-(--admin-text)">Manage Users</h1>
          <p className="fs10 mt-1 m-0 text-(--admin-muted)">{total} users registered</p>
        </div>
        <button
          onClick={() => setModal({ mode: "add", data: { ...emptyForm } })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl fs9 font-bold text-white border-0 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "var(--admin-accent-grad)", boxShadow: "0 4px 14px rgba(99,102,241,0.25)" }}
        >
          <IconPlus /> Add User
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Users", value: total,    cls: "text-(--admin-accent)"  },
          { label: "Active",      value: active,   cls: "text-(--admin-success)" },
          { label: "Inactive",    value: inactive, cls: "text-(--admin-warning)" },
          { label: "Banned",      value: banned,   cls: "text-(--admin-danger)"  },
        ].map((s) => (
          <div key={s.label} className="admin-card p-4 flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-(--admin-accent-soft)">
              <IconUsers />
            </div>
            <div>
              <p className={`fs6 font-extrabold m-0 ${s.cls}`}>{s.value}</p>
              <p className="fs10 m-0 text-(--admin-muted)">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div className="admin-card overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4 border-b border-(--admin-border)">
          <div className="relative" style={{ minWidth: 220 }}>
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
          <div className="flex items-center gap-2 flex-wrap">
            {["All", ...ROLES].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={`px-3 py-1.5 rounded-xl fs10 font-semibold cursor-pointer border-0 transition-all ${
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
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-(--admin-border)">
                {["User", "Email", "Role", "Status", "Location", "IP", "Last Login", "Joined", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 fs10 font-semibold uppercase tracking-wider text-(--admin-muted)"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-14 fs9 text-(--admin-muted)">
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
                        <span className={`w-9 h-9 rounded-full flex items-center justify-center text-white fs10 font-bold flex-shrink-0 ${avatarColor(idx)}`}>
                          {user.avatar}
                        </span>
                        <span className="fs9 font-semibold text-(--admin-text)">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 fs9 text-(--admin-muted)">{user.email}</td>
                    <td className="px-5 py-3.5">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-5 py-3.5 fs9 text-(--admin-muted)">{user.location}</td>
                    <td className="px-5 py-3.5 fs9 text-(--admin-muted)">{user.ip}</td>
                    <td className="px-5 py-3.5 fs10 text-(--admin-muted)">{user.lastLogin}</td>
                    <td className="px-5 py-3.5 fs10 text-(--admin-muted)">{user.joined}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setModal({ mode: "edit", data: { ...user } })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg fs10 font-semibold cursor-pointer border-0 bg-(--admin-accent-soft) text-(--admin-accent) hover:opacity-75 transition-opacity"
                        >
                          <IconEdit /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg fs10 font-semibold cursor-pointer border-0 bg-(--admin-danger-soft) text-(--admin-danger) hover:opacity-75 transition-opacity"
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
        <div className="px-5 py-3 flex items-center justify-between border-t border-(--admin-border)">
          <p className="fs10 text-(--admin-muted) m-0">
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