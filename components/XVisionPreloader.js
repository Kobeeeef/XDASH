import { useEffect, useState } from 'react';
import { loadAllSounds } from '@/utilities/notification';
import DecryptedText from '@/components/DecryptedText';
import GradientText from '@/components/GradientText';
import ShinyText from '@/components/ShinyText';
import FuzzyText from '@/components/FuzzyText';
import TrueFocus from '@/components/TrueFocus';
import BlurText from '@/components/BlurText';
const XVisionPreloader = ({ children }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [text, setText] = useState("");
    const [finalText, setFinalText] = useState('');






    return (
        <>
            {!isLoaded && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div className="flex align-items-center">
                        <img
                            style={{ objectFit: 'contain' }}
                            src="/images/logo/xvision.png"
                            alt="Logo"
                            className="xl:w-6rem lg:w-5rem sm:w-4rem w-3rem mr-4"
                        />

                        <GradientText
                            colors={["#5865F2", "#5865F2", "#40ffaa", "#5865F2", "#40ffaa"]}
                            animationSpeed={3}
                            showBorder={false}
                            className="xl:text-8xl lg:text-8xl sm:text-7xl text-5xl"
                        >
                            XVISION

                        </GradientText>
                    </div>

                    <BlurText
                        text="By XBOT ROBOTICS"
                        delay={70}
                        animateBy="letters"
                        direction="top"
                        className="text-xl mb-8 font-bold"
                    />
                </div>
            )}
            {isLoaded && children}
        </>
    );
};

export default XVisionPreloader;
