import React, { useRef, useEffect } from 'react';
import { safePlayVideo } from '../utils/videoUtils';

interface HeroProps {
  onExploreClick?: () => void;
}

export const HeroScroll: React.FC<HeroProps> = ({ onExploreClick }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Programmatically manage autoplay on the persistent hero video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    safePlayVideo(video);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && videoRef.current) {
        safePlayVideo(videoRef.current);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle CTA click to smoothly scroll to collections section
  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onExploreClick) {
      onExploreClick();
    } else {
      const target = document.getElementById('collections');
      if (target) {
        const header = document.querySelector('.aurelle-header');
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="hero-section" aria-label="AURELLE Campaign Hero">
      {/* Persistent UGC Hero Video Layer */}
      <div className="hero-video-container">
        <video
          key="hero-video-stable"
          ref={videoRef}
          poster="/assets/hero/video/poster/aurelle-hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="hero-video"
          aria-hidden="true"
        >
          <source media="(max-width: 768px)" src="/assets/hero/video/aurelle-hero-ugc-mobile.mp4" type="video/mp4" />
          <source src="/assets/hero/video/aurelle-hero-ugc.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Editorial Luxury Typography Overlay */}
      <div className="hero-overlay">
        <div className="hero-content-box">
          <span className="hero-kicker">High Jewelry Maison</span>
          <h1 className="hero-title">
            JEWELS<br />
            SHAPED<br />
            BY LIGHT
          </h1>
          <p className="hero-subtitle">
            A quiet statement of enduring brilliance.
          </p>
          <a href="#collections" className="hero-cta-btn" data-cursor="magnetic" onClick={handleCtaClick}>
            [ EXPLORE THE COLLECTION ]
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroScroll;
