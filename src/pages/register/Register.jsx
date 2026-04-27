import { Link } from 'react-router';
import signin from '../../assets/animation/signin.png'
import { useForm } from 'react-hook-form';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleRegister = (data) => {
        console.log(data);
    }
    return (
        <div className="flex gap-3 items-center justify-between bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] w-full rounded-lg p-5 px-20 mb-2 mt-10">
            <div>
                <form onSubmit={handleSubmit(handleRegister)}>
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-[450px] border p-4">

                        {/* Name */}
                        <label className="label">Name</label>
                        <input {...register("name", { required: true })} type="text" className="input w-full p-2" placeholder="Your Name" />
                        {
                            errors.name?.type === "required" && <p>Name is Required!</p>
                        }

                        {/* Email */}
                        <label className="label">Email</label>
                        <input {...register("email", { required: true })} type="email" className="input w-full p-2" placeholder="Your Email" />
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

                        <button className="btn mt-4 w-full bg-[#03373D] text-white font-semibold">Login</button>
                        <p className='text-center'>Already a User? <Link to='/signin' className='text-[#03373D]  hover:underline font-bold'>Sign In</Link></p>
                    </fieldset>
                </form>
            </div>
            <div className="w-[400px]">
                <img src={signin} alt="" />
            </div>
        </div>
    );
};

export default Register;