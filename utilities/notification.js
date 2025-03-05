let audioContext;
let audioBuffers = {}; // Store preloaded audio buffers

// Initialize the Audio Context (must be done after user interaction)
const initializeAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
};

// Load and decode an audio file into a buffer
const loadAudioBuffer = async (key, url) => {
    initializeAudioContext();
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBuffers[key] = audioBuffer; // Store the fully decoded buffer
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
    }
};

// Load all sounds (must be called once at startup)
const loadAllSounds = async () => {
    await Promise.all([
        loadAudioBuffer('notification', '/audio/ding.mp3'),
        loadAudioBuffer('error', '/audio/error.mp3'),
        loadAudioBuffer('success', '/audio/success.mp3'),
        loadAudioBuffer('fatal', '/audio/fatal.mp3')
    ]);
};

// Play a sound with a new AudioBufferSourceNode
const playSound = (key) => {
    if (!audioBuffers[key]) {
        console.error(`Audio buffer for '${key}' not loaded.`);
        return;
    }

    initializeAudioContext();

    // Create a new AudioBufferSourceNode each time
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffers[key];
    source.connect(audioContext.destination);

    // Ensure the sound doesn't get cut off prematurely
    source.start( 0);

    // Fix for garbage collection: Keep a reference until playback ends
    setTimeout(() => {
        source.disconnect(); // Cleanup after sound finishes
    }, audioBuffers[key].duration * 1000); // Convert seconds to milliseconds
};

// Wrapper functions for playing specific sounds
const playNotificationSound = () => playSound('notification');
const playErrorNotificationSound = () => playSound('error');
const playSuccessNotificationSound = () => playSound('success');
const playFatalNotificationSound = () => playSound('fatal');

// Export functions
export { loadAllSounds, playNotificationSound, playErrorNotificationSound, playSuccessNotificationSound, playFatalNotificationSound };
