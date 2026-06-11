import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../utils/axiosSecure";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import toast from "react-hot-toast";
import { MapPin, Tag, User, Calendar, ChevronUp, Trash2, Pencil, Zap } from "lucide-react";
import { useForm } from "react-hook-form";

const BOOST_AMOUNT = 1; // Stripe test charge in USD ($1.00); UI shows ৳100

const statusBadgeClass = {
  resolved: "cs-badge cs-badge--resolved",
  pending: "cs-badge cs-badge--pending",
  "in-progress": "cs-badge cs-badge--progress",
  rejected: "cs-badge cs-badge--rejected",
};

// ── Edit Modal ───────────────────────────────────────────────────────────────
const EditModal = ({ issue, onClose }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: issue.title,
      description: issue.description,
      location: issue.location,
      category: issue.category,
    },
  });
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const editMutation = useMutation({
    mutationFn: (data) => axiosSecure.patch(`/issues/${issue._id}`, data),
    onSuccess: () => {
      toast.success("Issue updated!");
      queryClient.invalidateQueries(["issue", issue._id]);
      onClose();
    },
    onError: () => toast.error("Update failed"),
  });

  const handleEdit = async (data) => {
    setUploading(true);
    try {
      let imgURL = issue.image;
      if (data.image?.[0]) {
        const formData = new FormData();
        formData.append("image", data.image[0]);
        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`,
          formData
        );
        imgURL = imgRes.data.data.url;
      }
      editMutation.mutate({ ...data, image: imgURL, image_: undefined });
    } catch (error) {
      toast.error(error.response?.data?.error?.message || error.message || "Failed to update issue.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-lg cs-surface">
        <h3 className="font-bold text-xl mb-4" style={{ color: "var(--color-text-heading)" }}>Edit Issue</h3>
        <form onSubmit={handleSubmit(handleEdit)} className="space-y-3">
          <input {...register("title")} className="input input-bordered w-full cs-input" placeholder="Title" />
          <select {...register("category")} className="select select-bordered w-full cs-input">
            {["Road Damage","Streetlight","Water Leakage","Garbage Overflow","Footpath Damage","Drainage","Traffic Signal","Other"].map(c => <option key={c}>{c}</option>)}
          </select>
          <textarea {...register("description")} rows="3" className="textarea textarea-bordered w-full cs-input" placeholder="Description" />
          <input {...register("location")} className="input input-bordered w-full cs-input" placeholder="Location" />
          <div>
            <label className="label text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>Update Photo (optional)</label>
            <input type="file" accept="image/*" {...register("image")} className="file-input file-input-bordered w-full cs-input" />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={uploading || editMutation.isPending} className="cs-btn-primary flex-1">
              {uploading || editMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="cs-btn-outline flex-1">Cancel</button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const IssueDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showEdit, setShowEdit] = useState(false);
  const [boosting, setBoosting] = useState(false);

  const { data: issue, isLoading } = useQuery({
    queryKey: ["issue", id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/issues/${id}`);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => axiosSecure.delete(`/issues/${id}`),
    onSuccess: () => {
      toast.success("Issue deleted");
      navigate("/dashboard/my-issues");
    },
    onError: () => toast.error("Delete failed"),
  });

  const upvoteMutation = useMutation({
    mutationFn: () => axiosSecure.patch(`/issues/${id}/upvote`, { email: user.email }),
    onSuccess: () => {
      toast.success("Upvoted!");
      queryClient.invalidateQueries(["issue", id]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not upvote"),
  });

  const handleBoostCheckout = async () => {
    if (!user) return toast.error("Login to boost");
    setBoosting(true);
    try {
      const { data } = await axiosSecure.post("/create-checkout-session", {
        type: "boost",
        issueId: issue._id,
        issueTitle: issue.title,
        userEmail: user.email,
        amount: BOOST_AMOUNT,
      });
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Could not start checkout");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed");
    } finally {
      setBoosting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-40"><span className="loading loading-spinner loading-lg" style={{ color: "var(--color-primary)" }} /></div>;
  if (!issue) return <div className="text-center py-20 text-xl" style={{ color: "var(--color-text-muted)" }}>Issue not found.</div>;

  const isOwner = user?.email === issue.userEmail;
  const alreadyUpvoted = issue.upvotes?.includes(user?.email);
  const canEdit = isOwner && issue.status === "pending";

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="cs-surface overflow-hidden mb-6">
        <img src={issue.image} alt={issue.title} className="w-full h-64 object-cover" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={statusBadgeClass[issue.status] || "cs-badge"}>{issue.status}</span>
            {issue.priority === "high" && <span className="cs-badge cs-badge--boosted">🔥 Boosted</span>}
          </div>
          <h1 className="text-3xl font-extrabold mb-4" style={{ color: "var(--color-text-heading)" }}>{issue.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
            <span className="flex items-center gap-1"><Tag size={14} />{issue.category}</span>
            <span className="flex items-center gap-1"><MapPin size={14} />{issue.location}</span>
            <span className="flex items-center gap-1"><User size={14} />{issue.userName}</span>
            <span className="flex items-center gap-1"><Calendar size={14} />{new Date(issue.createdAt).toLocaleDateString()}</span>
          </div>

          <p className="leading-relaxed whitespace-pre-wrap" style={{ color: "var(--color-text-body)" }}>{issue.description}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t" style={{ borderColor: "var(--color-border)" }}>
            {/* Upvote */}
            <button
              onClick={() => {
                if (!user) return toast.error("Login to upvote");
                if (isOwner) return toast.error("Can't upvote your own issue");
                upvoteMutation.mutate();
              }}
              className={alreadyUpvoted ? "cs-btn-primary" : "cs-btn-outline"}
            >
              <ChevronUp size={18} /> {issue.upvotes?.length || 0} Upvotes
            </button>

            {/* Edit — owner + pending only */}
            {canEdit && (
              <button onClick={() => setShowEdit(true)} className="cs-btn-outline">
                <Pencil size={16} /> Edit
              </button>
            )}

            {/* Delete — owner only */}
            {isOwner && (
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this issue?")) {
                    deleteMutation.mutate();
                  }
                }}
                className="cs-btn-outline"
                style={{ borderColor: "#dc2626", color: "#dc2626" }}
              >
                <Trash2 size={16} /> Delete
              </button>
            )}

            {/* Boost — owner + not already boosted */}
            {isOwner && issue.priority !== "high" && issue.status === "pending" && (
              <button
                onClick={handleBoostCheckout}
                disabled={boosting}
                className="cs-btn-primary"
                style={{ backgroundColor: "#f59e0b", color: "#fff" }}
              >
                {boosting ? <span className="loading loading-spinner loading-sm" /> : <><Zap size={16} /> Boost Priority (৳100)</>}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Assigned Staff */}
      {issue.assignedStaff && (
        <div className="cs-surface p-6 mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text-heading)" }}>Assigned Staff</h2>
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold" style={{ backgroundColor: "var(--color-primary)", color: "var(--color-bg)" }}>
                <span>{issue.assignedStaff.name?.charAt(0)}</span>
              </div>
            </div>
            <div>
              <p className="font-semibold" style={{ color: "var(--color-text-heading)" }}>{issue.assignedStaff.name}</p>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{issue.assignedStaff.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="cs-surface p-6">
        <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-text-heading)" }}>Issue Timeline</h2>
        <ul className="timeline timeline-vertical">
          {issue.timeline?.map((entry, index) => (
            <li key={index}>
              {index !== 0 && <hr style={{ backgroundColor: "var(--color-accent)" }} />}
              <div className="timeline-start text-sm" style={{ color: "var(--color-text-muted)" }}>
                {new Date(entry.date).toLocaleDateString()}
              </div>
              <div className="timeline-middle">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "var(--color-primary)" }} />
              </div>
              <div className="timeline-end timeline-box" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                <p className="font-bold" style={{ color: "var(--color-text-heading)" }}>{entry.status}</p>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-body)" }}>{entry.message}</p>
                <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>by {entry.updatedBy} ({entry.role})</p>
              </div>
              {index !== issue.timeline.length - 1 && <hr style={{ backgroundColor: "var(--color-accent)" }} />}
            </li>
          ))}
        </ul>
      </div>

      {showEdit && <EditModal issue={issue} onClose={() => setShowEdit(false)} />}
    </div>
  );
};

export default IssueDetails;