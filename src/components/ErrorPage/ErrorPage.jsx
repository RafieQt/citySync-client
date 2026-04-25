import Lottie from 'lottie-react';
import errorAnimation from '../../assets/animation/warning.json';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const LottieComponent = Lottie?.default || Lottie;

const ErrorPage = () => {
    return (
        <div className=''>
            <Navbar></Navbar>
            <div className='flex items-center justify-center min-h-screen'>
                <div className='mx-auto' style={{ width: 300 }}>
                    <LottieComponent
                        animationData={errorAnimation}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default ErrorPage;