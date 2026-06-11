import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../utils/axiosSecure";
import { FileText, CheckCircle, Clock, XCircle, CreditCard } from "lucide-react";
import { Link } from "react-router";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const statusColor = {
  pending: "badge-warning",
  "in-progress": "badge-info",
  resolved: "badge-success",
  rejected: "badge-error",
};

const COLORS = ["#f59e0b", "#10b981", "#ef4444"]; // Pending, Resolved, Rejected

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stats/admin");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg" style={{ color: "var(--color-primary)" }} />
      </div>
    );

  const statCards = [
    { label: "Total Issues", value: stats?.totalIssues || 0, icon: <FileText size={22} />, color: "bg-blue-50 text-blue-600" },
    { label: "Pending", value: stats?.pending || 0, icon: <Clock size={22} />, color: "bg-yellow-50 text-yellow-600" },
    { label: "Resolved", value: stats?.resolved || 0, icon: <CheckCircle size={22} />, color: "bg-green-50 text-green-600" },
    { label: "Rejected", value: stats?.rejected || 0, icon: <XCircle size={22} />, color: "bg-red-50 text-red-500" },
    { label: "Revenue", value: `৳${stats?.totalRevenue || 0}`, icon: <CreditCard size={22} />, color: "bg-teal-50 text-teal-600" },
  ];

  const pieData = [
    { name: "Pending", value: stats?.pending || 0 },
    { name: "Resolved", value: stats?.resolved || 0 },
    { name: "Rejected", value: stats?.rejected || 0 },
  ].filter(d => d.value > 0);

  const barData = [
    { name: "Pending", count: stats?.pending || 0 },
    { name: "Resolved", count: stats?.resolved || 0 },
    { name: "Rejected", count: stats?.rejected || 0 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-heading)" }}>Admin Dashboard</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>System-wide overview and management.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="cs-surface p-4 flex flex-col items-center gap-2"
          >
            <div className={`p-2 rounded-xl ${s.color}`}>{s.icon}</div>
            <p className="text-xl sm:text-2xl font-bold" style={{ color: "var(--color-text-heading)" }}>{s.value}</p>
            <p className="text-xs text-center leading-tight" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="cs-surface p-6 flex flex-col items-center">
          <h2 className="text-lg font-bold w-full mb-4" style={{ color: "var(--color-text-heading)" }}>System Issues Overview</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-body)" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm" style={{ color: "var(--color-text-muted)" }}>No data available</div>
          )}
        </div>

        <div className="cs-surface p-6 flex flex-col items-center">
          <h2 className="text-lg font-bold w-full mb-4" style={{ color: "var(--color-text-heading)" }}>Issues by Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "var(--color-surface-hover)" }} contentStyle={{ borderRadius: "12px", backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-body)" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Issues */}
        <div className="cs-surface p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold" style={{ color: "var(--color-text-heading)" }}>Latest Issues</h2>
            <Link to="/dashboard/all-issues-admin" className="text-sm font-medium hover:underline whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
              View All →
            </Link>
          </div>
          {stats?.latestIssues?.map((issue) => (
            <div
              key={issue._id}
              className="flex justify-between items-center py-2 border-b last:border-0 gap-2"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate max-w-[180px] sm:max-w-[240px]" style={{ color: "var(--color-text-heading)" }}>
                  {issue.title}
                </p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{issue.category}</p>
              </div>
              <span className={`badge badge-sm ${statusColor[issue.status]} capitalize flex-shrink-0`}>
                {issue.status}
              </span>
            </div>
          ))}
        </div>

        {/* Latest Payments */}
        <div className="cs-surface p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold" style={{ color: "var(--color-text-heading)" }}>Latest Payments</h2>
            <Link to="/dashboard/payments" className="text-sm font-medium hover:underline whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
              View All →
            </Link>
          </div>
          {stats?.latestPayments?.map((p) => (
            <div
              key={p._id}
              className="flex justify-between items-center py-2 border-b last:border-0 gap-2"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate max-w-[180px] sm:max-w-[240px]" style={{ color: "var(--color-text-heading)" }}>
                  {p.userEmail}
                </p>
                <p className="text-xs capitalize" style={{ color: "var(--color-text-muted)" }}>{p.type}</p>
              </div>
              <span className="font-bold flex-shrink-0" style={{ color: "var(--color-text-heading)" }}>৳{p.amount}</span>
            </div>
          ))}
        </div>

        {/* Latest Users */}
        <div className="cs-surface p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold" style={{ color: "var(--color-text-heading)" }}>Latest Users</h2>
            <Link to="/dashboard/manage-users" className="text-sm font-medium hover:underline whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats?.latestUsers?.map((u) => (
              <div key={u._id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-hover)" }}>
                <div className="avatar placeholder flex-shrink-0">
                  <div className="w-9 rounded-full" style={{ backgroundColor: "var(--color-primary)", color: "var(--color-bg)" }}>
                    <span className="text-sm">{u.name?.charAt(0) || u.email?.charAt(0)}</span>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text-heading)" }}>{u.name || "User"}</p>
                  <p className="text-xs capitalize" style={{ color: "var(--color-text-muted)" }}>{u.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;