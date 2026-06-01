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
      // Upload profile image
      const profileImage = data.photo[0];

      const formData = new FormData();
      formData.append("image", profileImage);

      const imageAPIUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_host
      }`;

      const imgRes = await axios.post(imageAPIUrl, formData);

      const imgURL = imgRes.data.data.url;

      // Create firebase user
      const result = await registerUser(data.email, data.password);

      const firebaseUser = result.user;

      // Update profile
      await updateProfile(firebaseUser, {
        displayName: data.name,
        photoURL: imgURL,
      });

      // Save user in DB
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
          imageUrl:
            "https://img.icons8.com/?size=100&id=13826&format=png&color=000000",
          imageWidth: 100,
          imageHeight: 100,
          imageAlt: "Custom image",
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
    <div className="w-full px-3 sm:px-6 lg:px-10 py-6 sm:py-10">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] rounded-3xl p-5 sm:p-8 lg:p-12 overflow-hidden">
        
        {/* Left Side */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-[#03373D] font-bold text-3xl sm:text-4xl lg:text-5xl text-center lg:text-left mb-6">
            Create an Account!
          </h2>

          <div className="bg-base-200 border border-base-300 rounded-2xl w-full max-w-[500px] mx-auto lg:mx-0 p-4 sm:p-6 shadow-sm">
            <form onSubmit={handleSubmit(handleRegister)}>
              <fieldset className="space-y-4">
                
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
                  <label className="label font-medium">
                    Profile Picture
                  </label>

                  <div
                    onClick={() => fileRef.current.click()}
                    className="w-16 h-16 rounded-full cursor-pointer overflow-hidden border-2 border-dashed border-[#03373D] flex items-center justify-center bg-white hover:scale-105 transition"
                  >
                    <img
                      src={profileImg}
                      alt="upload"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {errors.photo?.type === "required" && (
                    <p className="text-red-500 text-sm mt-1">
                      Profile Picture is Required!
                    </p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="label font-medium">Name</label>

                  <input
                    {...register("name", { required: true })}
                    type="text"
                    placeholder="Your Name"
                    className="input input-bordered w-full"
                  />

                  {errors.name?.type === "required" && (
                    <p className="text-red-500 text-sm mt-1">
                      Name is Required!
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="label font-medium">Email</label>

                  <input
                    {...register("email", { required: true })}
                    type="email"
                    placeholder="Your Email"
                    className="input input-bordered w-full"
                  />

                  {errors.email?.type === "required" && (
                    <p className="text-red-500 text-sm mt-1">
                      Email is Required!
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="label font-medium">Password</label>

                  <input
                    {...register("password", {
                      required: true,
                      minLength: 6,
                    })}
                    type="password"
                    placeholder="At least 6 characters"
                    className="input input-bordered w-full"
                  />

                  {errors.password?.type === "required" && (
                    <p className="text-red-500 text-sm mt-1">
                      Password is Required!
                    </p>
                  )}

                  {errors.password?.type === "minLength" && (
                    <p className="text-red-500 text-sm mt-1">
                      Minimum Length is 6!
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button className="btn w-full bg-[#03373D] hover:bg-[#02292d] border-none text-white font-semibold rounded-xl mt-2">
                  Sign Up
                </button>

                {/* Redirect */}
                <p className="text-center text-sm sm:text-base">
                  Already a User?{" "}
                  <Link
                    to="/signin"
                    className="text-[#03373D] font-bold hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </fieldset>
            </form>

            <div className="mt-4">
              <GoogleLogin />
            </div>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={signin}
            alt="register"
            className="w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[500px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;