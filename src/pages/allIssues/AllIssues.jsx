import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import axiosSecure from "../../utils/axiosSecure";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { Search, ChevronUp, MapPin, Tag } from "lucide-react";

const CATEGORIES = ["All", "Road Damage", "Streetlight", "Water Leakage", "Garbage Overflow", "Footpath Damage", "Drainage", "Traffic Signal", "Other"];
const STATUSES = ["All", "pending", "in-progress", "resolved", "rejected"];
const PRIORITIES = ["All", "normal", "high"];

const statusColor = {
  pending: "badge-warning",
  "in-progress": "badge-info",
  resolved: "badge-success",
  rejected: "badge-error",
};

const AllIssues = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 9;

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
    <div className="min-h-screen py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-[#03373D]">All Reported Issues</h1>
        <p className="text-gray-500 mt-2">Browse, search, and upvote city issues</p>
      </div>

      {/* Search & Filters */}
      <div className="max-w-5xl mx-auto mb-8 bg-white rounded-2xl shadow p-4 flex flex-col md:flex-row gap-3 flex-wrap">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex flex-1 min-w-[200px] gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title, location..."
            className="input input-bordered w-full rounded-xl"
          />
          <button type="submit" className="btn px-2 bg-[#03373D] text-white border-none rounded-xl">
            <Search size={18} />
          </button>
        </form>

        {/* Category */}
        <select
          value={category}
          onChange={handleFilterChange(setCategory)}
          className="select select-bordered rounded-xl"
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={handleFilterChange(setStatus)}
          className="select select-bordered rounded-xl"
        >
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>

        {/* Priority */}
        <select
          value={priority}
          onChange={handleFilterChange(setPriority)}
          className="select select-bordered rounded-xl"
        >
          {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>

        {/* Reset */}
        <button
          onClick={() => { setCategory("All"); setStatus("All"); setPriority("All"); setSearch(""); setSearchInput(""); setPage(1); }}
          className="btn px-2 btn-outline rounded-xl"
        >
          Reset
        </button>
      </div>

      {/* Issues Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-[#03373D]" />
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-xl">No issues found.</div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => {
            const alreadyUpvoted = issue.upvotes?.includes(user?.email);
            const isOwner = issue.userEmail === user?.email;
            return (
              <div key={issue._id} className="card bg-white shadow-md rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <figure className="h-48 overflow-hidden rounded-t-2xl">
                  <img src={issue.image} alt={issue.title} className="w-full h-full object-cover" />
                </figure>
                <div className="card-body p-4">
                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap mb-1">
                    <span className={`badge badge-sm ${statusColor[issue.status] || "badge-ghost"} capitalize`}>
                      {issue.status}
                    </span>
                    {issue.priority === "high" && (
                      <span className="badge badge-sm badge-error text-white">🔥 Boosted</span>
                    )}
                  </div>

                  <h2 className="card-title text-[#03373D] text-base font-bold leading-tight line-clamp-2">
                    {issue.title}
                  </h2>

                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                    <Tag size={12} />
                    <span>{issue.category}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <MapPin size={12} />
                    <span className="line-clamp-1">{issue.location}</span>
                  </div>

                  <div className="card-actions justify-between items-center mt-3">
                    {/* Upvote */}
                    <button
                      onClick={() => {
                        if (!user) return toast.error("Login to upvote");
                        if (isOwner) return toast.error("Can't upvote your own issue");
                        if (alreadyUpvoted) return toast.error("Already upvoted");
                        upvoteMutation.mutate(issue._id);
                      }}
                      className={`btn btn-sm gap-1 px-2 rounded-xl ${alreadyUpvoted ? "bg-[#03373D] text-white" : "btn-outline border-[#03373D] text-[#03373D]"}`}
                    >
                      <ChevronUp size={16} />
                      {issue.upvotes?.length || 0}
                    </button>

                    <Link to={`/issues/${issue._id}`}>
                      <button className="btn px-2 btn-sm bg-[#03373D] text-white border-none rounded-xl hover:bg-[#05535D]">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-2 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="btn px-2 btn-sm btn-outline rounded-xl"
          >
            « Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`btn px-2 btn-sm rounded-xl ${p === page ? "bg-[#03373D] text-white border-none" : "btn-outline"}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="btn px-2 btn-sm btn-outline rounded-xl"
          >
            Next »
          </button>
        </div>
      )}
    </div>
  );
};

export default AllIssues;