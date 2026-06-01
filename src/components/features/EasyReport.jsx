import Lottie from "lottie-react";
import paper from "../../assets/animation/paperwork.json";

const LottieComponent = Lottie?.default || Lottie;

const EasyReport = () => {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] rounded-2xl px-5 sm:px-8 py-8 sm:py-10">
        
        {/* Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-[#03373D] font-bold text-3xl sm:text-4xl lg:text-6xl leading-tight">
            Easy Issue Reporting
          </h2>

          <p className="text-[#355E63] text-sm sm:text-lg lg:text-2xl mt-4 leading-relaxed">
            Report problems like potholes, garbage, or broken lights in
            seconds with location & photo.
            <br className="hidden lg:block" />
            No paperwork hassle!
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