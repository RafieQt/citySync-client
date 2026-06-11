import { Link, useNavigate } from "react-router";
import signin from "../../assets/animation/signin.png";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import profileImg from "../../assets/image-upload-icon.png";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { updateProfile } from "firebase/auth";
import GoogleLogin from "../../components/googleLogin/GoogleLogin";
import Swal from "sweetalert2";

const Register = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const fileRef = useRef(null);

  const { ref, ...rest } = register("photo", {
    required: true,
  });

  const handleRegister = async (data) => {
    try {
      const profileImage = data.photo[0];
      const formData = new FormData();
      formData.append("image", profileImage);

      const imageAPIUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`;
      const imgRes = await axios.post(imageAPIUrl, formData);
      const imgURL = imgRes.data.data.url;

      const result = await registerUser(data.email, data.password);
      const firebaseUser = result.user;

      await updateProfile(firebaseUser, {
        displayName: data.name,
        photoURL: imgURL,
      });

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
        email: data.email,
        name: data.name,
        photo: imgURL,
      });

      await Swal.fire({
        title: "Account Created!",
        text: "Welcome to CitySync!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);

      if (error.code === "auth/email-already-in-use") {
        Swal.fire({
          title: "The email is already used!",
          icon: "warning",
        });
      } else {
        const errorMsg =
          error.response?.data?.error?.message ||
          error.message ||
          "Something went wrong during registration.";

        Swal.fire({
          title: "Registration Failed",
          text: errorMsg,
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <div
        className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 rounded-3xl p-6 sm:p-10 lg:p-14 overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--color-gradient-from), var(--color-gradient-to))" }}
      >
        {/* Left Side */}
        <div className="w-full lg:w-1/2">
          <h2
            className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-center lg:text-left mb-8"
            style={{ color: "var(--color-text-heading)" }}
          >
            Create an Account
          </h2>

          <div className="cs-surface w-full max-w-lg mx-auto lg:mx-0 p-6 sm:p-8">
            <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...rest}
                ref={(e) => {
                  ref(e);
                  fileRef.current = e;
                }}
              />

              {/* Profile Upload */}
              <div>
                <label className="label font-medium block mb-1" style={{ color: "var(--color-text-heading)" }}>
                  Profile Picture
                </label>

                <div
                  onClick={() => fileRef.current.click()}
                  className="w-20 h-20 rounded-full cursor-pointer overflow-hidden border-2 border-dashed flex items-center justify-center hover:scale-105 transition"
                  style={{ borderColor: "var(--color-primary)", backgroundColor: "var(--color-surface-hover)" }}
                >
                  <img
                    src={profileImg}
                    alt="upload"
                    className="w-full h-full object-cover"
                  />
                </div>

                {errors.photo?.type === "required" && (
                  <p className="text-red-500 text-sm mt-1">Profile Picture is Required!</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="label font-medium block mb-1" style={{ color: "var(--color-text-heading)" }}>Name</label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  placeholder="Your Name"
                  className="input input-bordered w-full cs-input"
                />
                {errors.name?.type === "required" && (
                  <p className="text-red-500 text-sm mt-1">Name is Required!</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="label font-medium block mb-1" style={{ color: "var(--color-text-heading)" }}>Email</label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="Your Email"
                  className="input input-bordered w-full cs-input"
                />
                {errors.email?.type === "required" && (
                  <p className="text-red-500 text-sm mt-1">Email is Required!</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="label font-medium block mb-1" style={{ color: "var(--color-text-heading)" }}>Password</label>
                <input
                  {...register("password", { required: true, minLength: 6 })}
                  type="password"
                  placeholder="At least 6 characters"
                  className="input input-bordered w-full cs-input"
                />
                {errors.password?.type === "required" && (
                  <p className="text-red-500 text-sm mt-1">Password is Required!</p>
                )}
                {errors.password?.type === "minLength" && (
                  <p className="text-red-500 text-sm mt-1">Minimum Length is 6!</p>
                )}
              </div>

              {/* Submit */}
              <button className="cs-btn-primary w-full mt-6 py-3" style={{ fontSize: "1rem" }}>
                Sign Up
              </button>

              {/* Redirect */}
              <p className="text-center text-sm sm:text-base mt-6" style={{ color: "var(--color-text-body)" }}>
                Already a User?{" "}
                <Link to="/signin" className="font-bold hover:underline" style={{ color: "var(--color-primary)" }}>
                  Sign In
                </Link>
              </p>
            </form>

            <div className="mt-6">
              <GoogleLogin />
            </div>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={signin}
            alt="register"
            className="w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[500px] object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;