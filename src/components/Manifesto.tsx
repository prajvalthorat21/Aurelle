import React, { useRef, useState, useEffect } from 'react';
import { safePlayVideo } from '../utils/videoUtils';

export const Manifesto: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const ringVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
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

  useEffect(() => {
    if (!isVisible) return;
    const video = ringVideoRef.current;
    if (!video) return;

    safePlayVideo(video);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className={`manifesto-section ${isVisible ? 'visible' : ''}`}
      aria-label="Maison Manifesto"
    >
      <div className="manifesto-grid">
        {/* Left Column: Editorial Copy */}
        <div className="manifesto-content-col">
          <span className="manifesto-eyebrow">MANIFESTO</span>
          <h2 className="manifesto-statement">
            Jewels shaped by light.<br />
            Made to outlast the moment.
          </h2>
          <div className="manifesto-body-wrapper">
            <div className="manifesto-accent-line" aria-hidden="true" />
            <div className="manifesto-text-content">
              <p className="manifesto-paragraph">
                At Aurelle, we believe true elegance does not demand attention—it commands it through flawless proportions, uncompromised materials, and light.
              </p>
              <p className="manifesto-paragraph">
                Each piece is an architectural dialogue between platinum, gold, and brilliance, meticulously crafted to transcend generations.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Persistent Floating 360° High-Jewelry Ring Visual */}
        <div className="manifesto-visual-col">
          <video
            ref={ringVideoRef}
            src="/assets/hero/ring/source/ring-360-master.mp4"
            className="manifesto-necklace-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="AURELLE 360° High-Jewelry Ring Visual"
          />
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
