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

const STATUS_OPTIONS = [
  "pending",
  "in-progress",
  "resolved",
  "rejected",
];

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
      queryClient.invalidateQueries({ queryKey: ["adminIssues"] });
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
          message: `Issue assigned to ${staff.name}`,
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
    <div className="w-full overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-heading)" }}>
          All Issues
        </h1>
        <span className="badge badge-lg badge-ghost w-fit">
          {data?.total || 0} total
        </span>
      </div>

      {/* FILTERS */}
      <div className="overflow-x-auto pb-2 mb-6">
        <div className="flex gap-2 w-max">
          {["All", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => {
                setFilter(s);
                setPage(1);
              }}
              className={`btn btn-sm rounded-xl capitalize whitespace-nowrap ${
                filter === s ? "" : "btn-outline"
              }`}
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
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" style={{ color: "var(--color-primary)" }} />
        </div>
      ) : (
        <>
          {/* ========================= */}
          {/* DESKTOP TABLE */}
          {/* ========================= */}

          <div className="hidden lg:block">
            <div className="overflow-x-auto cs-surface">
              <table className="table">
                <thead>
                  <tr style={{ backgroundColor: "var(--color-surface-hover)", color: "var(--color-text-heading)" }}>
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

                <tbody style={{ color: "var(--color-text-body)" }}>
                  {issues.map((issue) => (
                    <tr key={issue._id} className="hover" style={{ borderColor: "var(--color-border)" }}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={issue.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <p className="font-medium max-w-[180px] truncate">
                            {issue.title}
                          </p>
                        </div>
                      </td>

                      <td className="max-w-[180px] truncate text-xs">
                        {issue.userEmail}
                      </td>

                      <td className="text-xs">{issue.category}</td>

                      <td>
                        <span
                          className={`badge capitalize ${
                            issue.priority === "high"
                              ? "badge-error text-white"
                              : "badge-ghost"
                          }`}
                        >
                          {issue.priority}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge capitalize ${
                            statusColor[issue.status]
                          }`}
                        >
                          {issue.status}
                        </span>
                      </td>

                      <td>
                        <select
                          defaultValue={issue.status}
                          onChange={(e) =>
                            handleStatusChange(issue._id, e.target.value)
                          }
                          className="select select-sm select-bordered rounded-xl cs-input"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <select
                          defaultValue={issue.assignedStaff?.email || ""}
                          onChange={(e) =>
                            handleAssignStaff(issue._id, e.target.value)
                          }
                          className="select select-sm select-bordered rounded-xl cs-input"
                        >
                          <option value="" disabled>
                            Assign
                          </option>

                          {staffList.map((s) => (
                            <option key={s.email} value={s.email}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <Link to={`/issues/${issue._id}`}>
                          <button className="btn btn-sm btn-ghost rounded-xl">
                            <Eye size={16} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================= */}
          {/* MOBILE CARDS */}
          {/* ========================= */}

          <div className="lg:hidden flex justify-center">
            <div className="w-full max-w-md space-y-4">
              {issues.map((issue) => (
                <div
                  key={issue._id}
                  className="cs-surface p-4"
                >
                  {/* TOP */}
                  <div className="flex gap-3">
                    <img
                      src={issue.image}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="font-semibold text-sm break-words leading-tight" style={{ color: "var(--color-text-heading)" }}>
                          {issue.title}
                        </h2>

                        <Link to={`/issues/${issue._id}`}>
                          <button className="btn btn-xs btn-ghost rounded-lg">
                            <Eye size={15} />
                          </button>
                        </Link>
                      </div>

                      <p className="text-xs break-all mt-1" style={{ color: "var(--color-text-muted)" }}>
                        {issue.userEmail}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="badge badge-sm badge-ghost">
                          {issue.category}
                        </span>

                        <span
                          className={`badge badge-sm capitalize ${
                            issue.priority === "high"
                              ? "badge-error text-white"
                              : "badge-ghost"
                          }`}
                        >
                          {issue.priority}
                        </span>

                        <span
                          className={`badge badge-sm capitalize ${
                            statusColor[issue.status]
                          }`}
                        >
                          {issue.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CONTROLS */}
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-[11px] font-medium uppercase mb-1" style={{ color: "var(--color-text-muted)" }}>
                        Change Status
                      </p>

                      <select
                        defaultValue={issue.status}
                        onChange={(e) =>
                          handleStatusChange(issue._id, e.target.value)
                        }
                        className="select select-sm select-bordered rounded-xl w-full cs-input"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase mb-1" style={{ color: "var(--color-text-muted)" }}>
                        Assign Staff
                      </p>

                      <select
                        defaultValue={issue.assignedStaff?.email || ""}
                        onChange={(e) =>
                          handleAssignStaff(issue._id, e.target.value)
                        }
                        className="select select-sm select-bordered rounded-xl w-full cs-input"
                      >
                        <option value="" disabled>
                          Assign Staff
                        </option>

                        {staffList.map((s) => (
                          <option key={s.email} value={s.email}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="btn btn-sm btn-outline rounded-xl"
            style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)" }}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`btn btn-sm rounded-xl min-w-[40px] ${p === page ? "" : "btn-outline"}`}
              style={{
                backgroundColor: p === page ? "var(--color-primary)" : "transparent",
                color: p === page ? "var(--color-bg)" : "var(--color-primary)",
                borderColor: p === page ? "transparent" : "var(--color-primary)",
              }}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="btn btn-sm btn-outline rounded-xl"
            style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)" }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminAllIssues;