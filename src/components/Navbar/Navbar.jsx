import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import Logo from "../ErrorPage/logo/Logo";
import face from '../../assets/animation/face.png'



const Navbar = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout()
            .then()
            .catch(error => {
                console.log(error);
            })
    }

    const lists = <>
        <Link to='/submitIssue'><li>Report Issue</li></Link>
        <Link><li>Issue list</li></Link>
    </>
    return (
        <div className="max-w-7xl flex flex-col pt-5 mx-auto">
            <div className="navbar bg-[#EBFFFD] shadow-sm rounded-lg px-6">
                <div className="flex-1">
                    <Logo></Logo>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                       {lists}
                    </ul>
                </div>
                <div className=" navbar-end flex-none">
                    {
                        user ? <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src={user ? user?.photoURL : face} />
                                </div>
                            </div>
                            <ul
                                tabIndex="-1"
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                <li>
                                    <a className="justify-between">
                                        User Name.
                                        <span className="badge">Premium</span>
                                    </a>
                                </li>
                                <li><a>Dashboard</a></li>
                                <button onClick={handleLogout} className="btn">Logout</button>
                            </ul>
                        </div> : <Link to='/signin'>
                            <button className="btn bg-[#03373D] text-white font-semibold px-3">Login</button>
                        </Link>
                    }


                </div>
            </div>
        </div>
    );
};

export default Navbar;