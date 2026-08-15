export interface Product {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  material: string;
  price: string;
  story: string;
  imageSrc: string;
}

export interface CollectionDetail {
  id: string;
  name: string;
  heroTitle: string;
  heroSubtitle: string;
  descriptor: string;
  material: string;
  price: string;
  description: string;
  heroImageSrc: string;
  heroVideoSrc: string;
  hoverVideoSrc: string;
  philosophy: string;
  closingStatement: string;
  nextCollectionId: string;
  nextCollectionName: string;
  products: Product[];
}

export const COLLECTIONS_DETAIL_DATA: Record<string, CollectionDetail> = {
  solstice: {
    id: 'solstice',
    name: 'SOLSTICE',
    heroTitle: 'THE RADIANCE OF A SINGLE MOMENT',
    heroSubtitle: 'Solitaire brilliance captured in platinum and light.',
    descriptor: 'CAPTURED MOMENTS OF SOLAR BRILLIANCE',
    material: '18K GOLD · PLATINUM ACCENTS · SELECTED DIAMONDS',
    price: 'From ₹2,50,000',
    description: 'A study in radiance and restraint, SOLSTICE explores the relationship between warm metal, light and exceptional stones.',
    heroImageSrc: '/assets/collections/solstice/hero/solstice-hero.png',
    heroVideoSrc: '/assets/collections/solstice/hero/solstice-hero-ugc.mp4',
    hoverVideoSrc: '/assets/collections/solstice/hover/solstice-hover.mp4',
    philosophy: 'Solstice celebrates the zenith of light—where precision engineering meets raw crystalline purity. Each solitaire is sculpted to maximize reflection and proportion.',
    closingStatement: 'Sculpted with solar brilliance, designed to outlast time.',
    nextCollectionId: 'reverie',
    nextCollectionName: 'REVERIE',
    products: [
      {
        id: 'aurelia',
        name: 'AURELIA',
        subtitle: 'Solitaire Platinum Ring',
        type: 'Solitaire Platinum Ring',
        material: '18K GOLD · DIAMOND',
        price: 'From ₹3,85,000',
        story: 'A sculptural solitaire defined by a fluid gold profile and restrained diamond detailing.',
        imageSrc: '/assets/collections/solstice/products/aurelia/aurelia-main.png',
      },
      {
        id: 'elan',
        name: 'ÉLAN',
        subtitle: 'Architectural Diamond Band',
        type: 'Architectural Diamond Band',
        material: 'PLATINUM · DIAMONDS',
        price: 'From ₹2,95,000',
        story: 'Rhythmic geometric channels carved in platinum, framing brilliant-cut diamonds.',
        imageSrc: '/assets/collections/solstice/products/elan/elan-main.png',
      },
      {
        id: 'stillness',
        name: 'STILLNESS',
        subtitle: 'Minimalist Solitaire Pendant',
        type: 'Minimalist Solitaire Pendant',
        material: '18K GOLD · DIAMOND',
        price: 'From ₹2,50,000',
        story: 'A quiet focal point suspended in light, balancing weightless grace and architectural presence.',
        imageSrc: '/assets/collections/solstice/products/stillness/stillness-main.png',
      },
      {
        id: 'the-arc',
        name: 'THE ARC',
        subtitle: 'Contoured Platinum Solitaire',
        type: 'Contoured Platinum Solitaire',
        material: 'PLATINUM · DIAMOND',
        price: 'From ₹3,40,000',
        story: 'Fluid platinum contours arching softly around a hand-selected central solitaire.',
        imageSrc: '/assets/collections/solstice/products/the-arc/the-arc-main.png',
      },
    ],
  },
  reverie: {
    id: 'reverie',
    name: 'REVERIE',
    heroTitle: 'SILHOUETTE AND SHADOW',
    heroSubtitle: 'Architectural fluid contours in white gold.',
    descriptor: 'SUBTLE ARCHITECTURAL CONTOURS',
    material: 'PLATINUM · WHITE GOLD · DIAMONDS',
    price: 'From ₹3,50,000',
    description: 'REVERIE is defined by fluid geometry and quiet contrast, where diamonds trace elegant contours between silhouette and shadow.',
    heroImageSrc: '/assets/collections/reverie/hero/reverie-hero.png',
    heroVideoSrc: '/assets/collections/reverie/hero/reverie-hero-ugc.mp4',
    hoverVideoSrc: '/assets/collections/reverie/hover/reverie-hover.mp4',
    philosophy: 'Reverie explores the space between light and dark. Soft fluid curves cascade seamlessly, creating an intimate dialogue between metal, gemstone, and skin.',
    closingStatement: 'An architectural reverie of form, light, and shadow.',
    nextCollectionId: 'vow',
    nextCollectionName: 'VOW',
    products: [
      {
        id: 'celeste',
        name: 'CELESTE',
        subtitle: 'Cascading White Gold Necklace',
        type: 'Cascading White Gold Necklace',
        material: 'WHITE GOLD · DIAMONDS',
        price: 'From ₹4,20,000',
        story: 'A graceful cascade of white gold links tracing light across the skin with quiet movement.',
        imageSrc: '/assets/collections/reverie/products/celeste/celeste-main.png',
      },
      {
        id: 'etoile',
        name: 'ÉTOILE',
        subtitle: 'Contoured Diamond Drop',
        type: 'Contoured Diamond Drop',
        material: 'PLATINUM · DIAMONDS',
        price: 'From ₹3,50,000',
        story: 'Delicate platinum drops engineered to capture ambient light with subtle sparkle.',
        imageSrc: '/assets/collections/reverie/products/etoile/etoile-main.png',
      },
      {
        id: 'lumiere',
        name: 'LUMIÈRE',
        subtitle: 'Fluid Silhouette Choker',
        type: 'Fluid Silhouette Choker',
        material: 'WHITE GOLD · DIAMONDS',
        price: 'From ₹4,80,000',
        story: 'Seamless white gold architecture curving into an intimate collar of brilliant diamonds.',
        imageSrc: '/assets/collections/reverie/products/lumiere/lumiere-main.png',
      },
      {
        id: 'quiet-return',
        name: 'QUIET RETURN',
        subtitle: 'Minimalist Architectural Band',
        type: 'Minimalist Architectural Band',
        material: 'PLATINUM · DIAMONDS',
        price: 'From ₹3,10,000',
        story: 'Clean architectural lines celebrating the quiet space between shadow and light.',
        imageSrc: '/assets/collections/reverie/products/quiet-return/quiet-return-main.png',
      },
    ],
  },
  vow: {
    id: 'vow',
    name: 'VOW',
    heroTitle: 'QUIET DEVOTION',
    heroSubtitle: 'Enduring commitment in warm rose and champagne gold.',
    descriptor: 'ENDURING SYMBOLS OF CONNECTION',
    material: 'CHAMPAGNE GOLD · ROSE GOLD · DIAMONDS',
    price: 'From ₹2,80,000',
    description: 'VOW explores permanence through intertwined forms, warm metal and restrained brilliance — designed around the idea of enduring connection.',
    heroImageSrc: '/assets/collections/vow/hero/vow-hero.png',
    heroVideoSrc: '/assets/collections/vow/hero/vow-hero-ugc.mp4',
    hoverVideoSrc: '/assets/collections/vow/hover/vow-hover.mp4',
    philosophy: 'Vow is a quiet pledge of eternity. Warm champagne tones and hand-finished proportions create timeless symbols of devotion.',
    closingStatement: 'Shaped by light, bound by quiet devotion.',
    nextCollectionId: 'solstice',
    nextCollectionName: 'SOLSTICE',
    products: [
      {
        id: 'continuum',
        name: 'CONTINUUM',
        subtitle: 'Seamless Rose Gold Pendant',
        type: 'Seamless Rose Gold Pendant',
        material: 'ROSE GOLD · DIAMONDS',
        price: 'From ₹2,80,000',
        story: 'An unbroken loop of warm rose gold representing eternal connection and quiet devotion.',
        imageSrc: '/assets/collections/vow/products/continuum/continuum-main.png',
      },
      {
        id: 'elane',
        name: 'ÉLANE',
        subtitle: 'Hand-Finished Gold Drop',
        type: 'Hand-Finished Gold Drop',
        material: 'CHAMPAGNE GOLD · DIAMONDS',
        price: 'From ₹3,20,000',
        story: 'Hand-sculpted champagne gold drops designed with understated elegance.',
        imageSrc: '/assets/collections/vow/products/elane/elane-main.png',
      },
      {
        id: 'eternalis',
        name: 'ETERNALIS',
        subtitle: 'Champagne Solitaire Pendant',
        type: 'Champagne Solitaire Pendant',
        material: 'CHAMPAGNE GOLD · DIAMOND',
        price: 'From ₹3,65,000',
        story: 'Warm champagne gold holding an exceptional solitaire diamond in soft radiance.',
        imageSrc: '/assets/collections/vow/products/eternalis/eternalis-main.png',
      },
      {
        id: 'seren',
        name: 'SEREN',
        subtitle: 'Contoured Devotion Band',
        type: 'Contoured Devotion Band',
        material: 'ROSE GOLD · CHAMPAGNE GOLD · DIAMONDS',
        price: 'From ₹2,95,000',
        story: 'Intertwined dual gold tones celebrating permanence and quiet commitment.',
        imageSrc: '/assets/collections/vow/products/seren/seren-main.png',
      },
    ],
  },
};
