import EasyReport from "./EasyReport";
import PremiumFeature from "./PremiumFeature";
import TrackRealTime from "./TrackRealTime";
import UpvoteFeature from "./UpvoteFeature";

const Features = () => {
    return (
        <div>
            <EasyReport></EasyReport>
            <TrackRealTime></TrackRealTime>
            <UpvoteFeature></UpvoteFeature>
            <PremiumFeature></PremiumFeature>
        </div>
    );
};

export default Features;