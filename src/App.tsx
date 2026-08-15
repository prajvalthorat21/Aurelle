import React, { useState, useEffect } from 'react';
import { HeroScroll } from './components/HeroScroll';
import { CollectionCard } from './components/CollectionCard';
import { Manifesto } from './components/Manifesto';
import { Atelier } from './components/Atelier';
import { CollectionDetail } from './components/CollectionDetail';
import { CustomCursor } from './components/CustomCursor';

// Explicit Collection Data Structure with dedicated asset paths & video mapping
const COLLECTIONS_DATA = [
  {
    id: 'solstice',
    title: 'SOLSTICE',
    description: 'Captured moments of solar brilliance rendered in platinum and hand-selected solitaires.',
    imageSrc: '/assets/collections/solstice/hero/solstice-hero.png',
    videoSrc: '/assets/collections/solstice/hover/solstice-hover.mp4',
  },
  {
    id: 'reverie',
    title: 'REVERIE',
    description: 'Subtle architectural contours designed to celebrate the interplay of silhouette and shadow.',
    imageSrc: '/assets/collections/reverie/hero/reverie-hero.png',
    videoSrc: '/assets/collections/reverie/hover/reverie-hover.mp4',
  },
  {
    id: 'vow',
    title: 'VOW',
    description: 'Enduring symbols of commitment, shaped by light and quiet devotion.',
    imageSrc: '/assets/collections/vow/hero/vow-hero.png',
    videoSrc: '/assets/collections/vow/hover/vow-hover.mp4',
  },
];

// Helper to extract active collection ID from pathname or hash
const getActiveCollectionFromUrl = (): string | null => {
  const path = window.location.pathname;
  if (path.startsWith('/collections/')) {
    const id = path.replace('/collections/', '').replace(/\/$/, '');
    if (['solstice', 'reverie', 'vow'].includes(id)) {
      return id;
    }
  }
  const hash = window.location.hash;
  if (hash.startsWith('#/collections/')) {
    const id = hash.replace('#/collections/', '').replace(/\/$/, '');
    if (['solstice', 'reverie', 'vow'].includes(id)) {
      return id;
    }
  }
  return null;
};

export const App: React.FC = () => {
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(getActiveCollectionFromUrl);

  // Sync state with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setActiveCollectionId(getActiveCollectionFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToCollection = (id: string) => {
    setActiveCollectionId(id);
    const targetUrl = `/collections/${id}`;
    window.history.pushState({ collectionId: id }, '', targetUrl);
  };

  const scrollToSection = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const header = document.querySelector('.aurelle-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();

    if (activeCollectionId) {
      setActiveCollectionId(null);
      window.history.pushState(null, '', `#${targetId}`);
      setTimeout(() => {
        scrollToSection(targetId);
      }, 50);
    } else {
      window.history.pushState(null, '', `#${targetId}`);
      scrollToSection(targetId);
    }
  };

  const navigateToHome = () => {
    if (activeCollectionId) {
      setActiveCollectionId(null);
      window.history.pushState(null, '', '/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    } else {
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle initial page load / hash routing
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['collections', 'manifesto', 'atelier'].includes(hash) && !activeCollectionId) {
      const timer = setTimeout(() => {
        scrollToSection(hash);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeCollectionId]);

  return (
    <div className="aurelle-app">
      {/* Global High-Performance Custom Diamond Cursor */}
      <CustomCursor />

      {activeCollectionId ? (
        <CollectionDetail
          collectionId={activeCollectionId}
          onNavigateBack={navigateToHome}
          onNavigateCollection={navigateToCollection}
        />
      ) : (
        <>
          {/* Luxury Navigation Header */}
          <header className="aurelle-header">
            <a
              href="/"
              className="brand-logo-container"
              aria-label="AURELLE — Home"
              data-cursor="interactive"
              onClick={(e) => {
                e.preventDefault();
                navigateToHome();
              }}
            >
              <img
                src="/assets/brand/logo/aurelle-logo-lockup.png"
                alt="AURELLE Fine Jewelry"
                className="brand-logo-img"
              />
            </a>
            <nav className="header-actions" aria-label="Main Navigation">
              <a
                href="#collections"
                className="nav-link"
                data-cursor="interactive"
                onClick={(e) => handleNavClick(e, 'collections')}
              >
                Collections
              </a>
              <a
                href="#manifesto"
                className="nav-link"
                data-cursor="interactive"
                onClick={(e) => handleNavClick(e, 'manifesto')}
              >
                Manifesto
              </a>
              <a
                href="#atelier"
                className="nav-link"
                data-cursor="interactive"
                onClick={(e) => handleNavClick(e, 'atelier')}
              >
                Atelier
              </a>
            </nav>
          </header>

          {/* HERO SECTION */}
          <main>
            <HeroScroll />

            {/* COLLECTIONS SECTION (Hover Video Preview with Explicit Mapping) */}
            <section id="collections" className="section-preview">
              <span className="hero-kicker">CURATED SELECTIONS</span>
              <h2 className="section-title">THE COLLECTIONS</h2>
              <p className="section-body">
                Each piece is crafted with meticulous restraint, reflecting light with unmatched clarity and enduring grace.
              </p>

              <div className="collection-grid">
                {COLLECTIONS_DATA.map((collection) => (
                  <div key={collection.id} data-cursor="explore">
                    <CollectionCard
                      id={collection.id}
                      title={collection.title}
                      description={collection.description}
                      imageSrc={collection.imageSrc}
                      videoSrc={collection.videoSrc}
                      onClick={() => navigateToCollection(collection.id)}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* EDITORIAL MAISON MANIFESTO SECTION */}
            <Manifesto />

            {/* HIGH-JEWELRY CRAFTSMANSHIP ATELIER SECTION */}
            <Atelier />
          </main>

          {/* Luxury Footer */}
          <footer className="aurelle-footer">
            <div>&copy; {new Date().getFullYear()} AURELLE FINE JEWELRY. ALL RIGHTS RESERVED.</div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" className="nav-link" data-cursor="interactive">PRIVACY</a>
              <a href="#" className="nav-link" data-cursor="interactive">TERMS</a>
              <a href="#" className="nav-link" data-cursor="interactive">CONCIERGE</a>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
