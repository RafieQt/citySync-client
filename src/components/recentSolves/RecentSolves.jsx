import Lottie from "lottie-react";
import maintenance from '../../assets/animation/Maintenance.json';
import SolvedCards from "./SolvedCards";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const LottieComponent = Lottie?.default || Lottie;

const RecentSolves = () => {
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["resolvedIssues"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/issues/resolved`);
      return res.data;
    },
  });

  return (
    <div className="bg-gradient-to-r rounded-lg from-[#E0F7F5] to-[#CDEEEE] mt-7">
      <div className="flex items-center justify-between gap-3 h-[400px] bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] w-full rounded-lg p-5 px-8">
        <div className="mx-auto w-[300px] h-[300px] mb-2 mt-2">
          <LottieComponent
            animationData={maintenance}
            loop={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="text-end">
          <h2 className="text-[#03373D] font-bold text-6xl py-4">
            Making the City Better,<br /> One Fix at a Time
          </h2>
          <p className="text-[#355E63] text-2xl">
            See how reported issues are being resolved across your city.
          </p>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-[#03373D] mb-6 px-2">Recently Resolved Issues</h3>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg text-[#03373D]" />
          </div>
        ) : issues.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No resolved issues yet.</p>
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