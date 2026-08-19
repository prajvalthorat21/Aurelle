import React, { useEffect, useState, useRef } from 'react';
import { COLLECTIONS_DETAIL_DATA } from '../data/collectionsData';
import { safePlayVideo } from '../utils/videoUtils';

interface CollectionDetailProps {
  collectionId: string;
  onNavigateBack: () => void;
  onNavigateCollection: (id: string) => void;
}

export const CollectionDetail: React.FC<CollectionDetailProps> = ({
  collectionId,
  onNavigateBack,
  onNavigateCollection,
}) => {
  const collection = COLLECTIONS_DETAIL_DATA[collectionId] || COLLECTIONS_DETAIL_DATA['solstice'];
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Consultation Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalSubject, setModalSubject] = useState<string>('');
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Programmatically manage playback on persistent video element
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
  }, [collectionId]);

  // Scroll to top on collection switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [collectionId]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const openConsultationModal = (subjectTitle: string) => {
    setModalSubject(subjectTitle);
    setIsSubmitted(false);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="collection-detail-page" data-collection={collection.id} aria-label={`${collection.name} Collection Experience`}>
      {/* Luxury Navigation Header */}
      <header className="aurelle-header">
        <a
          href="/"
          className="brand-logo-container"
          aria-label="AURELLE — Home"
          onClick={(e) => {
            e.preventDefault();
            onNavigateBack();
          }}
        >
          <img
            src="/assets/brand/logo/aurelle-logo-lockup.png"
            alt="AURELLE Fine Jewelry"
            className="brand-logo-img"
          />
        </a>
        <nav className="header-actions" aria-label="Collection Navigation">
          <a
            href="#"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigateBack();
            }}
          >
            ← Back to Collections
          </a>
        </nav>
      </header>

      <main className="collection-detail-main">
        {/* 1. COLLECTION HERO (CINEMATIC FULL-SCREEN UGC VIDEO) */}
        <section className="collection-detail-hero">
          {/* Back Link Floating Bar */}
          <div className="collection-back-bar">
            <a
              href="#"
              className="back-to-collections-link"
              onClick={(e) => {
                e.preventDefault();
                onNavigateBack();
              }}
            >
              ← BACK TO COLLECTIONS
            </a>
          </div>

          {/* Persistent Video Background Layer */}
          <div className="collection-hero-visual-wrapper">
            <video
              key={collection.id}
              ref={videoRef}
              poster={collection.heroImageSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="collection-hero-video"
              aria-label={`${collection.name} Campaign Video`}
            >
              {collection.heroMobileVideoSrc && (
                <source media="(max-width: 768px)" src={collection.heroMobileVideoSrc} type="video/mp4" />
              )}
              <source src={collection.heroVideoSrc} type="video/mp4" />
            </video>
          </div>

          {/* Editorial Typography Overlay */}
          <div className="collection-hero-content">
            <span className="hero-kicker">COLLECTION</span>
            <h1 className="collection-hero-title">{collection.name}</h1>
            <p className="collection-hero-statement">{collection.heroTitle}</p>
            <p className="collection-hero-subtitle">{collection.heroSubtitle}</p>

            <div className="collection-hero-actions">
              <button
                className="hero-cta-btn"
                onClick={() => {
                  const gallery = document.getElementById('curated-pieces');
                  if (gallery) gallery.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                [ EXPLORE THE PIECES ]
              </button>
            </div>
          </div>
        </section>

        {/* 3. MAISON PHILOSOPHY */}
        <section className="collection-intro-section">
          <div className="collection-intro-container">
            <span className="intro-kicker">MAISON PHILOSOPHY</span>
            <h2 className="intro-title">THE CHARACTER OF {collection.name}</h2>
            <p className="intro-philosophy-text">{collection.philosophy}</p>
          </div>
        </section>

        {/* 4. EDITORIAL PRODUCT GALLERY WITH COMMERCIAL CARDS */}
        <section id="curated-pieces" className="collection-gallery-section">
          <div className="gallery-header">
            <span className="gallery-kicker">CURATED PIECES</span>
            <h2 className="gallery-title">{collection.name} SELECTIONS</h2>
          </div>

          <div className="product-editorial-grid">
            {collection.products.map((product) => (
              <div key={product.id} className="product-card" tabIndex={0} role="article">
                <div className="product-media-wrapper" data-cursor="view">
                  <img
                    src={product.imageSrc}
                    alt={`${product.name} — ${product.subtitle}`}
                    className="product-image"
                    loading="lazy"
                  />
                </div>
                <div className="product-meta">
                  <h3 className="product-name">{product.name}</h3>
                  <span className="product-type-badge">{product.type}</span>
                  <div className="product-price">{product.price}</div>
                  <div className="product-material">{product.material}</div>
                  <p className="product-story">{product.story}</p>
                  <button
                    className="product-consultation-btn"
                    onClick={() => openConsultationModal(`${collection.name} — ${product.name}`)}
                  >
                    REQUEST A PRIVATE CONSULTATION
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. NEXT COLLECTION TEASER */}
        <section className="next-collection-section">
          <div className="next-collection-container">
            <span className="next-kicker">CONTINUE EXPLORING</span>
            <h2 className="next-title">NEXT: {collection.nextCollectionName}</h2>
            <button
              className="hero-cta-btn"
              onClick={() => onNavigateCollection(collection.nextCollectionId)}
            >
              [ DISCOVER {collection.nextCollectionName} ]
            </button>
          </div>
        </section>
      </main>

      {/* Luxury Footer */}
      <footer className="aurelle-footer">
        <div>&copy; {new Date().getFullYear()} AURELLE FINE JEWELRY. ALL RIGHTS RESERVED.</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigateBack(); }}>COLLECTIONS</a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigateBack(); }}>MANIFESTO</a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); openConsultationModal(`${collection.name} Concierge`); }}>CONCIERGE</a>
        </div>
      </footer>

      {/* PRIVATE CONSULTATION MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            <span className="intro-kicker">PRIVATE CONSULTATION</span>
            <h3 className="modal-title">INQUIRE ABOUT {modalSubject.toUpperCase()}</h3>

            {isSubmitted ? (
              <div className="modal-success-message">
                <p>Thank you for your interest in AURELLE.</p>
                <p>A Senior Client Advisor will contact you within 24 hours to arrange your private consultation.</p>
              </div>
            ) : (
              <form className="modal-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="name">FULL NAME</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">TELEPHONE</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">SPECIAL REQUESTS / PREFERRED TIME</label>
                  <textarea
                    id="message"
                    rows={3}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  />
                </div>
                <button type="submit" className="hero-cta-btn" style={{ width: '100%', marginTop: '16px' }}>
                  SUBMIT REQUEST
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionDetail;
