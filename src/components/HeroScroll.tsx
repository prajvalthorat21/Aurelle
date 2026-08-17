import React, { useRef, useState, useEffect } from 'react';

interface HeroProps {
  onExploreClick?: () => void;
}

export const HeroScroll: React.FC<HeroProps> = ({ onExploreClick }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth <= 768);

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

  // Listen to mobile breakpoint changes
  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const handleMobileChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener('change', handleMobileChange);
      return () => mobileQuery.removeEventListener('change', handleMobileChange);
    }
  }, []);

  // Ensure video autoplays cleanly on mount if reduced motion is disabled
  useEffect(() => {
    if (!prefersReducedMotion && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay prevented by browser policy:', err);
      });
    }
  }, [prefersReducedMotion, isMobile]);

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
      {/* Final Approved UGC Hero Video / Poster Layer */}
      <div className="hero-video-container">
        {prefersReducedMotion ? (
          <img
            src="/assets/hero/video/poster/aurelle-hero-poster.jpg"
            alt="AURELLE High Jewelry Campaign"
            className="hero-poster-img"
          />
        ) : (
          <video
            key={isMobile ? 'hero-mobile' : 'hero-desktop'}
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
        )}
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
