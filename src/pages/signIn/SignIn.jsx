import { Link } from 'react-router';
import signin from '../../assets/animation/signin.png'
import { useForm } from 'react-hook-form';

const SignIn = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleLogin = (data) => {
        console.log(data);
    }

    return (
        <div className="flex gap-3 items-center justify-between bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] w-full rounded-lg p-5 px-20 mb-2 mt-10">
            <div>
                <form onSubmit={handleSubmit(handleLogin)}>
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-[450px] border p-4">


                        <label className="label">Email</label>
                        <input {...register("email", { required: true })} type="email" className="input w-full  p-2" placeholder="Your Email" />
                        {
                            errors.email?.type === "required" && <p>Email is required!</p>
                        }

                        <label className="label">Password</label>
                        <input {...register("password", { required: true, minLength: 6 })} type="password" className="input w-full p-2" placeholder="Your Password" />
                        {
                            errors.password?.type === "required" && <p>Password is required!</p>
                        }
                        {
                            errors.password?.type === "minLength" && <p>Password Length is Short!</p>
                        }


                        <button className="btn mt-4 w-full bg-[#03373D] text-white font-semibold">Login</button>
                        <p className='text-center'>New User? <Link to='/register' className='text-[#03373D]  hover:underline font-bold'>Register</Link></p>
                    </fieldset>
                </form>
            </div>
            <div className="w-[400px]">
                <img src={signin} alt="" />
            </div>
        </div>
    );
};

export default SignIn;