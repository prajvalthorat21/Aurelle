import React, { useRef, useState, useEffect, useCallback } from 'react';

export interface CollectionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageSrc: string;
  videoSrc: string;
  href?: string;
  onClick?: () => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  id,
  title,
  subtitle,
  description,
  imageSrc,
  videoSrc,
  href = '#',
  onClick,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Check prefers-reduced-motion media query
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

  // Handle video readiness when video can play
  const handleCanPlay = useCallback(() => {
    setIsVideoReady(true);
  }, []);

  // Mouse / Focus enter handler
  const handleMouseEnter = () => {
    if (prefersReducedMotion) return;
    setIsHovered(true);

    const video = videoRef.current;
    if (video) {
      try {
        video.currentTime = 0;
        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            if (err.name !== 'AbortError') {
              console.warn(`Hover video error for ${id}:`, err);
            }
          });
        }
      } catch (err) {
        console.warn(`Video reset error for ${id}:`, err);
      }
    }
  };

  // Mouse / Blur leave handler
  const handleMouseLeave = () => {
    setIsHovered(false);

    const video = videoRef.current;
    if (video) {
      try {
        video.pause();
        video.currentTime = 0;
      } catch (err) {
        console.warn(`Video pause error for ${id}:`, err);
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="collection-card"
      id={`collection-card-${id}`}
      tabIndex={0}
      role="button"
      aria-label={`View ${title} Fine Jewelry Collection Detail`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      <div className="collection-media-container">
        {/* Default Static Image */}
        <img
          src={imageSrc}
          alt={`${title} Fine Jewelry Collection`}
          className="collection-image"
          loading="lazy"
        />

        {/* Hover Video Preview (Non-looping, muted, 220ms crossfade) */}
        {!prefersReducedMotion && (
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            playsInline
            preload="metadata"
            onCanPlay={handleCanPlay}
            className={`collection-video ${isHovered && isVideoReady ? 'active' : ''}`}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="collection-info">
        <h3>{title}</h3>
        <p className="section-body">{description}</p>
      </div>
    </div>
  );
};

export default CollectionCard;
