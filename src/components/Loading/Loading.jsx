import Lottie from 'lottie-react';
import loadingAni from '../../assets/animation/Loading.json'
const LottieComponent = Lottie?.default || Lottie;
const Loading = () => {
    return (
        <div>
            <div className='' style={{ width: 350 }}>
                            <LottieComponent
                                animationData={loadingAni}
                                loop={true}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
        </div>
    );
};

export default Loading;