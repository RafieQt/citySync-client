import Banner from "../../components/banner/Banner";
import HeroBanner from "../../components/banner/HeroBanner";
import CategoriesShowcase from "../../components/categories/CategoriesShowcase";

import Features from "../../components/features/Features";
import RecentSolves from "../../components/recentSolves/RecentSolves";


const HomePage = () => {
    return (
        <div>
            <HeroBanner></HeroBanner>
            
            <RecentSolves></RecentSolves>
            <Features></Features>
            <CategoriesShowcase />
            <Banner></Banner>
        </div>
    );
};

export default HomePage;