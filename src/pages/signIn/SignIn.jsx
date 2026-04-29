import { Link } from 'react-router';
import Lottie from "lottie-react";
const LottieComponent = Lottie?.default || Lottie;
import join from '../../assets/animation/join.json'
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import GoogleLogin from '../../components/googleLogin/GoogleLogin';

const SignIn = () => {
    const { signUser } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleLogin = async (data) => {
        console.log(data);

        signUser(data.email, data.password).then(res => console.log("sign ", res)).catch(error => {
            console.log(error);
        })

    }

    return (
        <div className="flex gap-3 items-center justify-between bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] w-full rounded-lg p-5 px-20 mt-10">
            <div>
                <h2 className='text-[#03373D] font-bold text-4xl py-6'>Sign In</h2>
                <div  className="fieldset bg-base-200 border-base-300 rounded-box w-[450px] border p-4">
                    <form onSubmit={handleSubmit(handleLogin)}>
                        <fieldset>

                            {/* Email */}
                            <label className="label">Email</label>
                            <input {...register("email", { required: true })} type="email" className="input w-full  p-2" placeholder="Your Email" />
                            {
                                errors.email?.type === "required" && <p>Email is required!</p>
                            }

                            {/* password */}
                            <label className="label mt-2">Password</label>
                            <input {...register("password", { required: true, minLength: 6 })} type="password" className="input w-full p-2" placeholder="Your Password" />
                            {
                                errors.password?.type === "required" && <p>Password is required!</p>
                            }
                            {
                                errors.password?.type === "minLength" && <p>Password Length is Short!</p>
                            }


                            <button className="btn mt-4 w-full bg-[#03373D] text-white font-semibold">Login</button>
                            <p className='text-center my-2'>New User? <Link to='/register' className='text-[#03373D]  hover:underline font-bold'>Sign Up</Link></p>
                        </fieldset>
                    </form>
                <GoogleLogin></GoogleLogin>
                </div>
            </div>
            <div className='' style={{ width: 350 }}>
                <LottieComponent
                    animationData={join}
                    loop={true}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        </div>
    );
};

export default SignIn;