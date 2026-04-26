import Lottie from "lottie-react";
import maintenance from '../../assets/animation/Maintenance.json'
import SolvedCards from "./SolvedCards";

const LottieComponent = Lottie?.default || Lottie;
const RecentSolves = () => {
    return (
        <div className="bg-gradient-to-r rounded-lg from-[#E0F7F5] to-[#CDEEEE] mt-7">

            <div className=' flex items-center justify-between gap-3 h-[400px] bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] w-full rounded-lg p-5 px-8'>
                <div className='mx-auto w-[300px] h-[300px] mb-2 mt-2'>
                    <LottieComponent
                        animationData={maintenance}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>

                <div className="text-end">
                    <h2 className="text-[#03373D] font-bold text-6xl py-4">Making the City Better,<br /> One Fix at a Time</h2>
                    <p className="text-[#355E63] text-2xl">See how reported issues are being resolved across your city.</p>
                </div>

            </div>
            <div>
                <SolvedCards></SolvedCards>
            </div>
        </div>
    );
};

export default RecentSolves;