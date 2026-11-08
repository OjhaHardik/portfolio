/* Site-wide settings and UI case studies.
   Everything marked REPLACE is a placeholder until real content is ready. */

const SITE = {
  email: 'ojhah10@gmail.com',

  // REPLACE: drop your track here (see plan.md, section 5). The music toggle hides itself if the file is missing.
  music: {
    src: 'Assets/audio/jazz-loop.mp3',
    title: 'Mellow Smooth Jazz',
    artist: 'Denis-Pavlov-Music',
    volume: 0.35
  },

  // REPLACE: your own showreel file and poster
  reel: {
    src: 'Assets/site/hero-wide.mp4',
    poster: 'Assets/photo/06-chai-stall.jpg'
  },

  // REPLACE: add real profile links; empty ones are not rendered
  socials: [
    { label: 'Instagram', href: '' },
    { label: 'LinkedIn', href: '' },
    { label: 'Behance', href: '' },
    { label: 'Dribbble', href: '' }
  ]
};

// Client work first; add concepts here as more case studies land.
// Per project: tag (card label, defaults to "Concept"), tone (neon | grid | photo), image (used by photo),
// caseStudy (a link; leave empty to show "Case study in progress"). The first project gets the large card.
const UI_PROJECTS = [
  {
    slug: 'aafreenn',
    name: 'Aafreenn',
    tag: 'Client',
    summary: 'A made-to-order store for handmade Indian suits, cut to your height.',
    role: 'UI / UX, build',
    platform: 'Web, mobile web',
    year: '2026',
    tone: 'photo',
    image: 'Assets/case-studies/aafreenn/photo-card.jpg',
    caseStudy: 'aafreenn.html'
  },
  {
    slug: 'bakhoor-al-barkaah',
    name: 'Bakhoor Al Barkaah',
    tag: 'Client',
    summary: 'A calm one-product shop for a hand-blended bakhoor, sold through moments, not notes.',
    role: 'UI / UX, build',
    platform: 'Web, mobile web',
    year: '2026',
    tone: 'photo',
    image: 'Assets/case-studies/bakhoor/card.jpg',
    caseStudy: 'bakhoor-al-barkaah.html'
  },
  {
    slug: 'the-dale',
    name: 'The Dale',
    tag: 'Client',
    summary: 'A boutique farmstay on the quiet side of Kumaon, with a brand and a site built to make the quiet believable.',
    role: 'Brand, UI / UX, build',
    platform: 'Web, mobile web',
    year: '2026',
    tone: 'photo',
    image: 'Assets/case-studies/the-dale/card.jpg',
    caseStudy: 'the-dale.html'
  },
  {
    slug: 'ftn-world',
    name: 'FTN World',
    tag: 'Client',
    summary: 'A practice website for architects, drawn like a drawing set and built in five steps.',
    role: 'Brand, UI / UX, build',
    platform: 'Web, mobile web',
    year: '2026',
    tone: 'photo',
    image: 'Assets/case-studies/ftn-world/card-drawing.jpg',
    caseStudy: 'ftn-world.html'
  },
  {
    slug: 'evelyn-dew',
    name: 'Evelyn Dew',
    tag: 'Client',
    summary: 'A black and white shop for a skin and hair care range, where each product brings its own colour.',
    role: 'UI / UX, build',
    platform: 'Web, mobile web',
    year: '2026',
    tone: 'photo',
    image: 'Assets/case-studies/evelyn-dew/card.jpg',
    caseStudy: 'evelyn-dew.html'
  }
];

// Photography placeholders (stock from Unsplash). REPLACE with your own shots.
const PHOTOS = [
  { src: 'Assets/photo/01-night-street.jpg', shape: 'tall', alt: 'A lone figure walking under a street lamp on a wet road at night', pick: true },
  { src: 'Assets/photo/03-desk-camera.jpg', shape: 'wide', alt: 'A film camera beside a cup of black coffee on a desk' },
  { src: 'Assets/photo/02-portrait.jpg', shape: 'tall', alt: 'Side-lit profile portrait of a man against a black background', pick: true },
  { src: 'Assets/photo/06-chai-stall.jpg', shape: 'wide', alt: 'A tea seller pouring chai at a stall lit by a single bulb', pick: true },
  { src: 'Assets/photo/04-city-bokeh.jpg', shape: 'tall', alt: 'Rain drops on a window with blurred city lights behind' },
  { src: 'Assets/photo/09-stairs.jpg', shape: 'wide', alt: 'Shadow of a staircase falling across a white wall' },
  { src: 'Assets/photo/07-night-street.jpg', shape: 'tall', alt: 'A person with an umbrella crossing a wet street at night' },
  { src: 'Assets/photo/05-shadow.jpg', shape: 'wide', alt: 'Hard sunlight casting diagonal shadows over stone steps' },
  { src: 'Assets/photo/10-window-city.jpg', shape: 'normal', alt: 'A city skyline at dusk seen through a dark window' },
  { src: 'Assets/photo/11-night-stall.jpg', shape: 'normal', alt: 'A small food stall glowing on a dark street' }
];
