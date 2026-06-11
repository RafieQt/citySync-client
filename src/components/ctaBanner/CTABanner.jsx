import { Link } from "react-router";
import { Crown, Flag } from "lucide-react";
import Lottie from "lottie-react";
import city from "../../assets/animation/City.json";

const LottieComponent = Lottie?.default || Lottie;

const CTABanner = () => {
  return (
    <div
      className="mt-7 rounded-2xl overflow-hidden relative"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-[-50px] right-[-50px] w-56 h-56 rounded-full pointer-events-none"
        style={{ backgroundColor: "var(--color-accent)", opacity: 0.08 }}
      />
      <div
        className="absolute bottom-[-35px] left-[-35px] w-40 h-40 rounded-full pointer-events-none"
        style={{ backgroundColor: "var(--color-accent)", opacity: 0.06 }}
      />

      <div className="flex flex-col lg:flex-row items-center justify-between px-8 sm:px-12 py-12 gap-8 relative z-10">
        {/* Left */}
        <div className="flex-1 text-center lg:text-left">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
            style={{ color: "var(--color-accent)" }}
          >
            Your City Needs <br />
            <span style={{ color: "#FFF4E1" }}>Your Voice</span>
          </h2>
          <p
            className="mt-4 text-base sm:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed"
            style={{ color: "var(--color-accent)" }}
          >
            Spotted a pothole? A broken streetlight? Report it in seconds and
            help make your city safer for everyone.
          </p>
          <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start">
            <Link to="/submitIssue">
              <button
                id="cta-report-btn"
                className="flex items-center gap-2 font-bold rounded-xl px-6 py-3 border-2 border-transparent"
                style={{
                  backgroundColor: "#FFF4E1",
                  color: "var(--color-primary)",
                  transition: "background-color 0.2s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-accent)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFF4E1";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Flag size={18} /> Report an Issue
              </button>
            </Link>
            <Link to="/dashboard/subscription">
              <button
                id="cta-premium-btn"
                className="flex items-center gap-2 font-bold rounded-xl px-6 py-3 border-2"
                style={{
                  backgroundColor: "transparent",
                  color: "#FFF4E1",
                  borderColor: "#FFF4E1",
                  transition: "background-color 0.2s, color 0.2s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFF4E1";
                  e.currentTarget.style.color = "var(--color-primary)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#FFF4E1";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Crown size={18} /> Go Premium
              </button>
            </Link>
          </div>
        </div>

        {/* Right - Lottie */}
        <div className="w-[260px] h-[260px] shrink-0">
          <LottieComponent
            animationData={city}
            loop={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default CTABanner;