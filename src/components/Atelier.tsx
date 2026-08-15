import React, { useRef, useState, useEffect } from 'react';

export const Atelier: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="atelier"
      className={`atelier-section ${isVisible ? 'visible' : ''}`}
      aria-label="Aurelle Atelier Craftsmanship"
    >
      <div className="atelier-container">
        {/* Left Column: Intro & Dominant Editorial Statement */}
        <div className="atelier-intro-col">
          <span className="atelier-eyebrow">ATELIER</span>
          <h2 className="atelier-statement">
            Crafted with precision.<br />
            Finished by hand.
          </h2>
          <p className="atelier-description">
            In our private workshop, master artisans combine centuries-old goldsmithing traditions with architectural exactitude. Every surface is sculpted to capture ambient light, ensuring an enduring harmony between form and brilliance.
          </p>
        </div>

        {/* Right Column: Editorial Craft Principles */}
        <div className="atelier-principles-col">
          <div className="atelier-principle-item">
            <div className="principle-header">
              <span className="principle-marker">01</span>
              <span className="principle-separator" aria-hidden="true">—</span>
              <h3 className="principle-title">PRECISION</h3>
            </div>
            <p className="principle-detail">Every proportion considered.</p>
          </div>

          <div className="atelier-principle-item">
            <div className="principle-header">
              <span className="principle-marker">02</span>
              <span className="principle-separator" aria-hidden="true">—</span>
              <h3 className="principle-title">MATERIAL</h3>
            </div>
            <p className="principle-detail">Only exceptional metals and stones.</p>
          </div>

          <div className="atelier-principle-item">
            <div className="principle-header">
              <span className="principle-marker">03</span>
              <span className="principle-separator" aria-hidden="true">—</span>
              <h3 className="principle-title">LIGHT</h3>
            </div>
            <p className="principle-detail">Cut and surface designed to reveal brilliance.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Atelier;
