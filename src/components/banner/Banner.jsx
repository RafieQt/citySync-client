import Lottie from "lottie-react";
import city from "../../assets/animation/City.json";

const LottieComponent = Lottie?.default || Lottie;

const Banner = () => {
    return (
        <div className="w-full overflow-hidden mt-5">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] rounded-2xl px-5 sm:px-8 py-8 sm:py-10 min-h-[400px]">

                {/* Text Content */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <h2 className="text-[#03373D] font-bold text-3xl sm:text-4xl lg:text-6xl leading-tight">
                        Your Voice Can Fix the City
                    </h2>

                    <p className="text-[#355E63] text-sm sm:text-lg lg:text-2xl mt-4 leading-relaxed">
                        A digital platform to report, track, and
                        <br className="hidden lg:block" />
                        resolve public infrastructure issues.
                    </p>
                </div>

                {/* Animation */}
                <div className="w-full lg:w-1/2 flex justify-center overflow-hidden">
                    <div className="w-[240px] sm:w-[320px] lg:w-[500px] max-w-full">
                        <LottieComponent
                            animationData={city}
                            loop={true}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;