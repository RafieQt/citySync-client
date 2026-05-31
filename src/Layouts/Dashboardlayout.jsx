
import { NavLink, Outlet, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";
import Logo from "../../components/ErrorPage/logo/Logo";
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
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../components/Loading/Loading";

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
  return (
    <div className="flex flex-col h-full py-6 px-4 gap-2">
      <div className="mb-6 px-2">
        <Logo />
        <p className="text-xs text-gray-400 mt-2 capitalize">
          {dbUser?.role} Dashboard
        </p>
      </div>

      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#03373D] text-white"
                : "text-gray-600 hover:bg-[#EAF8F7] hover:text-[#03373D]"
            }`
          }
        >
          {link.icon}
          {link.label}
        </NavLink>
      ))}

      <div className="mt-auto">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 mb-2">
          <img
            src={user?.photoURL || "/default-avatar.png"}
            className="w-9 h-9 rounded-full object-cover"
            alt={user?.displayName}
            onError={(e) => {
              e.target.src = "https://i.pravatar.cc/40";
            }}
          />

          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-[#03373D] truncate">
              {user?.displayName}
            </p>

            <p className="text-xs text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-sm btn-outline border-red-300 text-red-500 hover:bg-red-50 w-full rounded-xl gap-2"
        >
          <LogOut size={15} />
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 shadow-sm fixed h-full">
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
          <div className="w-64 bg-white shadow-xl">
            <div className="flex justify-end p-3">
              <button onClick={() => setSidebarOpen(false)}>
                <X size={22} />
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
            className="flex-1 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile Topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn btn-ghost btn-sm"
          >
            <Menu size={22} />
          </button>

          <Logo />
        </div>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

