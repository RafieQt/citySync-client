import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import axiosSecure from "../../utils/axiosSecure";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { Search, ChevronUp, MapPin, Tag, Calendar } from "lucide-react";

const CATEGORIES = ["All", "Road Damage", "Streetlight", "Water Leakage", "Garbage Overflow", "Footpath Damage", "Drainage", "Traffic Signal", "Other"];
const STATUSES = ["All", "pending", "in-progress", "resolved", "rejected"];
const PRIORITIES = ["All", "normal", "high"];

const statusBadgeClass = {
  resolved: "cs-badge cs-badge--resolved",
  pending: "cs-badge cs-badge--pending",
  "in-progress": "cs-badge cs-badge--progress",
  rejected: "cs-badge cs-badge--rejected",
};

/* Skeleton placeholder card */
const SkeletonCard = () => (
  <div className="cs-skeleton-card" style={{ height: 360 }}>
    <div className="cs-skeleton" style={{ height: 180 }} />
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <div className="cs-skeleton" style={{ height: 14, width: "40%" }} />
      <div className="cs-skeleton" style={{ height: 18, width: "80%" }} />
      <div className="cs-skeleton" style={{ height: 14, width: "90%" }} />
      <div className="cs-skeleton" style={{ height: 14, width: "70%" }} />
      <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
        <div className="cs-skeleton" style={{ height: 12, width: "30%" }} />
        <div className="cs-skeleton" style={{ height: 12, width: "25%" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <div className="cs-skeleton" style={{ height: 28, width: "28%" }} />
        <div className="cs-skeleton" style={{ height: 32, width: "36%", borderRadius: 8 }} />
      </div>
    </div>
  </div>
);

const AllIssues = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 8; // Change to 8 to perfectly fit 4-col grid rows

  const { data, isLoading } = useQuery({
    queryKey: ["allIssues", search, category, status, priority, page],
    queryFn: async () => {
      const params = { page, limit };
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      if (status !== "All") params.status = status;
      if (priority !== "All") params.priority = priority;
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/issues`, { params });
      return res.data;
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: (issueId) =>
      axiosSecure.patch(`/issues/${issueId}/upvote`, { email: user.email }),
    onSuccess: () => {
      toast.success("Upvoted!");
      queryClient.invalidateQueries(["allIssues"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not upvote"),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 1;
  const issues = data?.result || [];

  return (
    <div className="min-h-screen py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "var(--color-text-heading)" }}>
          All Reported Issues
        </h1>
        <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--color-text-muted)" }}>
          Browse, search, and upvote city issues
        </p>
      </div>

      {/* Search & Filters */}
      <div className="max-w-6xl mx-auto mb-10 p-4 rounded-2xl cs-surface flex flex-col md:flex-row gap-3 flex-wrap items-center">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex flex-1 w-full min-w-[200px] gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title, location..."
            className="input input-bordered w-full cs-input"
          />
          <button type="submit" className="cs-btn-primary" style={{ padding: "0 14px" }}>
            <Search size={18} />
          </button>
        </form>

        <div className="flex gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
          {/* Category */}
          <select
            value={category}
            onChange={handleFilterChange(setCategory)}
            className="select select-bordered cs-input flex-1"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={handleFilterChange(setStatus)}
            className="select select-bordered cs-input flex-1"
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>

          {/* Priority */}
          <select
            value={priority}
            onChange={handleFilterChange(setPriority)}
            className="select select-bordered cs-input flex-1"
          >
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        {/* Reset */}
        <button
          onClick={() => { setCategory("All"); setStatus("All"); setPriority("All"); setSearch(""); setSearchInput(""); setPage(1); }}
          className="cs-btn-outline w-full md:w-auto"
        >
          Reset
        </button>
      </div>

      {/* Issues Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-20 text-xl" style={{ color: "var(--color-text-muted)" }}>
          No issues found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {issues.map((issue) => {
            const alreadyUpvoted = issue.upvotes?.includes(user?.email);
            const isOwner = issue.userEmail === user?.email;

            return (
              <article key={issue._id} className="cs-issue-card">
                {/* Image */}
                <div style={{ height: 180, overflow: "hidden", flexShrink: 0 }}>
                  <img
                    src={issue.image}
                    alt={issue.title}
                    className="cs-issue-card__image"
                    style={{ height: 180 }}
                  />
                </div>

                {/* Body */}
                <div className="cs-issue-card__body">
                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap mb-1">
                    <span className={statusBadgeClass[issue.status] || "cs-badge"}>
                      {issue.status}
                    </span>
                    {issue.priority === "high" && (
                      <span className="cs-badge cs-badge--boosted">🔥 Boosted</span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="cs-issue-card__title">{issue.title}</h3>

                  {/* Description */}
                  <p className="cs-issue-card__description">{issue.description}</p>

                  {/* Meta */}
                  <div className="cs-issue-card__meta">
                    <div className="cs-issue-card__meta-row">
                      <Tag size={11} />
                      <span>{issue.category}</span>
                    </div>
                    <div className="cs-issue-card__meta-row">
                      <MapPin size={11} />
                      <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                        {issue.location}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="cs-issue-card__actions">
                    <button
                      onClick={() => {
                        if (!user) return toast.error("Login to upvote");
                        if (isOwner) return toast.error("Can't upvote your own issue");
                        if (alreadyUpvoted) return toast.error("Already upvoted");
                        upvoteMutation.mutate(issue._id);
                      }}
                      className={alreadyUpvoted ? "cs-btn-primary" : "cs-btn-outline"}
                      style={{ padding: "4px 10px", fontSize: "0.8rem", gap: "4px" }}
                    >
                      <ChevronUp size={14} />
                      {issue.upvotes?.length || 0}
                    </button>

                    <Link to={`/issues/${issue._id}`}>
                      <button className="cs-btn-primary" style={{ fontSize: "0.8rem", padding: "6px 14px" }}>
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="cs-btn-outline"
            style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}
          >
            « Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={p === page ? "cs-btn-primary" : "cs-btn-outline"}
              style={{ padding: "6px 14px" }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="cs-btn-outline"
            style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}
          >
            Next »
          </button>
        </div>
      )}
    </div>
  );
};

export default AllIssues;