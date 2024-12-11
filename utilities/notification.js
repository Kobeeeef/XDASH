// Helper function to preload and ensure readiness
const loadAudio = (audio) => {
    audio.preload = 'auto'; // Ensure preload is set
    audio.load(); // Load the audio file for readiness
};

// Create audio instances
let notificationSound = null;
let errorNotificationSound = null;
let successNotificationSound = null;

// Load all audio files
const loadAllSounds = () => {
    notificationSound = new Audio('/audio/ding.mp3');
    loadAudio(notificationSound);
    errorNotificationSound = new Audio('/audio/error.mp3');
    loadAudio(errorNotificationSound);
    successNotificationSound = new Audio('/audio/success.mp3');
    loadAudio(successNotificationSound);
};

// Play functions
const playNotificationSound = () => {
    if (!notificationSound) notificationSound = new Audio('/audio/ding.mp3');
    notificationSound.currentTime = 0; // Reset playback position
    notificationSound.play().catch(error => {
        console.error('Audio play was prevented:', error); // Handle autoplay restrictions
    });
};

const playErrorNotificationSound = () => {
    if (!errorNotificationSound) errorNotificationSound = new Audio('/audio/error.mp3');
    errorNotificationSound.currentTime = 0; // Reset playback position
    errorNotificationSound.play().catch(error => {
        console.error('Audio play was prevented:', error); // Handle autoplay restrictions
    });
};

const playSuccessNotificationSound = () => {
    if (!successNotificationSound) successNotificationSound = new Audio('/audio/success.mp3');
    successNotificationSound.currentTime = 0; // Reset playback position
    successNotificationSound.play().catch(error => {
        console.error('Audio play was prevented:', error); // Handle autoplay restrictions
    });
};

// Export load and play methods
export { loadAllSounds, playNotificationSound, playErrorNotificationSound, playSuccessNotificationSound };
