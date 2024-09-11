const playNotificationSound = () => {
    const audio = new Audio('/audio/ding.mp3'); // Path to your sound file
    audio.play().catch(error => {
        console.error('Audio play was prevented:', error); // In case autoplay restrictions apply
    });
};
const playErrorNotificationSound = () => {
    const audio = new Audio('/audio/error.mp3'); // Path to your sound file
    audio.play().catch(error => {
        console.error('Audio play was prevented:', error); // In case autoplay restrictions apply
    });
};
const playSuccessNotificationSound = () => {
    const audio = new Audio('/audio/success.mp3'); // Path to your sound file
    audio.play().catch(error => {
        console.error('Audio play was prevented:', error); // In case autoplay restrictions apply
    });
};
export { playNotificationSound, playErrorNotificationSound, playSuccessNotificationSound };
