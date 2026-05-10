import { useForm } from "react-hook-form";
import undrawForm from "../../assets/undraw.svg";
import { MapPin, Upload, FileText, Tag } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";

const SubmitIssue = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user } = useAuth();

    const handleSubmitIssue = async(data) => {
        const issueImage = data.image[0];
        const formData = new FormData();
        formData.append("image", issueImage);
        const imageAPIUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`;
        const imgRes = await axios.post(imageAPIUrl, formData);
        const imgURL = imgRes.data.data.url;
        console.log("res: ", imgRes);
        console.log("image url: ", imgURL);
        console.log(data);
    }

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
            </div>

            {/* Main Card */}
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
                                    <FileText size={16} className="mr-2" />
                                    Issue Title
                                </label>
                                <input
                                    type="text"
                                    {...register("title", { required: true })}
                                    className="p-2 input input-bordered w-full rounded-xl bg-gray-50 focus:bg-white"
                                    placeholder="e.g. Broken streetlight near school"
                                />
                                {
                                    errors.title?.type === 'required' && <p>Title is Required!</p>
                                }
                            </div>

                            {/* Category */}
                            <div>
                                <label className="label font-semibold text-[#03373D]">
                                    <Tag size={16} className="mr-2" />
                                    Category
                                </label>
                                <select  {...register("category", { required: true })} className="p-2 select select-bordered w-full rounded-xl bg-gray-50 focus:bg-white">
                                    <option disabled>
                                        Select issue category
                                    </option>
                                    <option>Road Damage</option>
                                    <option>Streetlight</option>
                                    <option>Water Leakage</option>
                                    <option>Garbage Overflow</option>
                                    <option>Footpath Damage</option>
                                    <option>Drainage</option>
                                    <option>Traffic Signal</option>
                                    <option>Other</option>
                                </select>
                                {
                                    errors.category?.type === 'required' && <p>Category is Required!</p>
                                }
                            </div>

                            {/* Description */}
                            <div>
                                <label className="label font-semibold text-[#03373D]">
                                    Description
                                </label>
                                <textarea {...register("description", { required: true })}
                                    rows="4"
                                    className="p-2 textarea textarea-bordered w-full rounded-xl bg-gray-50 focus:bg-white"
                                    placeholder="Describe the issue in detail..."
                                ></textarea>
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label className="label font-semibold text-[#03373D]">
                                    <Upload size={16} className="mr-2" />
                                    Upload Photo
                                </label>
                                <input
                                    type="file"
                                    {...register("image", { required: true })}
                                    className="file-input file-input-bordered w-full rounded-xl"
                                />
                                {
                                    errors.image?.type === 'required' && <p>Image is Required!</p>
                                }
                            </div>

                            {/* Location */}
                            <div>
                                <label className="label font-semibold text-[#03373D]">
                                    <MapPin size={16} className="mr-2" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    {...register("location", { required: true })}
                                    className="p-2 input input-bordered w-full rounded-xl bg-gray-50 focus:bg-white"
                                    placeholder="e.g. Kaliganj Bus Stand"
                                />
                                {
                                    errors.location?.type === 'required' && <p>Location is Required!</p>
                                }
                            </div>

                            {/* Leaflet Map Placeholder */}


                            {/* Submit Button */}
                            <button type="submit" className="btn w-full bg-[#03373D] hover:bg-[#05535D] text-white border-none rounded-xl text-lg font-semibold shadow-lg mt-4">
                                Submit Issue
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
                            <h4 className="text-2xl font-bold text-[#03373D] mt-6">
                                Your Report Matters
                            </h4>
                            <p className="text-gray-600 mt-3 max-w-sm mx-auto">
                                Every issue you report helps build a cleaner, safer, and smarter
                                city for everyone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitIssue;