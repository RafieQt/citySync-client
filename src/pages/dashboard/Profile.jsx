import { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";
import axiosSecure from "../../utils/axiosSecure";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Crown, Camera } from "lucide-react";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { dbUser } = useUser();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.displayName || "", email: user?.email || "" },
  });

  const handleUpdate = async (data) => {
    setUploading(true);
    try {
      let photoURL = user.photoURL;
      if (data.photo?.[0]) {
        const formData = new FormData();
        formData.append("image", data.photo[0]);
        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`,
          formData
        );
        photoURL = imgRes.data.data.url;
      }

      await updateUser(data.name, photoURL);
      await axiosSecure.patch(`/users/${user.email}`, { name: data.name, photo: photoURL });
      toast.success("Profile updated!");
      queryClient.invalidateQueries(["dbUser"]);
    } catch (error) {
      toast.error(error.response?.data?.error?.message || error.message || "Update failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-[#03373D] mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={user?.photoURL || "https://i.pravatar.cc/100"}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-[#03373D]/20"
              alt={user?.displayName}
            />
            <div className="absolute -bottom-1 -right-1 bg-[#03373D] rounded-full p-1">
              <Camera size={14} className="text-white" />
            </div>
          </div>
          <p className="mt-3 font-bold text-[#03373D] text-lg">{user?.displayName}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
          <div className="flex gap-2 mt-2">
            <span className="badge badge-ghost capitalize">{dbUser?.role}</span>
            {dbUser?.isPremium && <span className="badge badge-warning gap-1"><Crown size={12} /> Premium</span>}
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          <div>
            <label className="label text-sm font-semibold text-[#03373D]">Display Name</label>
            <input {...register("name")} className="input input-bordered w-full rounded-xl" placeholder="Your name" />
          </div>
          <div>
            <label className="label text-sm font-semibold text-[#03373D]">Email</label>
            <input value={user?.email} disabled className="input input-bordered w-full rounded-xl bg-gray-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="label text-sm font-semibold text-[#03373D]">Update Profile Photo</label>
            <input type="file" accept="image/*" {...register("photo")} className="file-input file-input-bordered w-full rounded-xl" />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="btn px-2 bg-[#03373D] hover:bg-[#05535D] text-white border-none w-full rounded-xl font-semibold"
          >
            {uploading ? <span className="loading loading-spinner loading-sm" /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;