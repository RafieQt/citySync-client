import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const RootLayout = () => {
  return (
    <div style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh", transition: "background-color 0.3s ease" }}>
      <Navbar />
      <div className="flex-1 min-h-screen max-w-7xl flex flex-col pt-5 mx-auto px-4">
        <Outlet />
      </div>
      <div className="max-w-7xl flex flex-col pt-5 mx-auto px-4">
        <Footer />
      </div>
    </div>
  );
};

export default RootLayout;