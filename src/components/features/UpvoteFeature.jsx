import Lottie from "lottie-react";
import upvote from "../../assets/animation/upvote.json";

const LottieComponent = Lottie?.default || Lottie;

const UpvoteFeature = () => {
  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 rounded-2xl px-6 sm:px-10 py-10 sm:py-12"
        style={{ background: "linear-gradient(135deg, var(--color-gradient-from), var(--color-gradient-to))" }}
      >
        {/* Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2
            className="font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight"
            style={{ color: "var(--color-text-heading)" }}
          >
            Community Upvote System
          </h2>
          <p
            className="text-sm sm:text-lg lg:text-xl mt-4 leading-relaxed max-w-md mx-auto lg:mx-0"
            style={{ color: "var(--color-text-body)" }}
          >
            Support important issues by upvoting them — higher priority means
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