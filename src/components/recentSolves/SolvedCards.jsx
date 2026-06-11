import { Link } from "react-router";
import { MapPin, Tag, Calendar, ChevronUp } from "lucide-react";

const statusBadgeClass = {
  resolved: "cs-badge cs-badge--resolved",
  pending: "cs-badge cs-badge--pending",
  "in-progress": "cs-badge cs-badge--progress",
  rejected: "cs-badge cs-badge--rejected",
};

const SolvedCards = ({ issue }) => {
  return (
    <article className="cs-issue-card">
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
        <div className="flex gap-2 flex-wrap">
          <span className="cs-badge cs-badge--resolved">✓ Resolved</span>
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
          <div className="cs-issue-card__meta-row">
            <Calendar size={11} />
            <span>
              {new Date(issue.updatedAt || issue.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="cs-issue-card__actions">
          <div
            className="flex items-center gap-1 text-sm font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            <ChevronUp size={15} />
            <span>{issue.upvotes?.length || 0}</span>
          </div>
          <Link to={`/issues/${issue._id}`}>
            <button id={`view-details-${issue._id}`} className="cs-btn-primary" style={{ fontSize: "0.8rem", padding: "6px 14px" }}>
              View Details
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default SolvedCards;