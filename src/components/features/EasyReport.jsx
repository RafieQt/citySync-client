import Lottie from "lottie-react";
import paper from "../../assets/animation/paperwork.json";

const LottieComponent = Lottie?.default || Lottie;

const EasyReport = () => {
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
            Easy Issue Reporting
          </h2>
          <p
            className="text-sm sm:text-lg lg:text-xl mt-4 leading-relaxed max-w-md mx-auto lg:mx-0"
            style={{ color: "var(--color-text-body)" }}
          >
            Report problems like potholes, garbage, or broken lights in seconds
            with location &amp; photo. No paperwork hassle!
          </p>
        </div>

        {/* Animation */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-[220px] sm:w-[280px] lg:w-[350px] max-w-full">
            <LottieComponent
              animationData={paper}
              loop={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EasyReport;