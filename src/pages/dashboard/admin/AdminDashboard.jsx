import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../utils/axiosSecure";
import { FileText, CheckCircle, Clock, XCircle, CreditCard } from "lucide-react";
import { Link } from "react-router";

const statusColor = {
  pending: "badge-warning",
  "in-progress": "badge-info",
  resolved: "badge-success",
  rejected: "badge-error",
};

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
        <span className="loading loading-spinner loading-lg text-[#03373D]" />
      </div>
    );

  const statCards = [
    { label: "Total Issues", value: stats?.totalIssues || 0, icon: <FileText size={22} />, color: "bg-blue-50 text-blue-600" },
    { label: "Pending", value: stats?.pending || 0, icon: <Clock size={22} />, color: "bg-yellow-50 text-yellow-600" },
    { label: "Resolved", value: stats?.resolved || 0, icon: <CheckCircle size={22} />, color: "bg-green-50 text-green-600" },
    { label: "Rejected", value: stats?.rejected || 0, icon: <XCircle size={22} />, color: "bg-red-50 text-red-500" },
    { label: "Revenue", value: `৳${stats?.totalRevenue || 0}`, icon: <CreditCard size={22} />, color: "bg-teal-50 text-teal-600" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#03373D]">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">System-wide overview and management.</p>
      </div>

      {/* Stat Cards — 2-col on mobile, 3 on md, 5 on lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center gap-2 border border-gray-100"
          >
            <div className={`p-2 rounded-xl ${s.color}`}>{s.icon}</div>
            <p className="text-xl sm:text-2xl font-bold text-[#03373D]">{s.value}</p>
            <p className="text-xs text-gray-500 text-center leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Issues */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-[#03373D]">Latest Issues</h2>
            <Link to="/dashboard/all-issues-admin" className="text-sm text-[#03373D] hover:underline whitespace-nowrap">
              View All →
            </Link>
          </div>
          {stats?.latestIssues?.map((issue) => (
            <div
              key={issue._id}
              className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 gap-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#03373D] truncate max-w-[180px] sm:max-w-[240px]">
                  {issue.title}
                </p>
                <p className="text-xs text-gray-400">{issue.category}</p>
              </div>
              <span className={`badge badge-sm ${statusColor[issue.status]} capitalize flex-shrink-0`}>
                {issue.status}
              </span>
            </div>
          ))}
        </div>

        {/* Latest Payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-[#03373D]">Latest Payments</h2>
            <Link to="/dashboard/payments" className="text-sm text-[#03373D] hover:underline whitespace-nowrap">
              View All →
            </Link>
          </div>
          {stats?.latestPayments?.map((p) => (
            <div
              key={p._id}
              className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 gap-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#03373D] truncate max-w-[180px] sm:max-w-[240px]">
                  {p.userEmail}
                </p>
                <p className="text-xs text-gray-400 capitalize">{p.type}</p>
              </div>
              <span className="font-bold text-[#03373D] flex-shrink-0">৳{p.amount}</span>
            </div>
          ))}
        </div>

        {/* Latest Users */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-[#03373D]">Latest Users</h2>
            <Link to="/dashboard/manage-users" className="text-sm text-[#03373D] hover:underline whitespace-nowrap">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats?.latestUsers?.map((u) => (
              <div key={u._id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                <div className="avatar placeholder flex-shrink-0">
                  <div className="w-9 rounded-full bg-[#03373D] text-white">
                    <span className="text-sm">{u.name?.charAt(0) || u.email?.charAt(0)}</span>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold truncate">{u.name || "User"}</p>
                  <p className="text-xs text-gray-400 capitalize">{u.role}</p>
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