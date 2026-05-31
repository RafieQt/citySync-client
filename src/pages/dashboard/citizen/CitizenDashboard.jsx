import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useUser from "../../../hooks/useUser";
import axiosSecure from "../../../utils/axiosSecure";
import { Link } from "react-router";
import { FileText, Clock, Wrench, CheckCircle, CreditCard } from "lucide-react";

const statusColor = {
  pending: "badge-warning",
  "in-progress": "badge-info",
  resolved: "badge-success",
  rejected: "badge-error",
};

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
      return res.data.slice(0, 5);
    },
  });

  if (isLoading) return <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-[#03373D]" /></div>;

  const statCards = [
    { label: "Total Issues", value: stats?.total || 0, icon: <FileText size={22} />, color: "bg-blue-50 text-blue-600" },
    { label: "Pending", value: stats?.pending || 0, icon: <Clock size={22} />, color: "bg-yellow-50 text-yellow-600" },
    { label: "In Progress", value: stats?.inProgress || 0, icon: <Wrench size={22} />, color: "bg-purple-50 text-purple-600" },
    { label: "Resolved", value: stats?.resolved || 0, icon: <CheckCircle size={22} />, color: "bg-green-50 text-green-600" },
    { label: "Total Payments", value: `৳${stats?.totalPayments || 0}`, icon: <CreditCard size={22} />, color: "bg-teal-50 text-teal-600" },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#03373D]">Welcome back, {user?.displayName?.split(" ")[0]}! 👋</h1>
        <p className="text-gray-500 mt-1">Here's an overview of your reported issues.</p>
        {!dbUser?.isPremium && (
          <div className="alert alert-warning mt-3 max-w-lg">
            <span>You're on the free plan (max 3 issues). <Link to="/dashboard/subscription" className="font-bold underline">Upgrade to Premium</Link> for unlimited.</span>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center gap-2 border border-gray-100">
            <div className={`p-2 rounded-xl ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-bold text-[#03373D]">{s.value}</p>
            <p className="text-xs text-gray-500 text-center">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Issues */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#03373D]">Recent Issues</h2>
          <Link to="/dashboard/my-issues" className="text-sm text-[#03373D] hover:underline font-medium">View All →</Link>
        </div>
        {!recentIssues?.length ? (
          <div className="text-center py-8 text-gray-400">
            <p>No issues yet. <Link to="/submitIssue" className="text-[#03373D] font-bold underline">Report your first issue!</Link></p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="text-[#03373D]">
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentIssues.map((issue) => (
                  <tr key={issue._id}>
                    <td className="font-medium max-w-[180px] truncate">{issue.title}</td>
                    <td className="text-gray-500 text-xs">{issue.category}</td>
                    <td><span className={`badge badge-sm ${statusColor[issue.status]} capitalize`}>{issue.status}</span></td>
                    <td className="text-gray-400 text-xs">{new Date(issue.createdAt).toLocaleDateString()}</td>
                    <td><Link to={`/issues/${issue._id}`} className="btn btn-xs btn-outline rounded-lg">View</Link></td>
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