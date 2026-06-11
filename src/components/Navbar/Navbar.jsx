import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";
import face from "../../assets/animation/face.png";
import toast from "react-hot-toast";
import { HeartHandshake, Sun, Moon, Menu } from "lucide-react";
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

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/all-issues"
          className={({ isActive }) =>
            `cs-nav-link${isActive ? " active" : ""}`
          }
        >
          All Issues
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/submitIssue"
          className={({ isActive }) =>
            `cs-nav-link${isActive ? " active" : ""}`
          }
        >
          Report Issue
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
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div
                    className="w-9 rounded-full"
                    style={{ ring: "2px solid var(--color-accent)" }}
                  >
                    <img
                      alt={user.displayName}
                      src={user.photoURL || face}
                      onError={(e) => { e.target.src = face; }}
                      className="rounded-full w-9 h-9 object-cover ring-2"
                      style={{ ringColor: "var(--color-accent)" }}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content rounded-xl z-50 mt-2 w-56 p-2 shadow-lg"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-body)",
                  }}
                >
                  <li className="px-3 py-2">
                    <span className="font-semibold" style={{ color: "var(--color-text-heading)" }}>
                      {user.displayName || "User"}
                    </span>
                    {dbUser?.isPremium && (
                      <span className="cs-badge cs-badge--boosted ml-1">Premium</span>
                    )}
                  </li>
                  <div style={{ height: 1, backgroundColor: "var(--color-border)", margin: "4px 0" }} />
                  <li>
                    <Link
                      to="/dashboard"
                      className="cs-nav-link block w-full"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="cs-nav-link w-full text-left"
                      style={{ color: "#dc2626" }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
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

export default Navbar;