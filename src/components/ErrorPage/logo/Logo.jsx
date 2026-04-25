import { HeartHandshake } from "lucide-react";
import { Link } from "react-router";


const Logo = () => {
    return (
        <Link to='/'>
            <div className="hover:cursor-pointer bg-[#EBFFFD]">
            <h2 className=" flex items-center gap-1 font-semibold">CitySync <HeartHandshake /></h2>
        </div>
        </Link>
    );
};

export default Logo;