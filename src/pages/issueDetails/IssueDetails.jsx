import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../utils/axiosSecure";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import toast from "react-hot-toast";
import { MapPin, Tag, User, Calendar, ChevronUp, Trash2, Pencil, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";

const BOOST_AMOUNT = 1; // Stripe test charge in USD ($1.00); UI shows ৳100

const statusColor = {
  pending: "badge-warning",
  "in-progress": "badge-info",
  resolved: "badge-success",
  rejected: "badge-error",
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
      <div className="modal-box max-w-lg rounded-2xl">
        <h3 className="font-bold text-xl text-[#03373D] mb-4">Edit Issue</h3>
        <form onSubmit={handleSubmit(handleEdit)} className="space-y-3">
          <input {...register("title")} className="input input-bordered w-full rounded-xl" placeholder="Title" />
          <select {...register("category")} className="select select-bordered w-full rounded-xl">
            {["Road Damage","Streetlight","Water Leakage","Garbage Overflow","Footpath Damage","Drainage","Traffic Signal","Other"].map(c => <option key={c}>{c}</option>)}
          </select>
          <textarea {...register("description")} rows="3" className="textarea textarea-bordered w-full rounded-xl" placeholder="Description" />
          <input {...register("location")} className="input input-bordered w-full rounded-xl" placeholder="Location" />
          <div>
            <label className="label text-sm font-semibold text-gray-600">Update Photo (optional)</label>
            <input type="file" accept="image/*" {...register("image")} className="file-input file-input-bordered w-full rounded-xl" />
          </div>
          <div className="flex gap-2 mt-2">
            <button type="submit" disabled={uploading || editMutation.isPending} className="btn bg-[#03373D] text-white border-none flex-1 rounded-xl">
              {uploading || editMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="btn btn-outline flex-1 rounded-xl">Cancel</button>
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
      const res = await axiosSecure.get(`/issues/${id}`);
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

  if (isLoading) return <div className="flex justify-center py-40"><span className="loading loading-spinner loading-lg text-[#03373D]" /></div>;
  if (!issue) return <div className="text-center py-20 text-gray-400 text-xl">Issue not found.</div>;

  const isOwner = user?.email === issue.userEmail;
  const alreadyUpvoted = issue.upvotes?.includes(user?.email);
  const canEdit = isOwner && issue.status === "pending";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
        <img src={issue.image} alt={issue.title} className="w-full h-64 object-cover" />
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`badge ${statusColor[issue.status]} capitalize`}>{issue.status}</span>
            {issue.priority === "high" && <span className="badge badge-error text-white">🔥 Boosted</span>}
          </div>
          <h1 className="text-3xl font-extrabold text-[#03373D]">{issue.title}</h1>

          <div className="flex flex-wrap gap-4 mt-3 text-gray-500 text-sm">
            <span className="flex items-center gap-1"><Tag size={14} />{issue.category}</span>
            <span className="flex items-center gap-1"><MapPin size={14} />{issue.location}</span>
            <span className="flex items-center gap-1"><User size={14} />{issue.userName}</span>
            <span className="flex items-center gap-1"><Calendar size={14} />{new Date(issue.createdAt).toLocaleDateString()}</span>
          </div>

          <p className="mt-4 text-gray-700 leading-relaxed">{issue.description}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            {/* Upvote */}
            <button
              onClick={() => {
                if (!user) return toast.error("Login to upvote");
                if (isOwner) return toast.error("Can't upvote your own issue");
                upvoteMutation.mutate();
              }}
              className={`btn rounded-xl gap-2 ${alreadyUpvoted ? "bg-[#03373D] text-white border-none" : "btn-outline border-[#03373D] text-[#03373D]"}`}
            >
              <ChevronUp size={18} /> {issue.upvotes?.length || 0} Upvotes
            </button>

            {/* Edit — owner + pending only */}
            {canEdit && (
              <button onClick={() => setShowEdit(true)} className="btn btn-outline rounded-xl gap-2">
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
                className="btn btn-error btn-outline rounded-xl gap-2"
              >
                <Trash2 size={16} /> Delete
              </button>
            )}

            {/* Boost — owner + not already boosted */}
            {isOwner && issue.priority !== "high" && issue.status === "pending" && (
              <button
                onClick={handleBoostCheckout}
                disabled={boosting}
                className="btn bg-amber-500 hover:bg-amber-600 text-white border-none rounded-xl gap-2"
              >
                {boosting ? <span className="loading loading-spinner loading-sm" /> : <><Zap size={16} /> Boost Priority (৳100)</>}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Assigned Staff */}
      {issue.assignedStaff && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-[#03373D] mb-3">Assigned Staff</h2>
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-[#03373D] text-white rounded-full w-10">
                <span>{issue.assignedStaff.name?.charAt(0)}</span>
              </div>
            </div>
            <div>
              <p className="font-semibold">{issue.assignedStaff.name}</p>
              <p className="text-gray-500 text-sm">{issue.assignedStaff.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-[#03373D] mb-6">Issue Timeline</h2>
        <ul className="timeline timeline-vertical">
          {issue.timeline?.map((entry, index) => (
            <li key={index}>
              {index !== 0 && <hr className="bg-[#03373D]" />}
              <div className="timeline-start text-sm text-gray-400">
                {new Date(entry.date).toLocaleDateString()}
              </div>
              <div className="timeline-middle">
                <div className="w-4 h-4 rounded-full bg-[#03373D]" />
              </div>
              <div className="timeline-end timeline-box border border-gray-100 shadow-sm">
                <p className="font-bold text-[#03373D]">{entry.status}</p>
                <p className="text-sm text-gray-600">{entry.message}</p>
                <p className="text-xs text-gray-400 mt-1">by {entry.updatedBy} ({entry.role})</p>
              </div>
              {index !== issue.timeline.length - 1 && <hr className="bg-[#03373D]" />}
            </li>
          ))}
        </ul>
      </div>

      {showEdit && <EditModal issue={issue} onClose={() => setShowEdit(false)} />}
    </div>
  );
};

export default IssueDetails;