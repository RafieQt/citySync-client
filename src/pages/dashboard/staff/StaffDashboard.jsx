import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import axiosSecure from "../../../utils/axiosSecure";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { ClipboardList, CheckCircle, Eye } from "lucide-react";
import { useState } from "react";

const statusColor = {
  pending: "badge-warning",
  "in-progress": "badge-info",
  resolved: "badge-success",
  rejected: "badge-error",
};

const STATUS_OPTIONS = ["pending", "in-progress", "resolved", "rejected"];

const StaffDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("All");

  const { data: stats } = useQuery({
    queryKey: ["staffStats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/stats/staff/${user.email}`);
      return res.data;
    },
  });

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["assignedIssues", user?.email, filter],
    enabled: !!user?.email,
    queryFn: async () => {
      const params = {};
      if (filter !== "All") params.status = filter;
      const res = await axiosSecure.get(`/issues/staff/${user.email}`, { params });
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      axiosSecure.patch(`/issues/${id}`, {
        status,
        timelineEntry: {
          status: status.charAt(0).toUpperCase() + status.slice(1),
          message: `Status updated to ${status} by staff`,
          updatedBy: user.email,
          role: "staff",
          date: new Date(),
        },
      }),
    onSuccess: () => {
      toast.success("Status updated!");
      queryClient.invalidateQueries(["assignedIssues"]);
    },
    onError: () => toast.error("Update failed"),
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#03373D]">Staff Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your assigned issues.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center gap-2 border border-gray-100">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><ClipboardList size={22} /></div>
          <p className="text-2xl font-bold text-[#03373D]">{stats?.assigned || 0}</p>
          <p className="text-xs text-gray-500">Total Assigned</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center gap-2 border border-gray-100">
          <div className="p-2 rounded-xl bg-green-50 text-green-600"><CheckCircle size={22} /></div>
          <p className="text-2xl font-bold text-[#03373D]">{stats?.resolved || 0}</p>
          <p className="text-xs text-gray-500">Resolved</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        {["All", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`btn btn-sm rounded-xl capitalize ${filter === s ? "bg-[#03373D] text-white border-none" : "btn-outline"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Issues Table */}
      {isLoading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-[#03373D]" /></div>
      ) : issues.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400">
          No assigned issues.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-[#03373D] bg-[#EAF8F7]">
                <th>Issue</th>
                <th>Category</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Change Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue._id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={issue.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                      <p className="font-medium text-sm max-w-[140px] truncate">{issue.title}</p>
                    </div>
                  </td>
                  <td className="text-xs text-gray-500">{issue.category}</td>
                  <td className="text-xs text-gray-500 max-w-[100px] truncate">{issue.location}</td>
                  <td>
                    <span className={`badge badge-sm capitalize ${issue.priority === "high" ? "badge-error text-white" : "badge-ghost"}`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td><span className={`badge badge-sm ${statusColor[issue.status]} capitalize`}>{issue.status}</span></td>
                  <td>
                    <select
                      defaultValue={issue.status}
                      onChange={(e) => updateStatusMutation.mutate({ id: issue._id, status: e.target.value })}
                      className="select select-xs select-bordered rounded-lg"
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <Link to={`/issues/${issue._id}`}>
                      <button className="btn btn-xs btn-ghost rounded-lg text-[#03373D]"><Eye size={14} /></button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;