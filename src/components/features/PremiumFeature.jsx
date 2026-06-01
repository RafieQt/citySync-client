import Lottie from "lottie-react";
import crown from "../../assets/animation/Crown.json";

const LottieComponent = Lottie?.default || Lottie;

const PremiumFeature = () => {
    return (
        <div className="w-full overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] rounded-2xl px-5 sm:px-8 py-8 sm:py-10">

                {/* Animation */}
                <div className="w-full lg:w-1/2 flex justify-center">
                    <div className="w-[220px] sm:w-[280px] lg:w-[350px] max-w-full">
                        <LottieComponent
                            animationData={crown}
                            loop={true}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>
                </div>

                {/* Text Content */}
                <div className="w-full lg:w-1/2 text-center lg:text-right">
                    <h2 className="text-[#03373D] font-bold text-3xl sm:text-4xl lg:text-6xl leading-tight">
                        Priority Boost
                    </h2>

                    <p className="text-[#355E63] text-sm sm:text-lg lg:text-2xl mt-4 leading-relaxed">
                        Boost your issue to High Priority so it gets resolved faster
                        than others!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PremiumFeature;