import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import axios from "axios";

const CATEGORIES = [
  { name: "Road Damage",      icon: "🛣️" },
  { name: "Streetlight",     icon: "💡" },
  { name: "Water Leakage",   icon: "💧" },
  { name: "Garbage Overflow",icon: "🗑️" },
  { name: "Footpath Damage", icon: "🚶" },
  { name: "Drainage",        icon: "🌊" },
  { name: "Traffic Signal",  icon: "🚦" },
  { name: "Other",           icon: "🔧" },
];

const CategoriesShowcase = () => {
  const navigate = useNavigate();

  const { data: issues = [] } = useQuery({
    queryKey: ["allIssuesForCategories"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/issues?limit=1000`
      );
      return res.data.result;
    },
  });

  const getCount = (categoryName) =>
    issues.filter((i) => i.category === categoryName).length;

  return (
    <div className="mt-7">
      <div className="text-center mb-8">
        <h2
          className="text-3xl sm:text-4xl font-extrabold"
          style={{ color: "var(--color-text-heading)" }}
        >
          Browse by Category
        </h2>
        <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--color-text-muted)" }}>
          Find and filter issues by type across your city.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => {
          const count = getCount(cat.name);
          return (
            <button
              key={cat.name}
              id={`category-${cat.name.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() =>
                navigate(
                  `/all-issues?category=${encodeURIComponent(cat.name)}`
                )
              }
              className="group flex flex-col items-center gap-3 p-5 rounded-xl text-center cursor-pointer"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "0 2px 8px var(--color-shadow)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-primary)";
                e.currentTarget.style.backgroundColor = "var(--color-accent-soft)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 6px 20px var(--color-shadow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.backgroundColor = "var(--color-surface)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px var(--color-shadow)";
              }}
            >
              <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                {cat.icon}
              </span>
              <p
                className="font-bold text-sm"
                style={{ color: "var(--color-text-heading)" }}
              >
                {cat.name}
              </p>
              <span
                className="cs-badge cs-badge--primary"
                style={{ fontSize: "0.7rem" }}
              >
                {count} {count === 1 ? "issue" : "issues"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesShowcase;