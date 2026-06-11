import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useUser from "../../../hooks/useUser";
import axiosSecure from "../../../utils/axiosSecure";
import { normalizeIssuesList } from "../../../utils/normalizeIssues";
import { Link } from "react-router";
import { FileText, Clock, Wrench, CheckCircle, CreditCard } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const statusColor = {
  pending: "badge-warning",
  "in-progress": "badge-info",
  resolved: "badge-success",
  rejected: "badge-error",
};

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"]; // Pending, In Progress, Resolved, Rejected

const CitizenDashboard = () => {
  const { user } = useAuth();
  const { dbUser } = useUser();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["citizenStats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/stats/citizen/${user.email}`);
      return res.data;
    },
  });

  const { data: recentIssues } = useQuery({
    queryKey: ["myIssues", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/user/${user.email}`);
      return normalizeIssuesList(res.data).slice(0, 5);
    },
  });

  if (isLoading) return <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg" style={{ color: "var(--color-primary)" }} /></div>;

  const statCards = [
    { label: "Total Issues", value: stats?.total || 0, icon: <FileText size={22} />, color: "bg-blue-50 text-blue-600" },
    { label: "Pending", value: stats?.pending || 0, icon: <Clock size={22} />, color: "bg-yellow-50 text-yellow-600" },
    { label: "In Progress", value: stats?.inProgress || 0, icon: <Wrench size={22} />, color: "bg-purple-50 text-purple-600" },
    { label: "Resolved", value: stats?.resolved || 0, icon: <CheckCircle size={22} />, color: "bg-green-50 text-green-600" },
    { label: "Total Payments", value: `৳${stats?.totalPayments || 0}`, icon: <CreditCard size={22} />, color: "bg-teal-50 text-teal-600" },
  ];

  const pieData = [
    { name: "Pending", value: stats?.pending || 0 },
    { name: "In Progress", value: stats?.inProgress || 0 },
    { name: "Resolved", value: stats?.resolved || 0 },
    { name: "Rejected", value: stats?.rejected || 0 },
  ].filter(d => d.value > 0);

  const barData = [
    { name: "Pending", count: stats?.pending || 0 },
    { name: "In Progress", count: stats?.inProgress || 0 },
    { name: "Resolved", count: stats?.resolved || 0 },
    { name: "Rejected", count: stats?.rejected || 0 },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-heading)" }}>Welcome back, {user?.displayName?.split(" ")[0]}! 👋</h1>
        <p className="mt-1" style={{ color: "var(--color-text-muted)" }}>Here's an overview of your reported issues.</p>
        {!dbUser?.isPremium && (
          <div className="alert alert-warning mt-3 max-w-lg">
            <span>You're on the free plan (max 3 issues). <Link to="/dashboard/subscription" className="font-bold underline">Upgrade to Premium</Link> for unlimited.</span>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="cs-surface p-4 flex flex-col items-center gap-2">
            <div className={`p-2 rounded-xl ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-bold" style={{ color: "var(--color-text-heading)" }}>{s.value}</p>
            <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="cs-surface p-6 flex flex-col items-center">
          <h2 className="text-lg font-bold w-full mb-4" style={{ color: "var(--color-text-heading)" }}>Issues by Status</h2>
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
          <h2 className="text-lg font-bold w-full mb-4" style={{ color: "var(--color-text-heading)" }}>Status Breakdown</h2>
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

      {/* Recent Issues */}
      <div className="cs-surface p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold" style={{ color: "var(--color-text-heading)" }}>Recent Issues</h2>
          <Link to="/dashboard/my-issues" className="text-sm font-medium hover:underline" style={{ color: "var(--color-primary)" }}>View All →</Link>
        </div>
        {!recentIssues?.length ? (
          <div className="text-center py-8" style={{ color: "var(--color-text-muted)" }}>
            <p>No issues yet. <Link to="/submitIssue" className="font-bold underline" style={{ color: "var(--color-primary)" }}>Report your first issue!</Link></p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr style={{ color: "var(--color-text-heading)" }}>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--color-text-body)" }}>
                {recentIssues.map((issue) => (
                  <tr key={issue._id}>
                    <td className="font-medium max-w-[180px] truncate">{issue.title}</td>
                    <td className="text-xs" style={{ color: "var(--color-text-muted)" }}>{issue.category}</td>
                    <td><span className={`badge badge-sm ${statusColor[issue.status]} capitalize`}>{issue.status}</span></td>
                    <td className="text-xs" style={{ color: "var(--color-text-muted)" }}>{new Date(issue.createdAt).toLocaleDateString()}</td>
                    <td><Link to={`/issues/${issue._id}`} className="cs-btn-outline" style={{ padding: "2px 8px", fontSize: "0.75rem", borderRadius: "8px" }}>View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;