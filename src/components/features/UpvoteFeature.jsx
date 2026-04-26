import Lottie from "lottie-react";
import upvote from '../../assets/animation/upvote.json'
const LottieComponent = Lottie?.default || Lottie;
const UpvoteFeature = () => {
    return (
        <div className="flex gap-3 items-center justify-between bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] w-full rounded-lg p-5 px-8 mb-2 mt-2">
            <div>
                <h2 className="text-[#03373D] font-bold text-6xl py-6">Community Upvote System</h2>
                <p className="text-[#355E63] text-2xl">Support important issues by upvoting them → higher priority = faster resolution.</p>
            </div>
            <div>
                <div className='mx-auto' style={{ width: 350 }}>
                    <LottieComponent
                        animationData={upvote}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default UpvoteFeature;