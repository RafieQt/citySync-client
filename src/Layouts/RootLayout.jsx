import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";


const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className='flex-1 min-h-screen max-w-7xl flex flex-col pt-5 mx-auto'>
                <Outlet></Outlet>
            </div>
            <div className="max-w-7xl flex flex-col pt-5 mx-auto">
                <Footer></Footer>
            </div>
        </div>
    );
};

export default RootLayout;