import Lottie from "lottie-react";
import phone from "../../assets/animation/phone.json";

const LottieComponent = Lottie?.default || Lottie;

const TrackRealTime = () => {
  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex flex-col lg:flex-row items-center justify-between gap-8 rounded-2xl px-6 sm:px-10 py-10 sm:py-12"
        style={{ background: "linear-gradient(135deg, var(--color-gradient-from), var(--color-gradient-to))" }}
      >
        {/* Animation */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-[220px] sm:w-[280px] lg:w-[350px] max-w-full">
            <LottieComponent
              animationData={phone}
              loop={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-right">
          <h2
            className="font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight"
            style={{ color: "var(--color-text-heading)" }}
          >
            Real-Time Issue Tracking
          </h2>
          <p
            className="text-sm sm:text-lg lg:text-xl mt-4 leading-relaxed max-w-md ml-auto"
            style={{ color: "var(--color-text-body)" }}
          >
            Track your issue from Pending → In Progress → Resolved → Closed,
            anytime, anywhere!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackRealTime;