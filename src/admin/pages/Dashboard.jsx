import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ── Chart Data ── */
const chartData = {
  "This Week": [
    { day: "Mon", revenue: 1200, users: 140 },
    { day: "Tue", revenue: 1900, users: 210 },
    { day: "Wed", revenue: 1500, users: 180 },
    { day: "Thu", revenue: 2200, users: 260 },
    { day: "Fri", revenue: 1800, users: 220 },
    { day: "Sat", revenue: 2600, users: 310 },
    { day: "Sun", revenue: 1280, users: 120 },
  ],
  "This Month": [
    { day: "Wk 1", revenue: 9200,  users: 980  },
    { day: "Wk 2", revenue: 12400, users: 1240 },
    { day: "Wk 3", revenue: 11800, users: 1180 },
    { day: "Wk 4", revenue: 15520, users: 1470 },
  ],
  "This Year": [
    { day: "Jan", revenue: 38000, users: 3200 },
    { day: "Feb", revenue: 42000, users: 3800 },
    { day: "Mar", revenue: 39000, users: 3500 },
    { day: "Apr", revenue: 51000, users: 4200 },
    { day: "May", revenue: 48000, users: 4100 },
    { day: "Jun", revenue: 55000, users: 4800 },
    { day: "Jul", revenue: 62000, users: 5300 },
    { day: "Aug", revenue: 58000, users: 5000 },
    { day: "Sep", revenue: 67000, users: 5600 },
    { day: "Oct", revenue: 71000, users: 6100 },
    { day: "Nov", revenue: 74000, users: 6500 },
    { day: "Dec", revenue: 78300, users: 6900 },
  ],
};

const salesBarData = [
  { name: "Agency Pro",     sales: 142 },
  { name: "Portfolio X",   sales: 98  },
  { name: "SaaS Landing",  sales: 76  },
  { name: "E-Commerce Kit",sales: 54  },
  { name: "Blog Minimal",  sales: 39  },
];

/* ── Mock Data ── */
const statsData = {
  "This Week":   { revenue: "$12,480", users: "1,240", orders: "348", growth: "+18.4%" },
  "This Month":  { revenue: "$48,920", users: "4,870", orders: "1,230", growth: "+24.1%" },
  "This Year":   { revenue: "$5,82,300", users: "52,400", orders: "14,800", growth: "+31.7%" },
};

const tableData = {
  "All":       [
    { name: "Agency Pro",     category: "Business",  sales: 142, revenue: "$4,118", status: "Active"   },
    { name: "Portfolio X",    category: "Portfolio", sales: 98,  revenue: "$1,862", status: "Active"   },
    { name: "SaaS Landing",   category: "SaaS",      sales: 76,  revenue: "$3,724", status: "Paused"   },
    { name: "E-Commerce Kit", category: "Store",     sales: 54,  revenue: "$3,186", status: "Active"   },
    { name: "Blog Minimal",   category: "Blog",      sales: 39,  revenue: "$585",   status: "Inactive" },
  ],
  "Active":    [
    { name: "Agency Pro",     category: "Business",  sales: 142, revenue: "$4,118", status: "Active" },
    { name: "Portfolio X",    category: "Portfolio", sales: 98,  revenue: "$1,862", status: "Active" },
    { name: "E-Commerce Kit", category: "Store",     sales: 54,  revenue: "$3,186", status: "Active" },
  ],
  "Paused":    [
    { name: "SaaS Landing",   category: "SaaS",      sales: 76,  revenue: "$3,724", status: "Paused" },
  ],
  "Inactive":  [
    { name: "Blog Minimal",   category: "Blog",      sales: 39,  revenue: "$585",   status: "Inactive" },
  ],
};

const statusCls = {
  Active:   "admin-badge-success",
  Paused:   "admin-badge-warning",
  Inactive: "admin-badge-danger",
};

/* ── Chevron Icon ── */
const IconChevron = ({ open }) => (
  <svg
    className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
  >
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── Reusable Dropdown ── */
function Dropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] text-[var(--admin-text)] fs10 font-semibold cursor-pointer transition-all duration-200 hover:border-[var(--admin-accent)] hover:text-[var(--admin-accent)]"
      >
        {value}
        <IconChevron open={open} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 admin-card py-1.5 min-w-[140px] shadow-lg">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 fs10 font-medium transition-colors duration-150 cursor-pointer border-none
                ${opt === value
                  ? "text-[var(--admin-accent)] bg-[var(--admin-accent-soft)]"
                  : "text-[var(--admin-subtext)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ label, value, icon, accent, delay }) {
  return (
    <div className="admin-card p-5 flex items-center gap-4" style={{ animationDelay: delay }}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="fs10 text-[var(--admin-muted)] m-0 mb-0.5">{label}</p>
        <p className="fs7 font-bold text-[var(--admin-text)] m-0">{value}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════ */
export default function Analytics() {
  const [period,  setPeriod]  = useState("This Month");
  const [filter,  setFilter]  = useState("All");

  const stats = statsData[period];
  const rows  = tableData[filter];

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="fs6 font-bold text-[var(--admin-text)] m-0">Dashboard</h1>
          <p className="fs10 text-[var(--admin-muted)] mt-1 m-0">Track your performance & revenue</p>
        </div>
        <Dropdown options={["This Week","This Month","This Year"]} value={period} onChange={setPeriod} />
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue" value={stats.revenue}
          accent="bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
        <StatCard
          label="Total Users" value={stats.users}
          accent="bg-[var(--admin-success-soft)] text-[var(--admin-success)]"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard
          label="Total Orders" value={stats.orders}
          accent="bg-[var(--admin-warning-soft)] text-[var(--admin-warning)]"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
        />
        <StatCard
          label="Growth Rate" value={stats.growth}
          accent="bg-[var(--admin-danger-soft)] text-[var(--admin-danger)]"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Area Chart — Revenue & Users */}
        <div className="admin-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="fs8 font-bold text-[var(--admin-text)] m-0">Revenue & Users</p>
              <p className="fs10 text-[var(--admin-muted)] mt-0.5 m-0">Trend over {period.toLowerCase()}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 fs10 text-[var(--admin-muted)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1] inline-block" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 fs10 text-[var(--admin-muted)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34d399] inline-block" /> Users
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData[period]} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#34d399" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: "var(--admin-text)", fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#gradRevenue)" dot={false} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="users"   stroke="#34d399" strokeWidth={2} fill="url(#gradUsers)"   dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart — Sales by Template */}
        <div className="admin-card p-5">
          <div className="mb-4">
            <p className="fs8 font-bold text-[var(--admin-text)] m-0">Sales by Template</p>
            <p className="fs10 text-[var(--admin-muted)] mt-0.5 m-0">All time</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesBarData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v.split(" ")[0]} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: "var(--admin-text)", fontWeight: 600 }}
              />
              <Bar dataKey="sales" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ── Template Performance Table ── */}
      <div className="admin-card overflow-hidden">

        {/* Table Header */}
        <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4 border-b border-[var(--admin-border)]">
          <div>
            <p className="fs8 font-bold text-[var(--admin-text)] m-0">Template Performance</p>
            <p className="fs10 text-[var(--admin-muted)] mt-0.5 m-0">{rows.length} templates</p>
          </div>
          <Dropdown options={["All","Active","Paused","Inactive"]} value={filter} onChange={setFilter} />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--admin-border)]">
                {["Template","Category","Sales","Revenue","Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 fs10 font-semibold text-[var(--admin-muted)] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[var(--admin-hover)] transition-colors duration-150"
                >
                  <td className="px-5 py-3.5 fs9 font-semibold text-[var(--admin-text)]">{row.name}</td>
                  <td className="px-5 py-3.5 fs10 text-[var(--admin-muted)]">{row.category}</td>
                  <td className="px-5 py-3.5 fs9 font-medium text-[var(--admin-subtext)]">{row.sales}</td>
                  <td className="px-5 py-3.5 fs9 font-bold text-[var(--admin-accent)]">{row.revenue}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full fs10 font-semibold ${statusCls[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}