/**
 * Audio System Module
 * Handles audio playback with fallback for different browsers
 */

const audioCache = {};

/**
 * Creates an Audio object with fallback for different file formats
 * @param {string} fileName - Base name of the audio file (without extension)
 * @returns {Audio} Audio object
 */
function createAudioWithFallback(fileName) {
  if (audioCache[fileName]) {
    return audioCache[fileName];
  }

  const audio = new Audio();
  const formats = ['.mp3', '.wav', '.ogg'];
  
  for (const format of formats) {
    audio.src = `./sounds/${fileName}${format}`;
    audio.load();
    if (audio.duration > 0 || audio.readyState >= 2) {
      break;
    }
  }
  
  audioCache[fileName] = audio;
  return audio;
}

/**
 * Plays a sound effect with optional delay
 * @param {string} soundKey - Key identifying the sound to play
 * @param {number} delay - Delay in milliseconds before playing
 */
function playSound(soundKey, delay = 0) {
  setTimeout(() => {
    const audio = createAudioWithFallback(soundKey);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, delay);
}

/**
 * Unlocks audio context (required for some browsers)
 */
function unlockAudio() {
  const audio = createAudioWithFallback('click');
  audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
  }).catch(() => {});
}
