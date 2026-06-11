import Lottie from "lottie-react";
import city from "../../assets/animation/City.json";
import { Link } from "react-router";
import { Flag, Search } from "lucide-react";

const LottieComponent = Lottie?.default || Lottie;

const Banner = () => {
  return (
    <div className="w-full overflow-hidden mt-5">
      <div
        className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 rounded-2xl px-6 sm:px-10 py-10 sm:py-14 min-h-[420px] relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--color-gradient-from), var(--color-gradient-to))",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ backgroundColor: "var(--color-accent)" }}
        />
        <div
          className="absolute bottom-[-40px] left-[-40px] w-40 h-40 rounded-full opacity-10 pointer-events-none"
          style={{ backgroundColor: "var(--color-primary)" }}
        />

        {/* Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{
              backgroundColor: "var(--color-accent-soft)",
              color: "var(--color-primary)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            Report • Track • Resolve
          </div>

          <h1
            className="font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-tight mb-4"
            style={{ color: "var(--color-text-heading)" }}
          >
            Your Voice Can{" "}
            <span style={{ color: "var(--color-primary-hover)" }}>
              Fix the City
            </span>
          </h1>

          <p
            className="text-sm sm:text-lg lg:text-xl leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            style={{ color: "var(--color-text-body)" }}
          >
            A digital platform to report, track, and resolve public
            infrastructure issues — powered by the community.
          </p>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link to="/submitIssue">
              <button
                id="banner-report-btn"
                className="cs-btn-primary gap-2"
                style={{ padding: "10px 22px", fontSize: "1rem" }}
              >
                <Flag size={18} /> Report an Issue
              </button>
            </Link>
            <Link to="/all-issues">
              <button
                id="banner-browse-btn"
                className="cs-btn-outline gap-2"
                style={{ padding: "10px 22px", fontSize: "1rem" }}
              >
                <Search size={18} /> Browse Issues
              </button>
            </Link>
          </div>
        </div>

        {/* Animation */}
        <div className="w-full lg:w-1/2 flex justify-center overflow-hidden z-10">
          <div className="w-[240px] sm:w-[320px] lg:w-[480px] max-w-full">
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