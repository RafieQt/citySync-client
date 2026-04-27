import { Link } from 'react-router';
import signin from '../../assets/animation/signin.png'

const SignIn = () => {
    return (
        <div className="flex gap-3 items-center justify-between bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] w-full rounded-lg p-5 px-20 mb-2 mt-2">
            <div>
                <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-[450px] border p-4">
                    

                    <label class="label">Email</label>
                    <input type="email" class="input w-full" placeholder="Email" />

                    <label class="label">Password</label>
                    <input type="password" class="input w-full" placeholder="Password" />

                    <button class="btn mt-4 w-full bg-[#03373D] text-white font-semibold">Login</button>
                    <p className='text-center'>New User? <Link to='/register' className='text-[#03373D]  hover:underline font-bold'>Register</Link></p>
                </fieldset>
            </div>
            <div className="w-[400px]">
                <img src={signin} alt="" />
            </div>
        </div>
    );
};

export default SignIn;