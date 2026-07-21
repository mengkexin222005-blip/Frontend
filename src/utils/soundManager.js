
import notificationSoundFile from '../assets/sounds/notification-sound.mp3'; 

let notificationAudio = null;

const getAudio = () => {
  if (!notificationAudio) {
    notificationAudio = new Audio(notificationSoundFile);
    notificationAudio.preload = 'auto';
  }
  return notificationAudio;
};
  
export const preloadNotificationSound = () => {
  try {
    const audio = getAudio();
    audio.load();
  } catch (error) {
    console.warn('Failed to preload notification sound:', error);
  }
};

export const playNotificationSound = (enabled) => {
  if (!enabled) return;

  try {
    const audio = getAudio();
    audio.currentTime = 0;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        if (error.name === 'NotAllowedError') {
          console.warn('Autoplay blocked — sound will play after user interaction');
        } else {
          console.warn('Failed to play notification sound:', error);
        }
      });
    }
  } catch (error) {
    console.warn('Error playing notification sound:', error);
  }
};