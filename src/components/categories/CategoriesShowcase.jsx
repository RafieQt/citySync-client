import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import axios from "axios";

const CATEGORIES = [
  { name: "Road Damage", icon: "🛣️" },
  { name: "Streetlight", icon: "💡" },
  { name: "Water Leakage", icon: "💧" },
  { name: "Garbage Overflow", icon: "🗑️" },
  { name: "Footpath Damage", icon: "🚶" },
  { name: "Drainage", icon: "🌊" },
  { name: "Traffic Signal", icon: "🚦" },
  { name: "Other", icon: "🔧" },
];

const CategoriesShowcase = () => {
  const navigate = useNavigate();

  const { data: issues = [] } = useQuery({
    queryKey: ["allIssuesForCategories"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/issues?limit=1000`);
      return res.data.result;
    },
  });

  const getCount = (categoryName) =>
    issues.filter((i) => i.category === categoryName).length;

  return (
    <div className="mt-7">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-[#03373D]">Browse by Category</h2>
        <p className="text-gray-500 mt-2">
          Find and filter issues by type across your city.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => {
          const count = getCount(cat.name);
          return (
            <div
              key={cat.name}
              onClick={() => navigate(`/all-issues?category=${encodeURIComponent(cat.name)}`)}
              className="cursor-pointer group bg-white border border-gray-100 rounded-2xl p-5 flex flex-col items-center gap-3 shadow-sm hover:shadow-md hover:border-[#03373D] hover:bg-[#EAF8F7] transition-all"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <p className="font-bold text-[#03373D] text-center text-sm">{cat.name}</p>
              <div className="badge bg-[#03373D] text-white border-none">
                {count} {count === 1 ? "issue" : "issues"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesShowcase;