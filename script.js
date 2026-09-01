(function () {
  const nav = document.getElementById('siteNav');
  const categoriesEl = document.getElementById('categories');
  const heroStats = document.getElementById('heroStats');

  const playIcon = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';

  const totalItems = PORTFOLIO_DATA.reduce((sum, cat) => sum + cat.items.length, 0);
  heroStats.innerHTML =
    '<span><strong>' + totalItems + '</strong> Projects</span>' +
    '<span><strong>' + PORTFOLIO_DATA.length + '</strong> Categories</span>';

  PORTFOLIO_DATA.forEach((cat, catIndex) => {
    // nav link
    const a = document.createElement('a');
    a.href = '#' + cat.slug;
    a.textContent = cat.name;
    nav.appendChild(a);

    // section
    const section = document.createElement('section');
    section.className = 'category-section';
    section.id = cat.slug;

    const num = String(catIndex + 1).padStart(2, '0');

    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML =
      '<span class="index">' + num + '</span>' +
      '<h2>' + cat.name + '</h2>' +
      '<span class="count">' + cat.items.length + '</span>';
    section.appendChild(header);

    const body = document.createElement('div');
    body.className = 'category-body';

    // group same-ratio items together so vertical and horizontal
    // thumbnails don't interleave awkwardly in the grid
    const groups = new Map();
    cat.items
      .slice()
      .sort((a, b) => a.number - b.number)
      .forEach((item) => {
        if (!groups.has(item.ratio)) groups.set(item.ratio, []);
        groups.get(item.ratio).push(item);
      });

    groups.forEach((items) => {
      const grid = document.createElement('div');
      grid.className = 'grid';

      items.forEach((item) => {
        const card = document.createElement('a');
        card.className = 'card';
        card.href = item.link;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';

        card.innerHTML =
          '<div class="thumb ' + item.ratio + '">' +
            '<img src="' + item.thumbnail + '" alt="' + item.title + '" loading="lazy">' +
            '<span class="play">' + playIcon + '</span>' +
          '</div>' +
          '<div class="info"><p class="title">' + item.title + '</p></div>';

        grid.appendChild(card);
      });

      body.appendChild(grid);
    });

    section.appendChild(body);
    categoriesEl.appendChild(section);
  });

  const contactLink = document.createElement('a');
  contactLink.href = '#contact';
  contactLink.textContent = 'Contact';
  nav.appendChild(contactLink);

  document.getElementById('year').textContent = new Date().getFullYear();

  // mobile nav toggle
  const toggle = document.getElementById('navToggle');
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // active nav link on scroll
  const sections = Array.from(document.querySelectorAll('.category-section, #contact'));
  const links = Array.from(nav.querySelectorAll('a'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((link) =>
            link.classList.toggle('active', link.getAttribute('href') === '#' + id)
          );
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
})();
