import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import axiosSecure from "../../../utils/axiosSecure";
import { normalizeIssuesList } from "../../../utils/normalizeIssues";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { Trash2, Eye, PlusCircle } from "lucide-react";
import { useState } from "react";

const statusColor = {
  pending: "badge-warning",
  "in-progress": "badge-info",
  resolved: "badge-success",
  rejected: "badge-error",
};

const MyIssues = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("All");

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["myIssues", user?.email, filter],
    enabled: !!user?.email,
    queryFn: async () => {
      const params = {};
      if (filter !== "All") params.status = filter;
      const res = await axiosSecure.get(`/issues/user/${user.email}`, { params });
      return normalizeIssuesList(res.data);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/issues/${id}`),
    onSuccess: () => {
      toast.success("Issue deleted");
      queryClient.invalidateQueries(["myIssues"]);
    },
    onError: () => toast.error("Delete failed"),
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-heading)" }}>My Issues</h1>
        <Link to="/submitIssue">
          <button className="cs-btn-primary gap-2 rounded-xl">
            <PlusCircle size={18} /> Report New Issue
          </button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {["All", "pending", "in-progress", "resolved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`btn btn-sm px-3 rounded-xl capitalize ${filter === s ? "" : "btn-outline"}`}
            style={{
              backgroundColor: filter === s ? "var(--color-primary)" : "transparent",
              color: filter === s ? "var(--color-bg)" : "var(--color-text-body)",
              borderColor: filter === s ? "transparent" : "var(--color-border)",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg" style={{ color: "var(--color-primary)" }} /></div>
      ) : issues.length === 0 ? (
        <div className="text-center py-16 cs-surface">
          <p className="text-lg mb-3" style={{ color: "var(--color-text-muted)" }}>No issues found.</p>
          <Link to="/submitIssue">
            <button className="cs-btn-primary rounded-xl">Report an Issue</button>
          </Link>
        </div>
      ) : (
        <div className="cs-surface overflow-x-auto">
          <table className="table">
            <thead>
              <tr style={{ color: "var(--color-text-heading)", backgroundColor: "var(--color-surface-hover)" }}>
                <th>Issue</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Upvotes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--color-text-body)" }}>
              {issues.map((issue) => (
                <tr key={issue._id} className="hover" style={{ borderColor: "var(--color-border)" }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={issue.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                      <p className="font-medium text-sm max-w-[150px] truncate">{issue.title}</p>
                    </div>
                  </td>
                  <td className="text-xs" style={{ color: "var(--color-text-muted)" }}>{issue.category}</td>
                  <td><span className={`badge badge-sm ${statusColor[issue.status]} capitalize`}>{issue.status}</span></td>
                  <td>
                    <span className={`badge badge-sm capitalize ${issue.priority === "high" ? "badge-error text-white" : "badge-ghost"}`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="text-xs" style={{ color: "var(--color-text-muted)" }}>{new Date(issue.createdAt).toLocaleDateString()}</td>
                  <td className="text-center font-semibold" style={{ color: "var(--color-text-heading)" }}>{issue.upvotes?.length || 0}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/issues/${issue._id}`}>
                        <button className="cs-btn-outline" style={{ padding: "2px 8px", fontSize: "0.75rem", borderRadius: "8px" }}><Eye size={14} /></button>
                      </Link>
                      <button
                        onClick={() => handleDelete(issue._id)}
                        className="cs-btn-outline"
                        style={{ padding: "2px 8px", fontSize: "0.75rem", borderRadius: "8px", borderColor: "#ef4444", color: "#ef4444" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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

export default MyIssues;