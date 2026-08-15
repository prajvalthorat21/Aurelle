import React, { useEffect, useRef, useCallback } from 'react';

interface FrameSequenceCanvasProps {
  currentFrameIndex: number;
  getLoadedImage: (frameIndex: number) => HTMLImageElement | null;
  className?: string;
}

export const FrameSequenceCanvas: React.FC<FrameSequenceCanvasProps> = ({
  currentFrameIndex,
  getLoadedImage,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastRenderedIndexRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  /**
   * Draws the specified frame onto the canvas context with high-DPI sharpness
   */
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = getLoadedImage(currentFrameIndex);
    if (!img) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const displayWidth = Math.floor(rect.width);
    const displayHeight = Math.floor(rect.height);

    // Resize canvas internal buffer if physical dimensions changed
    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    // Set scale for high DPI
    ctx.save();
    ctx.scale(dpr, dpr);

    // Clear background with pure black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Calculate aspect ratio containment for visual centering
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;

    if (imgWidth > 0 && imgHeight > 0) {
      const isDesktop = displayWidth > 768;

      let renderW: number;
      let renderH: number;
      let drawX: number;
      let drawY: number;

      if (isDesktop) {
        // Desktop: Ring occupies ~42-46% of visual width, dominant in center-right visual field
        const targetWidth = displayWidth * 0.44;
        const targetHeight = targetWidth * (imgHeight / imgWidth);

        // Constrain if height exceeds viewport budget
        if (targetHeight > displayHeight * 0.86) {
          renderH = displayHeight * 0.86;
          renderW = renderH * (imgWidth / imgHeight);
        } else {
          renderW = targetWidth;
          renderH = targetHeight;
        }

        // Position in center-right field (leaving left side for editorial copy)
        drawX = displayWidth * 0.54 - renderW / 2;
        drawY = (displayHeight - renderH) / 2;
      } else {
        // Mobile: Scale ring cleanly within top-center visual field
        const maxMobileW = displayWidth * 0.82;
        const maxMobileH = displayHeight * 0.46;

        const scale = Math.min(maxMobileW / imgWidth, maxMobileH / imgHeight);
        renderW = imgWidth * scale;
        renderH = imgHeight * scale;

        drawX = (displayWidth - renderW) / 2;
        // Position upper-middle so bottom text overlay has zero collision
        drawY = Math.max(20, displayHeight * 0.26 - renderH / 2);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, drawX, drawY, renderW, renderH);
    }

    ctx.restore();
    lastRenderedIndexRef.current = currentFrameIndex;
  }, [currentFrameIndex, getLoadedImage]);

  // Schedule render on animation frame when currentFrameIndex changes
  useEffect(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      renderFrame();
    });

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [currentFrameIndex, renderFrame]);

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        renderFrame();
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [renderFrame]);

  return (
    <div className={`hero-canvas-container ${className}`}>
      <canvas ref={canvasRef} className="hero-canvas" />
    </div>
  );
};
