import Banner from "../../components/banner/Banner";
import Features from "../../components/features/Features";
import RecentSolves from "../../components/recentSolves/RecentSolves";


const HomePage = () => {
    return (
        <div>
            <Banner></Banner>
            <RecentSolves></RecentSolves>
            <Features></Features>
        </div>
    );
};

export default HomePage;