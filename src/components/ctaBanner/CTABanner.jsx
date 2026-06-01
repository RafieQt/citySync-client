import { Link } from "react-router";
import { Crown, Flag } from "lucide-react";
import Lottie from "lottie-react";
import city from "../../assets/animation/City.json";

const LottieComponent = Lottie?.default || Lottie;

const CTABanner = () => {
  return (
    <div className="mt-7 rounded-3xl overflow-hidden bg-[#03373D] relative">
      <div className="flex flex-col lg:flex-row items-center justify-between px-10 py-12 gap-8">
        {/* Left */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Your City Needs <br />
            <span className="text-[#A8F0EB]">Your Voice</span>
          </h2>
          <p className="text-[#A8F0EB] mt-4 text-lg max-w-md">
            Spotted a pothole? A broken streetlight? Report it in seconds and
            help make your city safer for everyone.
          </p>
          <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start">
            <Link to="/submitIssue">
              <button className="btn bg-white text-[#03373D] border-none rounded-xl px-6 font-bold hover:bg-[#A8F0EB] gap-2">
                <Flag size={18} /> Report an Issue
              </button>
            </Link>
            <Link to="/dashboard/subscription">
              <button className="btn btn-outline border-white text-white rounded-xl px-6 font-bold hover:bg-white hover:text-[#03373D] gap-2">
                <Crown size={18} /> Go Premium
              </button>
            </Link>
          </div>
        </div>

        {/* Right - Lottie */}
        <div className="w-[280px] h-[280px] shrink-0">
          <LottieComponent
            animationData={city}
            loop={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white opacity-5" />
      <div className="absolute bottom-[-30px] left-[-30px] w-36 h-36 rounded-full bg-white opacity-5" />
    </div>
  );
};

export default CTABanner;