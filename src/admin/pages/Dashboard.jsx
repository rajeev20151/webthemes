import { useState, useEffect, useMemo } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area,
} from "recharts";
import {
  getUsersAPI, adminGetTemplatesAPI, adminGetReviewsAPI,
  adminGetChatsAPI, adminGetContactsAPI, adminGetBlogsAPI,
} from "../services/adminApi";

const COLORS = {
  indigo: "#6366f1", indigoSoft: "rgba(99,102,241,0.12)",
  sky:    "#0ea5e9", skySoft:    "rgba(14,165,233,0.12)",
  emerald:"#10b981", emeraldSoft:"rgba(16,185,129,0.12)",
  amber:  "#f59e0b", amberSoft:  "rgba(245,158,11,0.12)",
  violet: "#8b5cf6", violetSoft: "rgba(139,92,246,0.12)",
  rose:   "#f43f5e", roseSoft:   "rgba(244,63,94,0.12)",
  cyan:   "#06b6d4", cyanSoft:   "rgba(6,182,212,0.12)",
};

const statusColors = { Active: "#10b981", Inactive: "#f59e0b", Banned: "#ef4444" };
const statusPieColors = ["#10b981", "#f59e0b", "#ef4444"];

/* ── Mini Sparkline ── */
function MiniSparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  return (
    <ResponsiveContainer width="100%" height={32}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${color.replace("#", "")})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ── Stat Card ── */
function StatCard({ label, value, icon, color, gradient, trend, sparkData }) {
  return (
    <div className="admin-card group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Background gradient accent */}
      <div
        className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300"
        style={{ background: gradient }}
      />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: gradient }} />

      <div className="p-5 relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: `${color}15`, color }}
          >
            {icon}
          </div>
          {trend !== undefined && (
            <span className={`flex items-center gap-0.5 fontStyle10 font-semibold px-2 py-0.5 rounded-full ${
              trend >= 0 ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
            }`}>
              {trend >= 0 ? (
                <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="currentColor"><path d="M6 2l4 5H2z"/></svg>
              ) : (
                <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="currentColor"><path d="M6 10l4-5H2z"/></svg>
              )}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className="fontStyle9 text-[var(--admin-muted)] m-0 mb-1">{label}</p>
        <p className="fontStyle3 font-extrabold m-0" style={{ color }}>{value}</p>
        {sparkData && (
          <div className="mt-2 -mx-1">
            <MiniSparkline data={sparkData} color={color} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Welcome Banner ── */
function WelcomeBanner({ userCount, templateCount }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const date = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="admin-card relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(14,165,233,0.06) 50%, rgba(139,92,246,0.08) 100%)" }} />
      <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.04]" style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }} />
      <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="fontStyle2 font-bold text-[var(--admin-text)] m-0">{greeting} 👋</h2>
          <p className="fontStyle6 text-[var(--admin-muted)] mt-1.5 m-0">{date}</p>
          <p className="fontStyle7 text-[var(--admin-muted)] mt-2 m-0">
            You have <strong className="text-[var(--admin-accent)]">{userCount}</strong> users and{" "}
            <strong className="text-[var(--admin-accent)]">{templateCount}</strong> templates in your system.
          </p>
        </div>
        <div className="flex gap-2">
          <QuickAction href="/admin/users" icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" label="Users" />
          <QuickAction href="/admin/templates" icon="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" label="Templates" />
          <QuickAction href="/admin/blogs" icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" label="Blogs" />
        </div>
      </div>
    </div>
  );
}

/* ── Quick Action Button ── */
function QuickAction({ href, icon, label }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-4 py-2 rounded-xl fontStyle9 font-semibold text-[var(--admin-accent)] bg-[var(--admin-accent-soft)] hover:bg-[var(--admin-accent)] hover:text-white transition-all duration-200 no-underline"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={icon} />
      </svg>
      {label}
    </a>
  );
}

/* ── Status Pie ── */
function StatusPie({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="admin-card p-5">
      <div className="mb-4">
        <p className="fontStyle5 font-bold text-[var(--admin-text)] m-0">User Status</p>
        <p className="fontStyle9 text-[var(--admin-muted)] mt-0.5 m-0">Distribution of user accounts</p>
      </div>
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={statusPieColors[i]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--admin-surface)",
                border: "1px solid var(--admin-border)",
                borderRadius: 10,
                fontSize: 12,
                boxShadow: "0 8px 24px var(--admin-shadow)",
              }}
              labelStyle={{ color: "var(--admin-text)", fontWeight: 600 }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-2">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: statusPieColors[i] }} />
              <span className="fontStyle9 text-[var(--admin-muted)]">
                {d.name}: <strong className="text-[var(--admin-text)]">{d.value}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Category Bar ── */
function CategoryBar({ data }) {
  return (
    <div className="admin-card p-5">
      <div className="mb-4">
        <p className="fontStyle5 font-bold text-[var(--admin-text)] m-0">Templates by Category</p>
        <p className="fontStyle9 text-[var(--admin-muted)] mt-0.5 m-0">Distribution across categories</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={22}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: "var(--admin-surface)",
              border: "1px solid var(--admin-border)",
              borderRadius: 10,
              fontSize: 12,
              boxShadow: "0 8px 24px var(--admin-shadow)",
            }}
            labelStyle={{ color: "var(--admin-text)", fontWeight: 600 }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={Object.values(COLORS)[i % Object.values(COLORS).length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Recent Activity Timeline ── */
function ActivityTimeline({ users, blogs, reviews }) {
  const activities = useMemo(() => {
    const items = [];
    (users || []).slice(0, 3).forEach((u) => {
      items.push({
        type: "user",
        text: `${u.name || "New user"} joined`,
        time: u.createdAt,
        color: COLORS.indigo,
        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      });
    });
    (blogs || []).slice(0, 2).forEach((b) => {
      items.push({
        type: "blog",
        text: `Blog "${(b.title || "Post").slice(0, 30)}" published`,
        time: b.createdAt,
        color: COLORS.rose,
        icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
      });
    });
    (reviews || []).slice(0, 2).forEach((r) => {
      items.push({
        type: "review",
        text: `New ${r.rating || 5}-star review received`,
        time: r.createdAt,
        color: COLORS.amber,
        icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
      });
    });
    return items
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  }, [users, blogs, reviews]);

  if (activities.length === 0) return null;

  const timeAgo = (date) => {
    if (!date) return "";
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="admin-card p-5">
      <div className="mb-4">
        <p className="fontStyle5 font-bold text-[var(--admin-text)] m-0">Recent Activity</p>
        <p className="fontStyle9 text-[var(--admin-muted)] mt-0.5 m-0">Latest updates across your platform</p>
      </div>
      <div className="space-y-1">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--admin-hover)] transition-colors duration-150">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: `${a.color}12`, color: a.color }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={a.icon} />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="fontStyle9 font-semibold text-[var(--admin-text)] m-0 truncate">{a.text}</p>
              <p className="fontStyle10 text-[var(--admin-muted)] m-0">{timeAgo(a.time)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Recent Users Table ── */
function RecentTable({ users }) {
  const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const avatarColors = ["bg-indigo-500", "bg-sky-500", "bg-emerald-500", "bg-violet-500", "bg-rose-500", "bg-amber-500"];

  return (
    <div className="admin-card overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--admin-border)] flex items-center justify-between">
        <div>
          <p className="fontStyle5 font-bold text-[var(--admin-text)] m-0">Recent Users</p>
          <p className="fontStyle9 text-[var(--admin-muted)] mt-0.5 m-0">Latest registered accounts</p>
        </div>
        <a href="/admin/users" className="fontStyle9 font-semibold text-[var(--admin-accent)] hover:underline no-underline">
          View All →
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-bg)]">
              {["User", "Email", "Role", "Status", "Joined"].map((h) => (
                <th key={h} className="text-left px-5 py-3 fontStyle9 font-semibold text-[var(--admin-muted)] uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 fontStyle9 text-[var(--admin-muted)]">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-[var(--admin-border)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    No users yet
                  </div>
                </td>
              </tr>
            ) : (
              users.slice(0, 8).map((u, i) => (
                <tr
                  key={u._id || i}
                  className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[var(--admin-hover)] transition-colors duration-150"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white fontStyle9 font-bold text-xs ${avatarColors[i % avatarColors.length]}`}>
                        {getInitials(u.name)}
                      </span>
                      <span className="fontStyle9 font-semibold text-[var(--admin-text)] whitespace-nowrap">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 fontStyle9 text-[var(--admin-muted)] whitespace-nowrap">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="fontStyle9 font-medium text-[var(--admin-subtext)]">
                      {u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : "User"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full fontStyle9 font-semibold ${
                      u.status === "Active" ? "admin-badge-success" :
                      u.status === "Banned" ? "admin-badge-danger" : "admin-badge-warning"
                    }`}>
                      {u.status || (u.isBanned ? "Banned" : u.isVerified ? "Active" : "Inactive")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 fontStyle9 text-[var(--admin-muted)] whitespace-nowrap">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric"
                    }) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN DASHBOARD
════════════════════════════════════════ */
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    users: [], templates: [], reviews: [],
    chats: [], contacts: [], blogs: [],
  });

  useEffect(() => {
    Promise.allSettled([
      getUsersAPI().then(r => ({ key: "users", val: r.users || [] })),
      adminGetTemplatesAPI().then(r => ({ key: "templates", val: r.templates || r.data || [] })),
      adminGetReviewsAPI().then(r => ({ key: "reviews", val: r.reviews || [], stats: r.stats })),
      adminGetChatsAPI().then(r => ({ key: "chats", val: r.chats || [], stats: r.stats })),
      adminGetContactsAPI().then(r => ({ key: "contacts", val: r.data || [] })),
      adminGetBlogsAPI().then(r => ({ key: "blogs", val: r.blogs || r.data || [] })),
    ]).then((results) => {
      const acc = { users: [], templates: [], reviews: [], chats: [], contacts: [], blogs: [] };
      let reviewsStats = null;
      results.forEach((res) => {
        if (res.status === "fulfilled") {
          const { key, val, stats } = res.value;
          acc[key] = val;
          if (stats) reviewsStats = stats;
        }
      });
      acc._reviewsStats = reviewsStats;
      setData(acc);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-[var(--admin-accent-soft)] border-t-[var(--admin-accent)] animate-spin" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-b-[var(--admin-accent)] animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
          </div>
          <div className="text-center">
            <p className="fontStyle5 font-bold text-[var(--admin-text)] m-0">Loading Dashboard</p>
            <p className="fontStyle9 text-[var(--admin-muted)] mt-1 m-0">Fetching latest data…</p>
          </div>
        </div>
      </div>
    );
  }

  const { users, templates, reviews, chats, contacts, blogs, _reviewsStats } = data;

  const totalViews = templates.reduce((sum, t) => sum + (t.views || 0), 0);

  const userStatus = [
    { name: "Active",   key: "Active",   value: users.filter((u) => u.status === "Active" || (!u.status && u.isVerified && !u.isBanned)).length },
    { name: "Inactive", key: "Inactive", value: users.filter((u) => u.status === "Inactive" || (!u.status && !u.isVerified && !u.isBanned)).length },
    { name: "Banned",   key: "Banned",   value: users.filter((u) => u.status === "Banned" || u.isBanned).length },
  ];

  const catMap = {};
  templates.forEach((t) => {
    const cat = t.category || "Uncategorized";
    catMap[cat] = (catMap[cat] || 0) + 1;
  });
  const categoryData = Object.entries(catMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const newContacts = contacts.filter((c) => c.status === "new" || !c.status).length;
  const unreadChats = chats.filter((c) => c.status === "unread" || !c.status).length;

  /* ── Sparkline data generators ── */
  const genSpark = (arr, key) => {
    if (!arr.length) return [];
    const steps = 7;
    const step = Math.max(1, Math.floor(arr.length / steps));
    return Array.from({ length: steps }, (_, i) => ({
      v: arr.slice(0, (i + 1) * step).length,
    }));
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ── Welcome Banner ── */}
      <WelcomeBanner userCount={users.length} templateCount={templates.length} />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={users.length.toLocaleString()}
          color={COLORS.indigo}
          gradient="linear-gradient(135deg, #6366f1 0%, #818cf8 100%)"
          sparkData={genSpark(users)}
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard
          label="Total Templates"
          value={templates.length.toLocaleString()}
          color={COLORS.sky}
          gradient="linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)"
          sparkData={genSpark(templates)}
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="21"/></svg>}
        />
        <StatCard
          label="Total Views"
          value={totalViews.toLocaleString()}
          color={COLORS.rose}
          gradient="linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)"
          sparkData={genSpark(templates)}
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
        />
        <StatCard
          label="Total Reviews"
          value={reviews.length.toLocaleString()}
          color={COLORS.amber}
          gradient="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
          sparkData={genSpark(reviews)}
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
        />
        <StatCard
          label="Total Chats"
          value={chats.length.toLocaleString()}
          color={COLORS.violet}
          gradient="linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)"
          sparkData={genSpark(chats)}
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
        />
        <StatCard
          label="Total Contacts"
          value={contacts.length.toLocaleString()}
          color={COLORS.emerald}
          gradient="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
          sparkData={genSpark(contacts)}
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
        />
        <StatCard
          label="Total Blogs"
          value={blogs.length.toLocaleString()}
          color={COLORS.cyan}
          gradient="linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)"
          sparkData={genSpark(blogs)}
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
        />
        <StatCard
          label="Unread Items"
          value={(newContacts + unreadChats).toLocaleString()}
          color="#ec4899"
          gradient="linear-gradient(135deg, #ec4899 0%, #f472b6 100%)"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
        />
      </div>

      {/* ── Quick Info Bar ── */}
      {(_reviewsStats || newContacts > 0 || unreadChats > 0) && (
        <div className="flex items-center gap-3 flex-wrap">
          {_reviewsStats && (
            <div className="admin-card px-4 py-2.5 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span className="fontStyle9 text-[var(--admin-muted)]">
                Avg Rating: <strong className="text-[var(--admin-text)]">{_reviewsStats.avgRating?.toFixed(1) || "—"}</strong>
              </span>
            </div>
          )}
          {newContacts > 0 && (
            <div className="admin-card px-4 py-2.5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="fontStyle9 text-[var(--admin-muted)]">
                <strong className="text-[var(--admin-danger)]">{newContacts}</strong> unread contact{newContacts > 1 ? "s" : ""}
              </span>
            </div>
          )}
          {unreadChats > 0 && (
            <div className="admin-card px-4 py-2.5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="fontStyle9 text-[var(--admin-muted)]">
                <strong className="text-[var(--admin-warning)]">{unreadChats}</strong> unread chat{unreadChats > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Charts + Activity Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {categoryData.length > 0 && <CategoryBar data={categoryData} />}
        <StatusPie data={userStatus} />
      </div>

      {/* ── Activity Timeline + Recent Users ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ActivityTimeline users={users} blogs={blogs} reviews={reviews} />
        <div className="lg:col-span-2">
          <RecentTable users={users} />
        </div>
      </div>

    </div>
  );
}
