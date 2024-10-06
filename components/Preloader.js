import { useEffect, useState } from 'react';

const Preloader = ({ children }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [text, setText] = useState("");
    const [finalText, setFinalText] = useState('');
    useEffect(() => {
        const texts = [
            'Setting up resources',
            'Loading assets',
            'Initializing modules',
            'Finalizing setup',
        ];
        let currentIndex = 0;
        let typingIndex = 0;

        // Function to handle typing the final message
        const typeFinalText = () => {
            const finalMessage = 'XBOT DASHBOARD';
            let finalIndex = 0;

            const finalTextInterval = setInterval(() => {
                setFinalText((prev) => {
                    // Update finalText state based on the previous value
                    if (finalIndex < finalMessage.length) {
                        finalIndex++;
                        return prev + finalMessage[finalIndex - 1];
                    } else {
                        clearInterval(finalTextInterval);
                        setTimeout(() => setIsLoaded(true), 500); // Delay before showing content
                        return prev;
                    }
                });
            }, 50); // Adjust the speed of the final typing animation here
        };

        // Check if the document is already loaded
        const handleLoad = () => {
            setTimeout(() => {


                clearInterval(textInterval);
                setText(''); // Clear any current text
                typeFinalText(); // Start the final typing animation
            }, 500);
        };

        // Attach event listeners to check if the document is fully loaded
        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
            document.addEventListener('DOMContentLoaded', handleLoad);
        }

        // Typing animation cycle for loading texts
        const textInterval = setInterval(() => {
            setText((prev) => {
                // Update text state based on the previous value
                if (typingIndex < texts[currentIndex].length) {
                    typingIndex++;
                    return prev + texts[currentIndex][typingIndex - 1];
                } else {
                    // Move to the next text once the current one finishes typing
                    currentIndex = (currentIndex + 1) % texts.length;
                    typingIndex = 0;
                    return ''; // Reset the text for the next cycle
                }
            });
        }, 10); // Adjust typing speed here

        return () => {
            clearInterval(textInterval);
            window.removeEventListener('load', handleLoad);
            document.removeEventListener('DOMContentLoaded', handleLoad);
        };
    }, []);

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
                    <img
                        src="/images/logo/logo.png"
                        alt="Logo"
                        className={"xl:w-30rem lg:w-25rem sm:w-20rem w-9"}
                        style={{
                            marginBottom: '16px',
                        }}
                    />
                    <div
                        className={"font-extrabold text-xl"}
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        {finalText || text}
                    </div>
                </div>
            )}
            {isLoaded && children}
        </>
    );
};

export default Preloader;
