import Lottie from "lottie-react";
import paper from '../../assets/animation/paperwork.json'
const LottieComponent = Lottie?.default || Lottie;
const EasyReport = () => {
    return (
        <div className="flex gap-3 items-center justify-between bg-gradient-to-r from-[#E0F7F5] to-[#CDEEEE] w-full rounded-lg p-5 px-8 mb-2 mt-2">
            <div>
                <h2 className="text-[#03373D] font-bold text-6xl py-6">Easy Issue Reporting</h2>
                <p className="text-[#355E63] text-2xl">Report problems like potholes, garbage, or broken lights in<br /> seconds with location & photo. No paperwork hassle!</p>
            </div>
            <div>
                <div className='mx-auto' style={{ width: 350 }}>
                    <LottieComponent
                        animationData={paper}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default EasyReport;