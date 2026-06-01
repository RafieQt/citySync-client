import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../../utils/axiosSecure";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link } from "react-router";
import { Eye } from "lucide-react";
import useAuth from "../../../hooks/useAuth";

const statusColor = {
  pending: "badge-warning",
  "in-progress": "badge-info",
  resolved: "badge-success",
  rejected: "badge-error",
};

const STATUS_OPTIONS = ["pending", "in-progress", "resolved", "rejected"];

const AdminAllIssues = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["adminIssues", filter, page],
    queryFn: async () => {
      const params = { page, limit };
      if (filter !== "All") params.status = filter;
      const res = await axiosSecure.get("/issues", { params });
      return res.data;
    },
  });

  const { data: staffList = [] } = useQuery({
    queryKey: ["staffList"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users?role=staff");
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => axiosSecure.patch(`/issues/${id}`, updates),
    onSuccess: () => {
      toast.success("Issue updated!");
      queryClient.invalidateQueries(["adminIssues"]);
    },
    onError: () => toast.error("Update failed"),
  });

  const handleStatusChange = (id, status) => {
    updateMutation.mutate({
      id,
      updates: {
        status,
        timelineEntry: {
          status: status.charAt(0).toUpperCase() + status.slice(1),
          message: `Status changed to ${status} by admin`,
          updatedBy: user.email,
          role: "admin",
          date: new Date(),
        },
      },
    });
  };

  const handleAssignStaff = (id, staffEmail) => {
    const staff = staffList.find((s) => s.email === staffEmail);
    if (!staff) return;
    updateMutation.mutate({
      id,
      updates: {
        assignedStaff: { name: staff.name, email: staff.email },
        status: "in-progress",
        timelineEntry: {
          status: "Assigned",
          message: `Issue assigned to staff: ${staff.name}`,
          updatedBy: user.email,
          role: "admin",
          date: new Date(),
        },
      },
    });
  };

  const issues = data?.result || [];
  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-[#03373D]">All Issues</h1>
        <span className="badge badge-lg badge-ghost">{data?.total || 0} total</span>
      </div>

      {/* Filter tabs — scroll horizontally on mobile */}
      <div className="flex gap-2 flex-nowrap overflow-x-auto pb-2 mb-5 scrollbar-none">
        {["All", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`btn px-3 btn-sm rounded-xl capitalize whitespace-nowrap flex-shrink-0 ${
              filter === s ? "bg-[#03373D] text-white border-none" : "btn-outline"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-[#03373D]" />
        </div>
      ) : (
        <>
          {/* ── Desktop table (md+) ── */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="text-[#03373D] bg-[#EAF8F7]">
                  <th>Issue</th>
                  <th>Reported By</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Change Status</th>
                  <th>Assign Staff</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue._id} className="hover">
                    <td>
                      <div className="flex items-center gap-2">
                        <img src={issue.image} className="w-9 h-9 rounded-lg object-cover" alt="" />
                        <p className="font-medium text-xs max-w-[120px] truncate">{issue.title}</p>
                      </div>
                    </td>
                    <td className="text-xs text-gray-500 max-w-[100px] truncate">{issue.userEmail}</td>
                    <td className="text-xs text-gray-500">{issue.category}</td>
                    <td>
                      <span className={`badge badge-sm capitalize ${issue.priority === "high" ? "badge-error text-white" : "badge-ghost"}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-sm ${statusColor[issue.status]} capitalize`}>{issue.status}</span>
                    </td>
                    <td>
                      <select
                        defaultValue={issue.status}
                        onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                        className="select select-xs select-bordered rounded-lg"
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <select
                        defaultValue={issue.assignedStaff?.email || ""}
                        onChange={(e) => handleAssignStaff(issue._id, e.target.value)}
                        className="select select-xs select-bordered rounded-lg"
                      >
                        <option value="" disabled>Assign</option>
                        {staffList.map((s) => <option key={s.email} value={s.email}>{s.name}</option>)}
                      </select>
                    </td>
                    <td>
                      <Link to={`/issues/${issue._id}`}>
                        <button className="btn px-2 btn-xs btn-ghost rounded-lg text-[#03373D]">
                          <Eye size={14} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards (< md) ── */}
          <div className="flex flex-col gap-3 md:hidden">
            {issues.map((issue) => (
              <div key={issue._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                {/* Header row */}
                <div className="flex items-start gap-3 mb-3">
                  <img src={issue.image} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#03373D] truncate">{issue.title}</p>
                    <p className="text-xs text-gray-400 truncate">{issue.userEmail}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span className="badge badge-xs badge-ghost">{issue.category}</span>
                      <span className={`badge badge-xs capitalize ${issue.priority === "high" ? "badge-error text-white" : "badge-ghost"}`}>
                        {issue.priority}
                      </span>
                      <span className={`badge badge-xs ${statusColor[issue.status]} capitalize`}>{issue.status}</span>
                    </div>
                  </div>
                  <Link to={`/issues/${issue._id}`}>
                    <button className="btn btn-xs btn-ghost rounded-lg text-[#03373D] p-1">
                      <Eye size={15} />
                    </button>
                  </Link>
                </div>

                {/* Controls row */}
                <div className="flex gap-2 flex-wrap">
                  <div className="flex-1 min-w-[130px]">
                    <p className="text-[10px] text-gray-400 mb-1 font-medium uppercase tracking-wide">Change Status</p>
                    <select
                      defaultValue={issue.status}
                      onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                      className="select select-xs select-bordered rounded-lg w-full"
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[130px]">
                    <p className="text-[10px] text-gray-400 mb-1 font-medium uppercase tracking-wide">Assign Staff</p>
                    <select
                      defaultValue={issue.assignedStaff?.email || ""}
                      onChange={(e) => handleAssignStaff(issue._id, e.target.value)}
                      className="select select-xs select-bordered rounded-lg w-full"
                    >
                      <option value="" disabled>Assign</option>
                      {staffList.map((s) => <option key={s.email} value={s.email}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="btn btn-sm btn-outline rounded-xl px-3"
          >
            « Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`btn btn-sm px-3 rounded-xl ${p === page ? "bg-[#03373D] text-white border-none" : "btn-outline"}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="btn btn-sm btn-outline rounded-xl px-3"
          >
            Next »
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminAllIssues;