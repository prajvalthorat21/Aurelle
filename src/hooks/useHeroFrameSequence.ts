import { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL_FRAMES = 96;

/**
 * Returns formatted WebP path for a frame index (1 to 96)
 */
export function getFramePath(frameIndex: number): string {
  const paddedNumber = String(frameIndex).padStart(4, '0');
  return `/assets/hero/ring/frames/frame-${paddedNumber}.webp`;
}

interface UseHeroFrameSequenceOptions {
  totalFrames?: number;
  mobileStep?: number;
}

export function useHeroFrameSequence({
  totalFrames = TOTAL_FRAMES,
  mobileStep = 2,
}: UseHeroFrameSequenceOptions = {}) {
  const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Store preloaded HTMLImageElements in a ref to avoid React re-renders
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingStatusRef = useRef<Map<number, 'loading' | 'loaded' | 'error'>>(new Map());

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Preload an individual frame by index (1 to 96)
  const preloadFrame = useCallback((index: number): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (imagesRef.current.has(index)) {
        resolve(imagesRef.current.get(index)!);
        return;
      }

      if (loadingStatusRef.current.get(index) === 'loading') {
        // Already loading, poll briefly
        const checkInterval = setInterval(() => {
          if (imagesRef.current.has(index)) {
            clearInterval(checkInterval);
            resolve(imagesRef.current.get(index)!);
          }
        }, 50);
        return;
      }

      loadingStatusRef.current.set(index, 'loading');
      const img = new Image();
      img.src = getFramePath(index);

      img.onload = () => {
        imagesRef.current.set(index, img);
        loadingStatusRef.current.set(index, 'loaded');
        setLoadedCount((prev) => prev + 1);
        if (index === 1) {
          setIsFirstFrameLoaded(true);
        }
        resolve(img);
      };

      img.onerror = () => {
        loadingStatusRef.current.set(index, 'error');
        // Try fallback path if needed
        const fallbackPath = `/assets/motion/hero-scroll/frame-${String(index).padStart(4, '0')}.webp`;
        const fallbackImg = new Image();
        fallbackImg.src = fallbackPath;
        fallbackImg.onload = () => {
          imagesRef.current.set(index, fallbackImg);
          loadingStatusRef.current.set(index, 'loaded');
          setLoadedCount((prev) => prev + 1);
          if (index === 1) {
            setIsFirstFrameLoaded(true);
          }
          resolve(fallbackImg);
        };
        fallbackImg.onerror = (err) => {
          console.error(`Failed to load frame ${index}`, err);
          reject(err);
        };
      };
    });
  }, []);

  // Progressive Loading Pipeline
  useEffect(() => {
    let isCancelled = false;

    // Step 1: Immediately load Frame 1 for zero initial delay
    preloadFrame(1);

    // Detect if device is mobile to tune initial chunk batching
    const isMobile = window.innerWidth <= 768;
    const step = isMobile ? mobileStep : 1;

    // Step 2: Priority batch (Frames 2-12 and key quarter points)
    const priorityIndices: number[] = [];
    for (let i = 2; i <= 12; i += step) {
      priorityIndices.push(i);
    }
    [24, 36, 48, 60, 72, 84, 96].forEach((quarterIdx) => {
      if (!priorityIndices.includes(quarterIdx)) {
        priorityIndices.push(quarterIdx);
      }
    });

    const loadPriorityBatch = async () => {
      for (const idx of priorityIndices) {
        if (isCancelled) return;
        await preloadFrame(idx).catch(() => {});
      }

      // Step 3: Progressive idle loading for remaining frames
      const remainingIndices: number[] = [];
      for (let i = 1; i <= totalFrames; i += step) {
        if (!priorityIndices.includes(i) && i !== 1) {
          remainingIndices.push(i);
        }
      }

      // Load in small background batches of 6
      const BATCH_SIZE = 6;
      let batchOffset = 0;

      const loadNextBatch = () => {
        if (isCancelled || batchOffset >= remainingIndices.length) return;
        const currentBatch = remainingIndices.slice(batchOffset, batchOffset + BATCH_SIZE);
        batchOffset += BATCH_SIZE;

        Promise.all(currentBatch.map((idx) => preloadFrame(idx).catch(() => {}))).then(() => {
          if (!isCancelled) {
            if ('requestIdleCallback' in window) {
              (window as any).requestIdleCallback(loadNextBatch, { timeout: 150 });
            } else {
              setTimeout(loadNextBatch, 50);
            }
          }
        });
      };

      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(loadNextBatch, { timeout: 100 });
      } else {
        setTimeout(loadNextBatch, 50);
      }
    };

    loadPriorityBatch();

    return () => {
      isCancelled = true;
    };
  }, [preloadFrame, totalFrames, mobileStep]);

  /**
   * Safe getter for closest available loaded image frame
   */
  const getLoadedImage = useCallback(
    (requestedIndex: number): HTMLImageElement | null => {
      const targetIndex = Math.min(totalFrames, Math.max(1, requestedIndex));

      // Direct match
      if (imagesRef.current.has(targetIndex)) {
        return imagesRef.current.get(targetIndex)!;
      }

      // Find closest preloaded frame if target hasn't finished downloading yet
      let closestDiff = Infinity;
      let closestImg: HTMLImageElement | null = null;

      imagesRef.current.forEach((img, idx) => {
        const diff = Math.abs(idx - targetIndex);
        if (diff < closestDiff) {
          closestDiff = diff;
          closestImg = img;
        }
      });

      return closestImg;
    },
    [totalFrames]
  );

  return {
    isFirstFrameLoaded,
    loadedCount,
    totalFrames,
    prefersReducedMotion,
    getLoadedImage,
  };
}
