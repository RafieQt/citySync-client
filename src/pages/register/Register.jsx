import { Link, useNavigate } from 'react-router';
import signin from '../../assets/animation/signin.png'
import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import profileImg from '../../assets/image-upload-icon.png'
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { updateProfile } from "firebase/auth";
import GoogleLogin from '../../components/googleLogin/GoogleLogin';
import Swal from 'sweetalert2';

const Register = () => {

    const { registerUser } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const fileRef = useRef(null);
    const { ref, ...rest } = register("photo", { required: true });

    const handleRegister = async (data) => {
        try {
            // 1. Upload profile photo
            const profileImage = data.photo[0];
            const formData = new FormData();
            formData.append("image", profileImage);
            const imageAPIUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`;
            const imgRes = await axios.post(imageAPIUrl, formData);
            const imgURL = imgRes.data.data.url;

            // 2. Create Firebase account
            const result = await registerUser(data.email, data.password);
            const firebaseUser = result.user;

            // 3. Set displayName + photoURL in Firebase
            await updateProfile(firebaseUser, {
                displayName: data.name,
                photoURL: imgURL,
            });

            // 4. Save to MongoDB with correct name + photo
            await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
                email: data.email,
                displayName: data.name,
                photoURL: imgURL,
            });

            // 5. Success → navigate home
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
                    imageUrl: "https://img.icons8.com/?size=100&id=13826&format=png&color=000000",
                    imageWidth: 100,
                    imageHeight: 100,
                    imageAlt: "Custom image"
                });
            } else {
                const errorMsg = error.response?.data?.error?.message || error.message || "Something went wrong during registration.";
                Swal.fire({
                    title: "Registration Failed",
                    text: errorMsg,
                    icon: "error",
                });
            }
        }
    }

    return (
        <div className="flex gap-3 items-center justify-between bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] w-full rounded-lg p-5 px-20 mb-2 mt-10">
            <div>
                <h2 className='text-[#03373D] font-bold text-4xl py-6'>Create an Account!</h2>
                <div className="fieldset bg-base-200 border-base-300 rounded-box w-[450px] border p-4">
                    <form onSubmit={handleSubmit(handleRegister)}>
                        <fieldset>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                {...rest}
                               
                                ref={(e) => {
                                    ref(e);
                                    fileRef.current = e;
                                }}
                            />
                            <label className='label'>Profile Picture</label>

                            <div onClick={() => fileRef.current.click()} className='w-12 h-12 rounded-full hover:cursor-pointer'>
                                <img src={profileImg} className='hover:cursor-pointer' alt="" />
                            </div>
                            {
                                errors.photo?.type === "required" && <p>Profile Picture is Required!</p>
                            }

                            {/* Name */}
                            <label className="label">Name</label>
                            <input {...register("name", { required: true })} type="text" className="input w-full p-2" placeholder="Your Name" />
                            {
                                errors.name?.type === "required" && <p>Name is Required!</p>
                            }

                            {/* Email */}
                            <label className="label mt-2">Email</label>
                            <input {...register("email", { required: true })} type="email" className="input w-full p-2 mb-2" placeholder="Your Email" />
                            {
                                errors.email?.type === "required" && <p>Email is Required!</p>
                            }

                            {/* Password */}
                            <label className="label">Password</label>
                            <input {...register("password", { required: true, minLength: 6 })} type="password" className="input w-full p-2" placeholder="At least six characters or digit." />
                            {
                                errors.password?.type === "required" && <p>Password is Required!</p>
                            }
                            {
                                errors.password?.type === "minLength" && <p>Minimum Length is 6!</p>
                            }

                            <button className="btn mt-4 w-full bg-[#03373D] text-white font-semibold">Sign Up</button>
                            <p className='text-center my-2'>Already a User? <Link to='/signin' className='text-[#03373D]  hover:underline font-bold'>Sign In</Link></p>
                        </fieldset>
                    </form>
                    <GoogleLogin></GoogleLogin>
                </div>
            </div>
            <div className="w-[400px]">
                <img src={signin} alt="" />
            </div>
        </div>
    );
};

export default Register;