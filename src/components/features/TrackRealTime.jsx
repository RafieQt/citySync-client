import Lottie from "lottie-react";
import phone from '../../assets/animation/phone.json'
const LottieComponent = Lottie?.default || Lottie;
const TrackRealTime = () => {
    return (
        <div className="flex gap-3 items-center justify-between bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] w-full rounded-lg p-5 px-8 mb-2 mt-2">

            <div className='mx-auto' style={{ width: 350 }}>
                <LottieComponent
                    animationData={phone}
                    loop={true}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
            <div>
                <h2 className="text-[#03373D] font-bold text-6xl py-6">Real-Time Issue Tracking</h2>
                <p className="text-[#355E63] text-2xl">Track your issue from Pending → In Progress → Resolved → Closed<br /> anytime, anywhere!</p>
            </div>
        </div>
    );
};

export default TrackRealTime;