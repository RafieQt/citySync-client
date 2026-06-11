import { NavLink, Outlet, useNavigate, Link } from "react-router";
import useAuth from "../hooks/useAuth";
import useUser from "../hooks/useUser";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  Settings,
  ClipboardList,
  CheckCircle,
  CreditCard,
  LogOut,
  Menu,
  X,
  Crown,
  HeartHandshake,
  Sun,
  Moon
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Loading from "../components/Loading/Loading";
import { useTheme } from "../Contexts/ThemeContext";

const citizenLinks = [
  {
    to: "/dashboard",
    label: "Overview",
    icon: <LayoutDashboard size={18} />,
    end: true,
  },
  {
    to: "/dashboard/my-issues",
    label: "My Issues",
    icon: <FileText size={18} />,
  },
  {
    to: "/submitIssue",
    label: "Report Issue",
    icon: <PlusCircle size={18} />,
  },
  {
    to: "/dashboard/subscription",
    label: "Go Premium",
    icon: <Crown size={18} />,
  },
  {
    to: "/dashboard/profile",
    label: "Profile",
    icon: <Settings size={18} />,
  },
];

const staffLinks = [
  {
    to: "/dashboard",
    label: "Overview",
    icon: <LayoutDashboard size={18} />,
    end: true,
  },
  {
    to: "/dashboard/assigned-issues",
    label: "Assigned Issues",
    icon: <ClipboardList size={18} />,
  },
  {
    to: "/dashboard/profile",
    label: "Profile",
    icon: <Settings size={18} />,
  },
];

const adminLinks = [
  {
    to: "/dashboard",
    label: "Overview",
    icon: <LayoutDashboard size={18} />,
    end: true,
  },
  {
    to: "/dashboard/all-issues-admin",
    label: "All Issues",
    icon: <FileText size={18} />,
  },
  {
    to: "/dashboard/manage-users",
    label: "Manage Users",
    icon: <Users size={18} />,
  },
  {
    to: "/dashboard/manage-staff",
    label: "Manage Staff",
    icon: <CheckCircle size={18} />,
  },
  {
    to: "/dashboard/payments",
    label: "Payments",
    icon: <CreditCard size={18} />,
  },
  {
    to: "/dashboard/profile",
    label: "Profile",
    icon: <Settings size={18} />,
  },
];

const roleLinks = {
  citizen: citizenLinks,
  staff: staffLinks,
  admin: adminLinks,
};

const SidebarContent = ({
  links,
  dbUser,
  user,
  setSidebarOpen,
  handleLogout,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col h-full py-6 px-4 gap-2">
      <div className="mb-6 px-2 flex items-center justify-between">
        <div>
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg shrink-0"
            style={{ color: "var(--color-text-heading)" }}
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ backgroundColor: "var(--color-primary)", color: "var(--color-bg)" }}
            >
              <HeartHandshake size={18} />
            </span>
            CitySync
          </Link>
          <p className="text-xs mt-2 capitalize font-semibold" style={{ color: "var(--color-text-muted)" }}>
            {dbUser?.role} Dashboard
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className="cs-theme-toggle"
          style={{ width: "32px", height: "32px" }}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
        </button>
      </div>

      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors mb-1 ${
              isActive ? "active-link" : "inactive-link"
            }`
          }
          style={({ isActive }) => ({
            backgroundColor: isActive ? "var(--color-primary)" : "transparent",
            color: isActive ? "var(--color-bg)" : "var(--color-text-body)",
          })}
        >
          {link.icon}
          {link.label}
        </NavLink>
      ))}

      <div className="mt-auto">
        <div 
          className="flex items-center gap-3 px-3 py-3 rounded-xl mb-3 min-w-0"
          style={{ backgroundColor: "var(--color-surface-hover)" }}
        >
          <img
            src={user?.photoURL || "/default-avatar.png"}
            className="w-10 h-10 rounded-full object-cover ring-2"
            style={{ ringColor: "var(--color-border)" }}
            alt={user?.displayName}
            onError={(e) => {
              e.target.src = "https://i.pravatar.cc/40";
            }}
          />

          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate" style={{ color: "var(--color-text-heading)" }}>
              {user?.displayName}
            </p>

            <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="cs-btn-outline w-full gap-2 py-2"
          style={{ borderColor: "#dc2626", color: "#dc2626" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#fee2e2";
            e.currentTarget.style.color = "#dc2626";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { dbUser, isLoading } = useUser();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) return <Loading />;

  const links = roleLinks[dbUser?.role] || citizenLinks;

  const handleLogout = () => {
    logout().then(() => {
      toast.success("Logged out");
      navigate("/signin");
    });
  };

  return (
    <div className="flex min-h-screen max-w-full overflow-x-hidden" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Desktop Sidebar */}
      <aside 
        className="hidden lg:flex flex-col w-64 fixed h-full z-20"
        style={{ backgroundColor: "var(--color-surface)", borderRight: "1px solid var(--color-border)" }}
      >
        <SidebarContent
          links={links}
          dbUser={dbUser}
          user={user}
          setSidebarOpen={setSidebarOpen}
          handleLogout={handleLogout}
        />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="w-64 max-w-[80vw] overflow-y-auto"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <div className="flex justify-end p-4 border-b" style={{ borderColor: "var(--color-border)" }}>
              <button 
                onClick={() => setSidebarOpen(false)}
                style={{ color: "var(--color-text-heading)" }}
              >
                <X size={24} />
              </button>
            </div>

            <SidebarContent
              links={links}
              dbUser={dbUser}
              user={user}
              setSidebarOpen={setSidebarOpen}
              handleLogout={handleLogout}
            />
          </div>

          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen min-w-0 flex flex-col">
        {/* Mobile Topbar */}
        <div 
          className="lg:hidden flex items-center gap-3 px-4 py-4 shadow-sm z-10 sticky top-0"
          style={{ backgroundColor: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ color: "var(--color-text-heading)" }}
          >
            <Menu size={24} />
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg"
            style={{ color: "var(--color-text-heading)" }}
          >
            <span
              className="flex items-center justify-center w-7 h-7 rounded-md"
              style={{ backgroundColor: "var(--color-primary)", color: "var(--color-bg)" }}
            >
              <HeartHandshake size={14} />
            </span>
            CitySync
          </Link>
        </div>

        <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
