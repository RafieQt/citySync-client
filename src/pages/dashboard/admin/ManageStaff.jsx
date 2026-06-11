import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../../utils/axiosSecure";
import toast from "react-hot-toast";
import { useState } from "react";
import { UserPlus, Trash2, Pencil, X } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { secondaryAuth } from "../../../firebase/firebase.secondary";

const ManageStaff = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: staffList = [], isLoading } = useQuery({
    queryKey: ["staffList"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users?role=staff");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (email) => axiosSecure.delete(`/users/${email}`),
    onSuccess: () => {
      toast.success("Staff member removed");
      setDeleteTarget(null);
      queryClient.invalidateQueries(["staffList"]);
    },
    onError: () => toast.error("Failed to delete staff"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ email, data }) => axiosSecure.patch(`/users/${email}`, data),
    onSuccess: () => {
      toast.success("Staff updated!");
      setEditStaff(null);
      queryClient.invalidateQueries(["staffList"]);
    },
    onError: () => toast.error("Update failed"),
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-heading)" }}>Manage Staff</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn px-3 border-none rounded-xl gap-2"
          style={{ backgroundColor: "var(--color-primary)", color: "var(--color-bg)" }}
        >
          <UserPlus size={16} />
          <span className="hidden sm:inline">Add Staff</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" style={{ color: "var(--color-primary)" }} />
        </div>
      ) : staffList.length === 0 ? (
        <div className="text-center py-16 cs-surface" style={{ color: "var(--color-text-muted)" }}>
          No staff members yet. Click "Add Staff" to create one.
        </div>
      ) : (
        <>
          {/* ── Desktop table (md+) ── */}
          <div className="hidden md:block cs-surface overflow-x-auto">
            <table className="table">
              <thead>
                <tr style={{ backgroundColor: "var(--color-surface-hover)", color: "var(--color-text-heading)" }}>
                  <th>Staff Member</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--color-text-body)" }}>
                {staffList.map((s) => (
                  <tr key={s._id} className="hover" style={{ borderColor: "var(--color-border)" }}>
                    <td>
                      <div className="flex items-center gap-3">
                        {s.photo ? (
                          <img src={s.photo} className="w-9 h-9 rounded-full object-cover" alt={s.name} />
                        ) : (
                          <div className="avatar placeholder">
                            <div className="w-9 rounded-full" style={{ backgroundColor: "var(--color-primary)", color: "var(--color-bg)" }}>
                              <span>{s.name?.charAt(0) || "S"}</span>
                            </div>
                          </div>
                        )}
                        <p className="font-medium text-sm">{s.name || "Staff"}</p>
                      </div>
                    </td>
                    <td className="text-xs" style={{ color: "var(--color-text-muted)" }}>{s.email}</td>
                    <td className="text-xs" style={{ color: "var(--color-text-muted)" }}>{s.phone || "—"}</td>
                    <td>
                      <span className={`badge badge-sm ${s.status === "active" ? "badge-success" : "badge-error"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="text-xs" style={{ color: "var(--color-text-muted)" }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditStaff(s)}
                          className="btn px-2 btn-xs btn-outline rounded-lg gap-1"
                          style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="btn px-2 btn-xs btn-error btn-outline rounded-lg gap-1"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards (< md) ── */}
          <div className="flex flex-col gap-3 md:hidden">
            {staffList.map((s) => (
              <div key={s._id} className="cs-surface p-4">
                <div className="flex items-center gap-3">
                  {s.photo ? (
                    <img src={s.photo} className="w-12 h-12 rounded-full object-cover flex-shrink-0" alt={s.name} />
                  ) : (
                    <div className="avatar placeholder flex-shrink-0">
                      <div className="w-12 rounded-full" style={{ backgroundColor: "var(--color-primary)", color: "var(--color-bg)" }}>
                        <span className="text-base">{s.name?.charAt(0) || "S"}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--color-text-heading)" }}>{s.name || "Staff"}</p>
                    <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>{s.email}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span className={`badge badge-xs ${s.status === "active" ? "badge-success" : "badge-error"}`}>
                        {s.status}
                      </span>
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{s.phone || "No phone"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    Joined {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditStaff(s)}
                      className="btn px-2 btn-xs btn-outline rounded-lg gap-1"
                      style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(s)}
                      className="btn px-2 btn-xs btn-error btn-outline rounded-lg gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showAddModal && (
        <AddStaffModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            queryClient.invalidateQueries(["staffList"]);
          }}
        />
      )}

      {editStaff && (
        <EditStaffModal
          staff={editStaff}
          onClose={() => setEditStaff(null)}
          onSubmit={(data) => updateMutation.mutate({ email: editStaff.email, data })}
          isPending={updateMutation.isPending}
        />
      )}

      {deleteTarget && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-sm cs-surface text-center mx-4">
            <div className="text-5xl mb-3">🗑️</div>
            <h3 className="font-bold text-lg" style={{ color: "var(--color-text-heading)" }}>Remove Staff Member?</h3>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Are you sure you want to remove <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setDeleteTarget(null)} className="btn px-2 flex-1 btn-outline rounded-xl" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteTarget.email)}
                disabled={deleteMutation.isPending}
                className="btn px-2 flex-1 btn-error text-white rounded-xl border-none"
              >
                {deleteMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : "Yes, Remove"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeleteTarget(null)} />
        </dialog>
      )}
    </div>
  );
};

// ── Add Staff Modal ─────────────────────────────────────────────────────────────
const AddStaffModal = ({ onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (data) => {
    setSubmitting(true);
    try {
      let photoURL = "";
      if (data.photo?.[0]) {
        const formData = new FormData();
        formData.append("image", data.photo[0]);
        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`,
          formData
        );
        photoURL = imgRes.data.data.url;
      }
      await createUserWithEmailAndPassword(secondaryAuth, data.email, data.password);
      await axiosSecure.post("/users", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        photo: photoURL,
        role: "staff",
        status: "active",
        isPremium: false,
        createdAt: new Date(),
      });
      toast.success(`Staff account created for ${data.name}!`);
      onSuccess();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered.");
      } else {
        toast.error("Failed to create staff. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-md cs-surface mx-4 w-full">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-xl" style={{ color: "var(--color-text-heading)" }}>Add New Staff</h3>
          <button onClick={onClose} className="btn btn-ghost px-2 btn-sm btn-circle" style={{ color: "var(--color-text-muted)" }}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit(handleAdd)} className="space-y-3">
          <div>
            <label className="label text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>Full Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="input input-bordered w-full rounded-xl cs-input"
              placeholder="e.g. Rahim Uddin"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="input input-bordered w-full rounded-xl cs-input"
              placeholder="staff@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>Phone</label>
            <input
              {...register("phone", { required: "Phone is required" })}
              className="input input-bordered w-full rounded-xl cs-input"
              placeholder="01XXXXXXXXX"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="label text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
              className="input input-bordered w-full rounded-xl cs-input"
              placeholder="Min 6 characters"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="label text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>Profile Photo (optional)</label>
            <input type="file" accept="image/*" {...register("photo")} className="file-input file-input-bordered w-full rounded-xl cs-input" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn px-2 flex-1 btn-outline rounded-xl" style={{ borderColor: "var(--color-border)", color: "var(--color-text-body)" }}>Cancel</button>
            <button
              type="submit"
              disabled={submitting}
              className="btn flex-1 border-none rounded-xl"
              style={{ backgroundColor: "var(--color-primary)", color: "var(--color-bg)" }}
            >
              {submitting ? <span className="loading px-2 loading-spinner loading-sm" /> : "Create Staff"}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
};

// ── Edit Staff Modal ────────────────────────────────────────────────────────────
const EditStaffModal = ({ staff, onClose, onSubmit, isPending }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: staff.name || "",
      phone: staff.phone || "",
      status: staff.status || "active",
    },
  });
  const [uploading, setUploading] = useState(false);

  const handleEdit = async (data) => {
    setUploading(true);
    try {
      let photo = staff.photo || "";
      if (data.photo?.[0]) {
        const formData = new FormData();
        formData.append("image", data.photo[0]);
        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`,
          formData
        );
        photo = imgRes.data.data.url;
      }
      onSubmit({ name: data.name, phone: data.phone, status: data.status, photo });
    } finally {
      setUploading(false);
    }
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-md cs-surface mx-4 w-full">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-xl" style={{ color: "var(--color-text-heading)" }}>Edit Staff</h3>
          <button onClick={onClose} className="btn px-2 btn-ghost btn-sm btn-circle" style={{ color: "var(--color-text-muted)" }}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit(handleEdit)} className="space-y-3">
          {staff.photo && (
            <div className="flex items-center gap-3 mb-2">
              <img src={staff.photo} className="w-12 h-12 rounded-full object-cover" alt={staff.name} />
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Current photo</p>
            </div>
          )}
          <div>
            <label className="label text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>Full Name</label>
            <input {...register("name", { required: true })} className="input input-bordered w-full rounded-xl cs-input" />
          </div>
          <div>
            <label className="label text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>Email</label>
            <input value={staff.email} disabled className="input input-bordered w-full rounded-xl cs-input cursor-not-allowed" style={{ opacity: 0.6 }} />
          </div>
          <div>
            <label className="label text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>Phone</label>
            <input {...register("phone")} className="input input-bordered w-full rounded-xl cs-input" />
          </div>
          <div>
            <label className="label text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>Status</label>
            <select {...register("status")} className="select select-bordered w-full rounded-xl cs-input">
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          <div>
            <label className="label text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>Update Photo (optional)</label>
            <input type="file" accept="image/*" {...register("photo")} className="file-input file-input-bordered w-full rounded-xl cs-input" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn px-2 flex-1 btn-outline rounded-xl" style={{ borderColor: "var(--color-border)", color: "var(--color-text-body)" }}>Cancel</button>
            <button
              type="submit"
              disabled={isPending || uploading}
              className="btn flex-1 border-none rounded-xl"
              style={{ backgroundColor: "var(--color-primary)", color: "var(--color-bg)" }}
            >
              {isPending || uploading ? <span className="loading loading-spinner loading-sm" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
};

export default ManageStaff;