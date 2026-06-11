import Lottie from "lottie-react";
import maintenance from "../../assets/animation/Maintenance.json";
import SolvedCards from "./SolvedCards";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const LottieComponent = Lottie?.default || Lottie;

/* Skeleton placeholder card */
const SkeletonCard = () => (
  <div className="cs-skeleton-card" style={{ height: 360 }}>
    <div className="cs-skeleton" style={{ height: 180 }} />
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <div className="cs-skeleton" style={{ height: 14, width: "40%" }} />
      <div className="cs-skeleton" style={{ height: 18, width: "80%" }} />
      <div className="cs-skeleton" style={{ height: 14, width: "90%" }} />
      <div className="cs-skeleton" style={{ height: 14, width: "70%" }} />
      <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
        <div className="cs-skeleton" style={{ height: 12, width: "30%" }} />
        <div className="cs-skeleton" style={{ height: 12, width: "25%" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <div className="cs-skeleton" style={{ height: 28, width: "28%" }} />
        <div className="cs-skeleton" style={{ height: 32, width: "36%", borderRadius: 8 }} />
      </div>
    </div>
  </div>
);

const RecentSolves = () => {
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["resolvedIssues"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/issues/resolved`
      );
      return res.data;
    },
  });

  return (
    <div
      className="rounded-2xl mt-7 overflow-hidden"
      style={{ background: "linear-gradient(135deg, var(--color-gradient-from), var(--color-gradient-to))" }}
    >
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 px-6 sm:px-10 py-10 sm:py-12 min-h-[360px]">
        {/* Animation */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-[220px] sm:w-[280px] lg:w-[350px] max-w-full">
            <LottieComponent
              animationData={maintenance}
              loop={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        {/* Text */}
        <div className="w-full lg:w-1/2 text-center lg:text-right">
          <h2
            className="font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight"
            style={{ color: "var(--color-text-heading)" }}
          >
            Making the City Better,
            <br />
            One Fix at a Time
          </h2>
          <p
            className="text-sm sm:text-lg mt-4 leading-relaxed max-w-md ml-auto"
            style={{ color: "var(--color-text-body)" }}
          >
            See how reported issues are being resolved across your city.
          </p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="px-4 sm:px-6 pb-8">
        <h3
          className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left"
          style={{ color: "var(--color-text-heading)" }}
        >
          Recently Resolved Issues
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : issues.length === 0 ? (
          <p className="text-center py-10" style={{ color: "var(--color-text-muted)" }}>
            No resolved issues yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {issues.map((issue) => (
              <SolvedCards key={issue._id} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentSolves;