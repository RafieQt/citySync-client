import Lottie from "lottie-react";
import crown from '../../assets/animation/Crown.json'
const LottieComponent = Lottie?.default || Lottie;
const PremiumFeature = () => {
    return (
        <div className="flex gap-3 items-center justify-between bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] w-full rounded-lg p-5 px-8 mb-2 mt-2">

            <div className='mx-auto' style={{ width: 350 }}>
                <LottieComponent
                    animationData={crown}
                    loop={true}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
            <div>
                <h2 className="text-[#03373D] font-bold text-6xl py-6 text-end">Priority Boost</h2>
                <p className="text-[#355E63] text-2xl text-end">Boost your issue to High Priority so it gets resolved faster than others!</p>
            </div>
        </div>
    );
};

export default PremiumFeature;