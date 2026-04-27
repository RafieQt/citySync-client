import { Link } from 'react-router';
import signin from '../../assets/animation/signin.png'

const Register = () => {
    return (
        <div className="flex gap-3 items-center justify-between bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] w-full rounded-lg p-5 px-20 mb-2 mt-10">
            <div>
                <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-[450px] border p-4">


                    <label class="label">Name</label>
                    <input type="text" class="input w-full p-2" placeholder="Your Name" />

                    <label class="label">Email</label>
                    <input type="email" class="input w-full p-2" placeholder="Your Email" />

                    <label class="label">Password</label>
                    <input type="password" class="input w-full p-2" placeholder="At least six characters or digit." />

                    <button class="btn mt-4 w-full bg-[#03373D] text-white font-semibold">Login</button>
                    <p className='text-center'>Already a User? <Link to='/signin' className='text-[#03373D]  hover:underline font-bold'>Sign In</Link></p>
                </fieldset>
            </div>
            <div className="w-[400px]">
                <img src={signin} alt="" />
            </div>
        </div>
    );
};

export default Register;