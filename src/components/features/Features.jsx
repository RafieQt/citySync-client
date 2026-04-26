import { Swiper, SwiperSlide } from "swiper/react";
import EasyReport from "./EasyReport";
import PremiumFeature from "./PremiumFeature";
import TrackRealTime from "./TrackRealTime";
import UpvoteFeature from "./UpvoteFeature";
import { Autoplay, Pagination } from 'swiper/modules';
import "swiper/css";
import "swiper/css/pagination";
const Features = () => {
    return (
        <div className="mt-7">

            <Swiper
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    dynamicBullets: true,
                }}
                modules={[Autoplay, Pagination]}
                className="mySwiper pb-2"
            >
                <SwiperSlide><EasyReport></EasyReport></SwiperSlide>
                <SwiperSlide><TrackRealTime></TrackRealTime></SwiperSlide>
                <SwiperSlide><UpvoteFeature></UpvoteFeature></SwiperSlide>
                <SwiperSlide><PremiumFeature></PremiumFeature></SwiperSlide>

            </Swiper>





        </div>
    );
};

export default Features;