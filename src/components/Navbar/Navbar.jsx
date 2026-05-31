import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";
import Logo from "../ErrorPage/logo/Logo";
import face from '../../assets/animation/face.png';
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dbUser } = useUser();

  const handleLogout = () => {
    logout()
      .then(() => toast.success("Logged out successfully"))
      .catch((error) => toast.error(error.message));
  };

  const navLinks = (
    <>
      <li>
        <NavLink to="/all-issues" className={({ isActive }) => isActive ? "font-bold text-[#03373D]" : ""}>
          All Issues
        </NavLink>
      </li>
      <li>
        <NavLink to="/submitIssue" className={({ isActive }) => isActive ? "font-bold text-[#03373D]" : ""}>
          Report Issue
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="max-w-7xl flex flex-col pt-5 mx-auto">
      <div className="navbar bg-[#EBFFFD] shadow-sm rounded-lg px-6">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow">
              {navLinks}
            </ul>
          </div>
          <Logo />
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            {navLinks}
          </ul>
        </div>

        <div className="navbar-end">
          {user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full ring ring-[#03373D] ring-offset-1">
                  <img
                    alt={user.displayName}
                    src={user.photoURL || face}
                    onError={(e) => { e.target.src = face; }}
                  />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-56 p-2 shadow">
                <li className="px-2 py-1">
                  <span className="font-semibold text-[#03373D]">
                    {user.displayName || "User"}
                  </span>
                  {dbUser?.isPremium && (
                    <span className="badge badge-warning badge-sm ml-1">Premium</span>
                  )}
                </li>
                <div className="divider my-0" />
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li>
                  <button onClick={handleLogout} className="text-red-500">Logout</button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/signin">
              <button className="btn bg-[#03373D] text-white font-semibold px-5 border-none hover:bg-[#05535D]">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;