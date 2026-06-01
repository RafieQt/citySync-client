import Lottie from "lottie-react";
import upvote from "../../assets/animation/upvote.json";

const LottieComponent = Lottie?.default || Lottie;

const UpvoteFeature = () => {
    return (
        <div className="w-full overflow-hidden">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] rounded-2xl px-5 sm:px-8 py-8 sm:py-10">

                {/* Text Content */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <h2 className="text-[#03373D] font-bold text-3xl sm:text-4xl lg:text-6xl leading-tight">
                        Community Upvote System
                    </h2>

                    <p className="text-[#355E63] text-sm sm:text-lg lg:text-2xl mt-4 leading-relaxed">
                        Support important issues by upvoting them → higher priority =
                        faster resolution.
                    </p>
                </div>

                {/* Animation */}
                <div className="w-full lg:w-1/2 flex justify-center">
                    <div className="w-[220px] sm:w-[280px] lg:w-[350px] max-w-full">
                        <LottieComponent
                            animationData={upvote}
                            loop={true}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpvoteFeature;