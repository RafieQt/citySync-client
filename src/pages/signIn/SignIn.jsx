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
    setValue,
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

  const fillDemoAndSubmit = (email, password) => {
    setValue("email", email);
    setValue("password", password);
    handleLogin({ email, password });
  };

  return (
    <div className="w-full overflow-hidden px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <div
        className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 rounded-3xl p-6 sm:p-10 lg:p-14"
        style={{ background: "linear-gradient(135deg, var(--color-gradient-from), var(--color-gradient-to))" }}
      >
        {/* Form Section */}
        <div className="w-full lg:w-1/2">
          <h2
            className="font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-8 text-center lg:text-left"
            style={{ color: "var(--color-text-heading)" }}
          >
            Welcome Back
          </h2>

          <div className="cs-surface w-full max-w-lg mx-auto lg:mx-0 p-6 sm:p-8">
            {/* Demo Accounts */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-sm font-semibold mb-3 text-center" style={{ color: "var(--color-text-muted)" }}>
                Quick Login (Demo Accounts)
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => fillDemoAndSubmit("cityadmin@gmail.com", "123456")}
                  className="cs-btn-outline"
                  style={{ padding: "4px 12px", fontSize: "0.8rem" }}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAndSubmit("micro@gmail.com", "123456")}
                  className="cs-btn-outline"
                  style={{ padding: "4px 12px", fontSize: "0.8rem" }}
                >
                  Staff
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAndSubmit("citizen@gmail.com", "123456")}
                  className="cs-btn-outline"
                  style={{ padding: "4px 12px", fontSize: "0.8rem" }}
                >
                  Citizen
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <label className="label font-medium block mb-1" style={{ color: "var(--color-text-heading)" }}>
                  Email
                </label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  className="input input-bordered w-full cs-input"
                  placeholder="Your Email"
                />
                {errors.email?.type === "required" && (
                  <p className="text-red-500 text-sm mt-1">Email is required!</p>
                )}
              </div>

              <div>
                <label className="label font-medium block mb-1" style={{ color: "var(--color-text-heading)" }}>
                  Password
                </label>
                <input
                  {...register("password", { required: true, minLength: 6 })}
                  type="password"
                  className="input input-bordered w-full cs-input"
                  placeholder="Your Password"
                />
                {errors.password?.type === "required" && (
                  <p className="text-red-500 text-sm mt-1">Password is required!</p>
                )}
                {errors.password?.type === "minLength" && (
                  <p className="text-red-500 text-sm mt-1">Password length is too short!</p>
                )}
              </div>

              <button className="cs-btn-primary w-full mt-6 py-3" style={{ fontSize: "1rem" }}>
                Login
              </button>

              <p className="text-center text-sm sm:text-base mt-6" style={{ color: "var(--color-text-body)" }}>
                New User?{" "}
                <Link to="/register" className="font-bold hover:underline" style={{ color: "var(--color-primary)" }}>
                  Sign Up
                </Link>
              </p>
            </form>

            <div className="mt-6">
              <GoogleLogin />
            </div>
          </div>
        </div>

        {/* Animation */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-[220px] sm:w-[320px] lg:w-[450px] max-w-full">
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