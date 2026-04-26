import Lottie from 'lottie-react';
import errorAnimation from '../../assets/animation/warning.json';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Link } from 'react-router';

const LottieComponent = Lottie?.default || Lottie;

const ErrorPage = () => {
    return (
        <div className=''>
            <Navbar></Navbar>
            <div className='flex flex-col gap-4 items-center min-h-screen'>
                <div className='flex items-center justify-center my-20'>
                    <div className='mx-auto' style={{ width: 300 }}>
                        <LottieComponent
                            animationData={errorAnimation}
                            loop={true}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                </div>
                <Link to='/'>
                    <button className='btn bg-[#CDEEEE] text-[#03373D] mx-auto text-center w-20 font-bold'>Home</button>
                </Link>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default ErrorPage;