import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";
import {  Mail, MapPin, Camera, Crown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../utils/axiosSecure";
import axios from "axios";
import toast from "react-hot-toast";
import { auth } from "../../firebase/firebase.init";
import { updateProfile, updatePassword } from "firebase/auth";
import { useForm } from "react-hook-form";

// ── Edit Profile Modal ────────────────────────────────────────────────────────
const EditProfileModal = ({ user, onClose }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.displayName || "" },
  });
  const [updating, setUpdating] = useState(false);

  const onSubmit = async (data) => {
    setUpdating(true);
    try {
      let imgURL = user?.photoURL;
      if (data.photo?.[0]) {
        const formData = new FormData();
        formData.append("image", data.photo[0]);
        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`,
          formData
        );
        imgURL = imgRes.data.data.url;
      }

      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: imgURL,
      });

      toast.success("Profile updated successfully!");
      onClose();
      window.location.reload(); 
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-sm cs-surface">
        <h3 className="font-bold text-xl mb-4" style={{ color: "var(--color-text-heading)" }}>
          Edit Profile
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>
              Display Name
            </label>
            <input
              {...register("name", { required: true })}
              className="input input-bordered w-full cs-input"
            />
          </div>
          <div>
            <label className="label text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>
              New Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("photo")}
              className="file-input file-input-bordered w-full cs-input"
            />
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              disabled={updating}
              className="cs-btn-primary flex-1 py-2"
            >
              {updating ? <span className="loading loading-spinner loading-sm" /> : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={updating}
              className="cs-btn-outline flex-1 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
};

// ── Change Password Modal ──────────────────────────────────────────────────────
const ChangePasswordModal = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [updating, setUpdating] = useState(false);

  const onSubmit = async (data) => {
    setUpdating(true);
    try {
      await updatePassword(auth.currentUser, data.newPassword);
      toast.success("Password changed successfully!");
      onClose();
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error("Please log out and log back in to change your password.");
      } else {
        toast.error(error.message || "Failed to change password");
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-sm cs-surface">
        <h3 className="font-bold text-xl mb-4" style={{ color: "var(--color-text-heading)" }}>
          Change Password
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>
              New Password
            </label>
            <input
              type="password"
              {...register("newPassword", { required: true, minLength: 6 })}
              className="input input-bordered w-full cs-input"
              placeholder="Enter new password"
            />
            {errors.newPassword?.type === "required" && (
              <p className="text-red-500 text-sm mt-1">Password is required!</p>
            )}
            {errors.newPassword?.type === "minLength" && (
              <p className="text-red-500 text-sm mt-1">Minimum 6 characters!</p>
            )}
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              disabled={updating}
              className="cs-btn-primary flex-1 py-2"
            >
              {updating ? <span className="loading loading-spinner loading-sm" /> : "Save Password"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={updating}
              className="cs-btn-outline flex-1 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
};

// ── Profile Component ─────────────────────────────────────────────────────────
const Profile = () => {
  const { user } = useAuth();
  const { dbUser, isLoading: userLoading } = useUser();
  const [showEdit, setShowEdit] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues?email=${user?.email}`);
      return {
        total: res.data.total,
        resolved: res.data.result.filter((i) => i.status === "resolved").length,
        pending: res.data.result.filter((i) => i.status === "pending").length,
      };
    },
    enabled: !!user?.email && dbUser?.role === "citizen",
  });

  if (userLoading)
    return (
      <div className="flex justify-center py-20">
        <span
          className="loading loading-spinner loading-lg"
          style={{ color: "var(--color-primary)" }}
        />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto w-full">
      <h1
        className="text-3xl font-extrabold mb-8"
        style={{ color: "var(--color-text-heading)" }}
      >
        My Profile
      </h1>

      <div className="cs-surface overflow-hidden rounded-3xl relative">
        {/* Banner Background */}
        <div
          className="h-32 sm:h-48 w-full relative"
          style={{
            background:
              "linear-gradient(135deg, var(--color-gradient-from), var(--color-gradient-to))",
          }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute top-[-20px] right-[10%] w-32 h-32 rounded-full opacity-20 pointer-events-none"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
          <div
            className="absolute bottom-[-40px] left-[20%] w-40 h-40 rounded-full opacity-10 pointer-events-none"
            style={{ backgroundColor: "var(--color-primary)" }}
          />
        </div>

        {/* Profile Info Section */}
        <div className="px-6 sm:px-10 pb-10 relative">
          {/* Avatar floating over banner */}
          <div className="relative -mt-16 sm:-mt-20 mb-6 flex justify-between items-end">
            <div className="relative inline-block">
              <img
                src={user?.photoURL || "/default-avatar.png"}
                alt={user?.displayName}
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-2xl border-4 shadow-lg"
                style={{ borderColor: "var(--color-surface)" }}
                onError={(e) => {
                  e.target.src = "https://i.pravatar.cc/150";
                }}
              />
              <button
                onClick={() => setShowEdit(true)}
                className="absolute bottom-2 right-2 p-2 rounded-lg shadow-md hover:scale-105 transition-transform"
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-heading)",
                }}
                title="Update Photo"
              >
                <Camera size={18} />
              </button>
            </div>

            {dbUser?.isPremium && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm shadow-sm mb-4"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-primary)",
                }}
              >
                <Crown size={16} /> Premium
              </div>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Col - Info */}
            <div className="space-y-6">
              <div>
                <h2
                  className="text-3xl font-bold"
                  style={{ color: "var(--color-text-heading)" }}
                >
                  {user?.displayName}
                </h2>
                <div
                  className="flex items-center gap-2 mt-2"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <span
                    className="cs-badge capitalize"
                    style={{
                      backgroundColor: "var(--color-accent-soft)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {dbUser?.role || "Citizen"}
                  </span>
                  • Joined{" "}
                  {new Date(
                    user?.metadata?.creationTime
                  ).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--color-surface-hover)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    <Mail size={18} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Email
                    </p>
                    <p
                      className="font-medium"
                      style={{ color: "var(--color-text-body)" }}
                    >
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--color-surface-hover)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Location
                    </p>
                    <p
                      className="font-medium"
                      style={{ color: "var(--color-text-body)" }}
                    >
                      {dbUser?.location || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col - Stats (Only for Citizen) */}
            {dbUser?.role === "citizen" && (
              <div
                className="cs-surface p-6 rounded-2xl flex flex-col justify-center"
                style={{
                  backgroundColor: "var(--color-surface-hover)",
                  border: "none",
                }}
              >
                <h3
                  className="font-bold text-lg mb-4"
                  style={{ color: "var(--color-text-heading)" }}
                >
                  My Impact
                </h3>

                {statsLoading ? (
                  <span
                    className="loading loading-spinner"
                    style={{ color: "var(--color-primary)" }}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: "var(--color-surface)" }}
                    >
                      <p
                        className="text-3xl font-extrabold mb-1"
                        style={{ color: "var(--color-primary)" }}
                      >
                        {stats?.total || 0}
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Issues Reported
                      </p>
                    </div>
                    <div
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: "var(--color-surface)" }}
                    >
                      <p className="text-3xl font-extrabold mb-1 text-green-600">
                        {stats?.resolved || 0}
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Resolved
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            className="mt-8 pt-6 border-t flex flex-wrap gap-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            <button
              onClick={() => setShowEdit(true)}
              className="cs-btn-primary"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="cs-btn-outline"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {showEdit && (
        <EditProfileModal user={user} onClose={() => setShowEdit(false)} />
      )}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

export default Profile;