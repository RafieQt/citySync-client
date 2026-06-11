import Banner from "../../components/banner/Banner";
import HeroBanner from "../../components/banner/HeroBanner";
import CategoriesShowcase from "../../components/categories/CategoriesShowcase";
import CTABanner from "../../components/ctaBanner/CTABanner";
import Features from "../../components/features/Features";
import RecentSolves from "../../components/recentSolves/RecentSolves";


const HomePage = () => {
    return (
        <div>
            <HeroBanner></HeroBanner>
            <Banner></Banner>
            <RecentSolves></RecentSolves>
            <Features></Features>
            <CategoriesShowcase />
            <CTABanner></CTABanner>
        </div>
    );
};

export default HomePage;