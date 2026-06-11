import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";
import face from "../../assets/animation/face.png";
import toast from "react-hot-toast";
import {
  HeartHandshake,
  Sun,
  Moon,
  Menu,
  LayoutDashboard,
  FileText,
  CreditCard,
  LogOut,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useTheme } from "../../Contexts/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dbUser } = useUser();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout()
      .then(() => toast.success("Logged out successfully"))
      .catch((error) => toast.error(error.message));
  };

  // Role-based dashboard links shown inside the dropdown
  const getRoleLinks = () => {
    const role = dbUser?.role;
    if (role === "admin") {
      return (
        <>
          <DropdownLink to="/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" />
          <DropdownLink to="/dashboard/manage-users" icon={<ShieldCheck size={15} />} label="Manage Users" />
          <DropdownLink to="/dashboard/all-issues-admin" icon={<FileText size={15} />} label="All Issues" />
          <DropdownLink to="/dashboard/payments" icon={<CreditCard size={15} />} label="Payments" />
        </>
      );
    }
    if (role === "staff") {
      return (
        <>
          <DropdownLink to="/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" />
          <DropdownLink to="/dashboard/assigned-issues" icon={<Wrench size={15} />} label="Assigned Issues" />
        </>
      );
    }
    // citizen (default)
    return (
      <>
        <DropdownLink to="/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" />
        <DropdownLink to="/dashboard/my-issues" icon={<FileText size={15} />} label="My Issues" />
        {!dbUser?.isPremium && (
          <DropdownLink
            to="/dashboard/subscription"
            icon={<CreditCard size={15} />}
            label="Upgrade to Premium"
            badge="Free"
          />
        )}
      </>
    );
  };

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/all-issues"
          className={({ isActive }) => `cs-nav-link${isActive ? " active" : ""}`}
        >
          All Issues
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/submitIssue"
          className={({ isActive }) => `cs-nav-link${isActive ? " active" : ""}`}
        >
          Report Issue
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/aboutUs"
          className={({ isActive }) => `cs-nav-link${isActive ? " active" : ""}`}
        >
          About Us
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/contactUs"
          className={({ isActive }) => `cs-nav-link${isActive ? " active" : ""}`}
        >
          Contact Us
        </NavLink>
      </li>
    </>
  );

  return (
    <div
      className="sticky top-0 z-50"
      style={{
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
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

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-1 list-none m-0 p-0">
            {navLinks}
          </ul>

          {/* Right Controls */}
          <div className="flex items-center gap-2">

            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="cs-theme-toggle"
              aria-label="Toggle theme"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Auth Section */}
            {user ? (
              <div className="dropdown dropdown-end">
                {/* Avatar trigger */}
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-9 rounded-full">
                    <img
                      alt={user.displayName}
                      src={user.photoURL || face}
                      onError={(e) => { e.target.src = face; }}
                      className="rounded-full w-9 h-9 object-cover"
                    />
                  </div>
                </div>

                {/* Dropdown panel */}
                <div
                  tabIndex={0}
                  className="dropdown-content rounded-2xl z-50 mt-2 w-64 overflow-hidden shadow-lg"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {/* ── Profile header ── */}
                  <div
                    className="p-4"
                    style={{ borderBottom: "1px solid var(--color-border)" }}
                  >
                    {/* Avatar + name + email */}
                    <div className="flex items-center gap-3">
                      <img
                        src={user.photoURL || face}
                        onError={(e) => { e.target.src = face; }}
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                        alt={user.displayName}
                      />
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="font-semibold text-sm truncate"
                            style={{ color: "var(--color-text-heading)" }}
                          >
                            {user.displayName || "User"}
                          </span>
                          {dbUser?.isPremium && (
                            <span className="cs-badge cs-badge--boosted text-xs">
                              Premium
                            </span>
                          )}
                        </div>
                        <p
                          className="text-xs truncate mt-0.5"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Mini stat tiles */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div
                        className="rounded-xl p-2.5"
                        style={{ backgroundColor: "var(--color-surface-hover)" }}
                      >
                        <p
                          className="text-xs mb-0.5"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          Role
                        </p>
                        <p
                          className="text-sm font-semibold capitalize"
                          style={{ color: "var(--color-text-heading)" }}
                        >
                          {dbUser?.role || "—"}
                        </p>
                      </div>
                      <div
                        className="rounded-xl p-2.5"
                        style={{ backgroundColor: "var(--color-surface-hover)" }}
                      >
                        <p
                          className="text-xs mb-0.5"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          Issues
                        </p>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--color-text-heading)" }}
                        >
                          {dbUser?.issueCount ?? "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ── Role-based nav links ── */}
                  <div className="p-1.5">
                    {getRoleLinks()}
                  </div>

                  {/* ── Logout ── */}
                  <div
                    className="p-1.5"
                    style={{ borderTop: "1px solid var(--color-border)" }}
                  >
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm w-full text-left transition-colors hover:bg-red-50"
                      style={{ color: "#dc2626" }}
                    >
                      <LogOut size={15} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/signin">
                <button
                  id="login-btn"
                  className="cs-btn-primary"
                  style={{ fontSize: "0.875rem", padding: "7px 16px" }}
                >
                  Login
                </button>
              </Link>
            )}

            {/* Mobile Menu */}
            <div className="dropdown dropdown-end lg:hidden">
              <button
                tabIndex={0}
                className="cs-theme-toggle"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content rounded-xl z-50 mt-2 w-48 p-2 shadow-lg"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {navLinks}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Helper component for dropdown nav links ──
const DropdownLink = ({ to, icon, label, badge }) => (
  <Link
    to={to}
    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm cs-nav-link"
    style={{ display: "flex", alignItems: "center" }}
  >
    <span style={{ color: "var(--color-text-muted)", display: "flex" }}>
      {icon}
    </span>
    {label}
    {badge && (
      <span
        className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-bg)",
          opacity: 0.85,
        }}
      >
        {badge}
      </span>
    )}
  </Link>
);

export default Navbar;