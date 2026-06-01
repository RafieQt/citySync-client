import { Link, useNavigate, useLocation } from "react-router";
import Lottie from "lottie-react";
import join from "../../assets/animation/join.json";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import GoogleLogin from "../../components/googleLogin/GoogleLogin";
import toast from "react-hot-toast";

const LottieComponent = Lottie?.default || Lottie;

const SignIn = () => {
    const { signUser } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleLogin = async (data) => {
        signUser(data.email, data.password)
            .then(() => {
                toast.success("Signed in successfully!");

                navigate(location?.state || "/");
            })
            .catch((error) => {
                console.log(error);

                toast.error(error.message || "Sign in failed. Please try again.");
            });
    };

    return (
        <div className="w-full overflow-hidden px-3 sm:px-5 lg:px-8 py-6 sm:py-10">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] rounded-2xl p-5 sm:p-8 lg:p-12">

                {/* Form Section */}
                <div className="w-full lg:w-1/2">
                    <h2 className="text-[#03373D] font-bold text-3xl sm:text-4xl mb-6 text-center lg:text-left">
                        Sign In
                    </h2>

                    <div className="bg-base-200 border border-base-300 rounded-2xl w-full max-w-[500px] mx-auto lg:mx-0 p-4 sm:p-6">

                        <form onSubmit={handleSubmit(handleLogin)}>

                            {/* Email */}
                            <label className="label font-medium">Email</label>

                            <input
                                {...register("email", { required: true })}
                                type="email"
                                className="input input-bordered w-full"
                                placeholder="Your Email"
                            />

                            {errors.email?.type === "required" && (
                                <p className="text-red-500 text-sm mt-1">
                                    Email is required!
                                </p>
                            )}

                            {/* Password */}
                            <label className="label font-medium mt-3">
                                Password
                            </label>

                            <input
                                {...register("password", {
                                    required: true,
                                    minLength: 6,
                                })}
                                type="password"
                                className="input input-bordered w-full"
                                placeholder="Your Password"
                            />

                            {errors.password?.type === "required" && (
                                <p className="text-red-500 text-sm mt-1">
                                    Password is required!
                                </p>
                            )}

                            {errors.password?.type === "minLength" && (
                                <p className="text-red-500 text-sm mt-1">
                                    Password length is too short!
                                </p>
                            )}

                            {/* Button */}
                            <button className="btn w-full mt-5 bg-[#03373D] hover:bg-[#02282d] text-white border-none rounded-xl">
                                Login
                            </button>

                            {/* Register */}
                            <p className="text-center text-sm sm:text-base my-4">
                                New User?{" "}
                                <Link
                                    to="/register"
                                    className="text-[#03373D] hover:underline font-bold"
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </form>

                        <GoogleLogin />
                    </div>
                </div>

                {/* Animation */}
                <div className="w-full lg:w-1/2 flex justify-center">
                    <div className="w-[220px] sm:w-[300px] lg:w-[400px] max-w-full">
                        <LottieComponent
                            animationData={join}
                            loop={true}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;