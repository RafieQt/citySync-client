import Lottie from 'lottie-react';
import city from '../../assets/animation/City.json'
const LottieComponent = Lottie?.default || Lottie;
const Banner = () => {
    return (
        <div className='flex items-center justify-between gap-3 h-[400px] px-8 bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] w-full rounded-lg p-5 pr-0'>
            <div className="">
                <h2 className="text-[#03373D] font-bold text-6xl py-4">Your Voice Can Fix the City</h2>
                <p className="text-[#355E63] text-2xl">A digital platform to report, track, and <br />resolve public infrastructure issues.</p>
            </div>
            <div className='mx-auto w-fit h-max overflow-hidden mb-2 mt-2 pr-0'>
                <LottieComponent
                    animationData={city}
                    loop={true}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        </div>
    );
};

export default Banner;