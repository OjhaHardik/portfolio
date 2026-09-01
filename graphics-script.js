(function () {
  const nav = document.getElementById('siteNav');
  const categoriesEl = document.getElementById('categories');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  GRAPHICS_DATA.forEach((cat, catIndex) => {
    const navLink = document.createElement('a');
    navLink.href = '#' + cat.slug;
    navLink.textContent = cat.name;
    nav.appendChild(navLink);

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

    const grid = document.createElement('div');
    grid.className = 'grid';

    cat.items
      .slice()
      .sort((a, b) => a.number - b.number)
      .forEach((item) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'card card-graphic';

        card.innerHTML =
          '<div class="thumb" style="aspect-ratio:' + item.width + '/' + item.height + '">' +
            '<img src="' + item.image + '" alt="' + item.title + '" loading="lazy">' +
          '</div>' +
          '<div class="info"><p class="title">' + item.title + '</p></div>';

        card.addEventListener('click', () => {
          lightboxImg.src = item.image;
          lightboxImg.alt = item.title;
          lightbox.classList.add('open');
        });

        grid.appendChild(card);
      });

    body.appendChild(grid);
    section.appendChild(body);
    categoriesEl.appendChild(section);
  });

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
  const sections = Array.from(document.querySelectorAll('.category-section'));
  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));

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

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();
