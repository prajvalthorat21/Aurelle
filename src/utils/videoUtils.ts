/**
 * AURELLE — Cross-Browser Robust Video Playback Helper
 * Safely manages HTML5 video play() promises across desktop and mobile devices.
 */

export const safePlayVideo = (video: HTMLVideoElement | null): Promise<void> => {
  return new Promise((resolve) => {
    if (!video || typeof window === 'undefined') return resolve();

    // Verify element is mounted in DOM
    if (!document.contains(video)) return resolve();

    // Do not re-issue play() if already playing
    if (!video.paused && !video.ended) return resolve();

    // Force required browser autoplay attributes prior to play()
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const executePlay = () => {
      if (!video || !document.contains(video)) return resolve();
      if (!video.paused && !video.ended) return resolve();

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => resolve())
          .catch((error: Error) => {
            // Handle browser policy or temporary load aborts gracefully
            if (error.name === 'AbortError' || error.name === 'NotAllowedError') {
              const retryPlayback = () => {
                if (video && document.contains(video) && video.paused) {
                  video.muted = true;
                  video.play().catch(() => {});
                }
              };
              video.addEventListener('canplay', retryPlayback, { once: true });
              video.addEventListener('playing', () => {}, { once: true });
            }
            resolve();
          });
      } else {
        resolve();
      }
    };

    // Wait until video has frame data (readyState >= 2: HAVE_CURRENT_DATA)
    if (video.readyState >= 2) {
      executePlay();
    } else {
      // Listen to canplay and loadeddata (when frame data is actually ready)
      const onReady = () => {
        if (video.readyState >= 2) {
          executePlay();
        }
      };
      video.addEventListener('canplay', onReady, { once: true });
      video.addEventListener('loadeddata', onReady, { once: true });
    }
  });
};
