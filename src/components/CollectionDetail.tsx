import React, { useEffect, useState } from 'react';
import { COLLECTIONS_DETAIL_DATA } from '../data/collectionsData';

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

  // Reduced motion media query check
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

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
    <div className="collection-detail-page" aria-label={`${collection.name} Collection Experience`}>
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

          {/* Full-Screen Video / Poster Background Layer */}
          <div className="collection-hero-visual-wrapper">
            {prefersReducedMotion ? (
              <img
                src={collection.heroImageSrc}
                alt={`${collection.name} Fine Jewelry Hero`}
                className="collection-hero-image"
              />
            ) : (
              <video
                key={collection.id}
                src={collection.heroVideoSrc}
                poster={collection.heroImageSrc}
                autoPlay
                muted
                playsInline
                preload="auto"
                className="collection-hero-video"
                aria-label={`${collection.name} Campaign Video`}
              />
            )}
          </div>

          {/* Editorial Typography Overlay */}
          <div className="collection-hero-content">
            <span className="hero-kicker">COLLECTION</span>
            <h1 className="collection-hero-title">{collection.name}</h1>
            <p className="collection-hero-statement">{collection.heroTitle}</p>
            <p className="collection-hero-subtitle">{collection.heroSubtitle}</p>
          </div>
        </section>

        {/* 2. COLLECTION COMMERCIAL SUMMARY & METADATA */}
        <section className="collection-commercial-section" aria-label={`${collection.name} Commercial Information`}>
          <div className="collection-commercial-container">
            {/* Header / Identity */}
            <div className="commercial-header-block">
              <h2 className="commercial-collection-name">{collection.name}</h2>
              <span className="commercial-descriptor">{collection.descriptor}</span>
            </div>

            <div className="commercial-divider" aria-hidden="true" />

            {/* Materials & Indicative Pricing */}
            <div className="commercial-specs-block">
              <div className="commercial-summary-meta">
                <span className="meta-piece-count">{collection.products.length} PIECES</span>
                <span className="meta-dot">·</span>
                <span className="commercial-material">{collection.material}</span>
              </div>
              <div className="commercial-price-block">
                <span className="price-label">FROM </span>
                <span className="price-amount">{collection.price.replace(/^From\s*/i, '')}</span>
              </div>
              <p className="pricing-disclaimer">
                Indicative pricing · Final price determined by stone selection and craftsmanship.
              </p>
            </div>

            <div className="commercial-divider" aria-hidden="true" />

            {/* Design Philosophy Description & CTA */}
            <div className="commercial-body-block">
              <p className="commercial-description">{collection.description}</p>
              <button
                className="hero-cta-btn"
                data-cursor="magnetic"
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
                    alt={`${product.name} — ${product.type}`}
                    className="product-image"
                    loading="lazy"
                  />
                </div>
                <div className="product-meta">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-type">{product.type}</p>
                  <p className="product-material-line">{product.material}</p>
                  <div className="product-price-row">
                    <span className="price-label">FROM </span>
                    <span className="product-price-amount">{product.price.replace(/^From\s*/i, '')}</span>
                    <span className="product-indicative-tag">Indicative pricing</span>
                  </div>
                  <p className="product-story">{product.story}</p>
                  <button
                    className="product-consultation-btn"
                    data-cursor="magnetic"
                    onClick={() => openConsultationModal(`${collection.name} — ${product.name} (${product.type})`)}
                  >
                    [ REQUEST A PRIVATE CONSULTATION ]
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. COLLECTION CLOSING EXPERIENCE */}
        <section className="collection-closing-section">
          <div className="closing-container">
            <span className="closing-kicker">{collection.name}</span>
            <p className="closing-statement">{collection.closingStatement}</p>
            <div className="closing-action-group">
              <button
                className="hero-cta-btn"
                data-cursor="magnetic"
                onClick={() => openConsultationModal(`AURELLE ${collection.name} Collection Inquiry`)}
              >
                [ REQUEST A PRIVATE CONSULTATION ]
              </button>
              <button
                className="explore-next-btn"
                onClick={() => onNavigateCollection(collection.nextCollectionId)}
              >
                [ EXPLORE {collection.nextCollectionName} ]
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 6. REFINED PRIVATE CONSULTATION MODAL PANEL */}
      {isModalOpen && (
        <div className="consultation-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="consultation-modal-content">
            <button
              className="consultation-modal-close"
              aria-label="Close Consultation Dialog"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <div className="consultation-modal-header">
              <span className="modal-kicker">AURELLE CONCIERGE</span>
              <h2 id="modal-title" className="modal-title">PRIVATE CONSULTATION</h2>
              <p className="modal-subject-label">{modalSubject}</p>
            </div>

            {isSubmitted ? (
              <div className="consultation-confirmation">
                <p className="confirmation-statement">
                  Thank you, <strong style={{ color: '#F5F3EE' }}>{formState.name || 'Valued Guest'}</strong>.
                </p>
                <p className="confirmation-body">
                  Your private concierge inquiry for <em>{modalSubject}</em> has been registered. An Aurelle high-jewelry specialist will contact you shortly.
                </p>
                <button
                  className="hero-cta-btn"
                  style={{ marginTop: '20px' }}
                  onClick={() => setIsModalOpen(false)}
                >
                  [ RETURN TO COLLECTION ]
                </button>
              </div>
            ) : (
              <form className="consultation-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="concierge-name" className="form-label">FULL NAME *</label>
                  <input
                    id="concierge-name"
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    className="form-input"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="concierge-email" className="form-label">EMAIL ADDRESS *</label>
                  <input
                    id="concierge-email"
                    type="email"
                    required
                    placeholder="eleanor@maison.com"
                    className="form-input"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="concierge-phone" className="form-label">PHONE NUMBER (OPTIONAL)</label>
                  <input
                    id="concierge-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="form-input"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="concierge-message" className="form-label">SPECIAL REQUEST OR INQUIRY</label>
                  <textarea
                    id="concierge-message"
                    rows={3}
                    placeholder="Share any preferred timeline, sizing, or stone criteria..."
                    className="form-textarea"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="hero-cta-btn modal-submit-btn">
                  [ SUBMIT PRIVATE INQUIRY ]
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Luxury Footer */}
      <footer className="aurelle-footer">
        <div>&copy; {new Date().getFullYear()} AURELLE FINE JEWELRY. ALL RIGHTS RESERVED.</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigateBack(); }}>OVERVIEW</a>
          <a href="#" className="nav-link">PRIVACY</a>
          <a href="#" className="nav-link">TERMS</a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); openConsultationModal('AURELLE General Inquiry'); }}>CONCIERGE</a>
        </div>
      </footer>
    </div>
  );
};

export default CollectionDetail;
