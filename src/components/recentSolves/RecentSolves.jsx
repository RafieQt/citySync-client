import Lottie from "lottie-react";
import maintenance from "../../assets/animation/Maintenance.json";
import SolvedCards from "./SolvedCards";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const LottieComponent = Lottie?.default || Lottie;

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
    <div className="bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] rounded-2xl mt-7 overflow-hidden">

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 px-5 sm:px-8 py-8 sm:py-10 min-h-[400px]">

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
          <h2 className="text-[#03373D] font-bold text-3xl sm:text-4xl lg:text-6xl leading-tight">
            Making the City Better,
            <br />
            One Fix at a Time
          </h2>

          <p className="text-[#355E63] text-sm sm:text-lg lg:text-2xl mt-4 leading-relaxed">
            See how reported issues are being resolved across your city.
          </p>
        </div>
      </div>

      {/* Recent Solves */}
      <div className="px-4 sm:px-6 pb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-[#03373D] mb-6 text-center sm:text-left">
          Recently Resolved Issues
        </h3>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg text-[#03373D]" />
          </div>
        ) : issues.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            No resolved issues yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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