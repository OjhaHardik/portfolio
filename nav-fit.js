(function () {
  const header = document.querySelector('.header-inner');
  const logo = document.querySelector('.logo');
  const nav = document.getElementById('siteNav');
  const toggle = document.getElementById('navToggle');
  if (!header || !logo || !nav) return;

  const GAP_THRESHOLD = 40;
  const LINK_GAP = 32;
  let scheduled = false;

  // Measures how wide the nav would render in its "wide" (inline row)
  // state, using a hidden offscreen clone — independent of whatever
  // state the real nav is currently in, so it's safe to call anytime.
  function measureWideNavWidth() {
    const measurer = document.createElement('div');
    measurer.style.cssText =
      'position:absolute;top:-9999px;left:-9999px;visibility:hidden;' +
      'display:flex;white-space:nowrap;gap:' + LINK_GAP + 'px;' +
      'font-size:12.5px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;';

    nav.querySelectorAll('a').forEach((a) => {
      const span = document.createElement('span');
      span.textContent = a.textContent;
      measurer.appendChild(span);
    });

    document.body.appendChild(measurer);
    const width = measurer.offsetWidth;
    document.body.removeChild(measurer);
    return width;
  }

  function measure() {
    scheduled = false;

    const navWidth = measureWideNavWidth();
    const needed = logo.offsetWidth + navWidth + GAP_THRESHOLD;
    const available = header.clientWidth;
    const fits = needed <= available;

    if (fits) {
      header.classList.add('nav-wide');
    } else {
      const wasWide = header.classList.contains('nav-wide');
      header.classList.remove('nav-wide');
      if (wasWide) {
        nav.classList.remove('open');
        if (toggle) {
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      }
    }
  }

  function scheduleMeasure() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(measure);
  }

  scheduleMeasure();
  window.addEventListener('resize', scheduleMeasure);
  window.addEventListener('load', scheduleMeasure);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleMeasure);
  }
})();
