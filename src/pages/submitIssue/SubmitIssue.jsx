import { useForm } from "react-hook-form";
import undrawForm from "../../assets/undraw.svg";
import { MapPin, Upload, FileText, Tag } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";
import axios from "axios";
import axiosSecure from "../../utils/axiosSecure";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useState } from "react";

const SubmitIssue = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { user } = useAuth();
  const { dbUser } = useUser();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitIssue = async (data) => {
    if (!user?.email) {
      toast.error("Please sign in to report an issue.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please sign in again.");
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      toast.error("API URL is not configured. Add VITE_API_URL to .env and restart the client.");
      return;
    }

    const issueImage = data.image?.[0];
    if (!issueImage) {
      toast.error("Please select a photo.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", issueImage);
      const imageKey = import.meta.env.VITE_image_host;
      if (!imageKey) {
        toast.error("Image upload key missing. Set VITE_image_host in .env.");
        return;
      }

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imageKey}`,
        formData,
      );

      if (!imgRes.data?.success || !imgRes.data?.data?.url) {
        const imgErr = imgRes.data?.error?.message || "Image upload failed.";
        toast.error(imgErr);
        return;
      }
      const imgURL = imgRes.data.data.url;

      const issueData = {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        image: imgURL,
        userEmail: user.email,
        userName: user.displayName || "Citizen",
        userPhoto: user.photoURL || "",
      };

      const res = await axiosSecure.post("/issues", issueData);

      if (res.data?.insertedId || res.data?.acknowledged) {
        toast.success("Issue reported successfully!");
        reset();
        navigate("/dashboard/my-issues");
      } else {
        toast.error("Issue could not be saved. Please try again.");
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(
          error.response?.data?.message ||
            "Free users can only submit 3 issues. Upgrade to Premium!",
        );
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please sign in again.");
      } else if (error.response?.data?.error?.message) {
        toast.error(error.response.data.error.message);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message === "Network Error") {
        toast.error("Cannot reach the server. Is citysync-server running on port 3000?");
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF8F7] via-white to-[#DDF3F1] p-6 md:p-10 rounded-3xl">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#03373D]">
          Submit Your Issue
        </h2>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Help improve your city by reporting infrastructure issues such as
          potholes, broken streetlights, water leakage, and more.
        </p>
        {/* Free user issue count warning */}
        {dbUser && !dbUser.isPremium && (
          <div className="mt-4 alert alert-warning max-w-md mx-auto">
            <span>Free plan: You can submit up to 3 issues. <a href="/dashboard/subscription" className="font-bold underline">Upgrade to Premium</a> for unlimited.</span>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Form */}
          <div className="p-8 md:p-12">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#03373D]">
                Report an Infrastructure Issue
              </h3>
              <p className="text-gray-500 mt-2">
                Fill in the details below and our team will take action.
              </p>
            </div>

            <form onSubmit={handleSubmit(handleSubmitIssue)} className="space-y-5">
              {/* Title */}
              <div>
                <label className="label font-semibold text-[#03373D]">
                  <FileText size={16} className="mr-2 inline" /> Issue Title
                </label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className="p-2 input input-bordered w-full rounded-xl bg-gray-50 focus:bg-white"
                  placeholder="e.g. Broken streetlight near school"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="label font-semibold text-[#03373D]">
                  <Tag size={16} className="mr-2 inline" /> Category
                </label>
                <select
                  {...register("category", { required: "Category is required" })}
                  className="p-2 select select-bordered w-full rounded-xl bg-gray-50"
                  defaultValue=""
                >
                  <option value="" disabled>Select issue category</option>
                  <option>Road Damage</option>
                  <option>Streetlight</option>
                  <option>Water Leakage</option>
                  <option>Garbage Overflow</option>
                  <option>Footpath Damage</option>
                  <option>Drainage</option>
                  <option>Traffic Signal</option>
                  <option>Other</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="label font-semibold text-[#03373D]">Description</label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  rows="4"
                  className="p-2 textarea textarea-bordered w-full rounded-xl bg-gray-50"
                  placeholder="Describe the issue in detail..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              {/* Photo Upload */}
              <div>
                <label className="label font-semibold text-[#03373D]">
                  <Upload size={16} className="mr-2 inline" /> Upload Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("image", { required: "Image is required" })}
                  className="file-input file-input-bordered w-full rounded-xl"
                />
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
              </div>

              {/* Location */}
              <div>
                <label className="label font-semibold text-[#03373D]">
                  <MapPin size={16} className="mr-2 inline" /> Location
                </label>
                <input
                  type="text"
                  {...register("location", { required: "Location is required" })}
                  className="p-2 input input-bordered w-full rounded-xl bg-gray-50"
                  placeholder="e.g. Kaliganj Bus Stand"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn w-full bg-[#03373D] hover:bg-[#05535D] text-white border-none rounded-xl text-lg font-semibold shadow-lg mt-4"
              >
                {submitting ? <span className="loading loading-spinner loading-sm" /> : "Submit Issue"}
              </button>
            </form>
          </div>

          {/* Right Side - Illustration */}
          <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-[#DDF3F1] to-[#BEE9E5] p-12">
            <div className="text-center">
              <img
                src={undrawForm}
                alt="Issue reporting illustration"
                className="w-full max-w-md drop-shadow-xl"
              />
              <h4 className="text-2xl font-bold text-[#03373D] mt-6">Your Report Matters</h4>
              <p className="text-gray-600 mt-3 max-w-sm mx-auto">
                Every issue you report helps build a cleaner, safer, and smarter city for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitIssue;