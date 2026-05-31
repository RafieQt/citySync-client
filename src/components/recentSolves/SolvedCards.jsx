import { Link } from "react-router";
import { MapPin, Tag, Calendar, ChevronUp } from "lucide-react";

const SolvedCards = ({ issue }) => {
  return (
    <div className="card bg-white shadow-md rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
      <figure className="h-44 overflow-hidden rounded-t-2xl">
        <img
          src={issue.image}
          alt={issue.title}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body p-4">
        {/* Status badge */}
        <div className="flex gap-2">
          <span className="badge badge-success badge-sm">✓ Resolved</span>
          {issue.priority === "high" && (
            <span className="badge badge-error badge-sm text-white">🔥 Boosted</span>
          )}
        </div>

        <h2 className="card-title text-[#03373D] text-base font-bold leading-tight line-clamp-2 mt-1">
          {issue.title}
        </h2>

        <p className="text-gray-500 text-xs line-clamp-2">{issue.description}</p>

        <div className="flex flex-col gap-1 mt-2">
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Tag size={12} />
            <span>{issue.category}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <MapPin size={12} />
            <span className="line-clamp-1">{issue.location}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Calendar size={12} />
            <span>{new Date(issue.updatedAt || issue.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="card-actions justify-between items-center mt-3">
          <div className="flex items-center gap-1 text-[#03373D] font-semibold text-sm">
            <ChevronUp size={15} />
            <span>{issue.upvotes?.length || 0}</span>
          </div>
          <Link to={`/issues/${issue._id}`}>
            <button className="btn btn-sm bg-[#03373D] text-white border-none rounded-xl hover:bg-[#05535D]">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SolvedCards;