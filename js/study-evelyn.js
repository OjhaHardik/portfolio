/* Evelyn Dew study: the name picker circles the e or the d in the mark, the way the site's own story section does.
   It fades and shifts with opacity and transform only (CSS), and still switches instantly under reduced motion. */
(function () {
  'use strict';
  const { $, $$ } = window.ST;

  const plate = $('.nm-plate');
  const picks = $$('[data-nm]');
  if (plate && picks.length) {
    picks.forEach((b) => b.addEventListener('click', () => {
      const k = b.dataset.nm;
      plate.dataset.on = k;
      picks.forEach((p) => p.setAttribute('aria-pressed', String(p === b)));
      $$('.nm-def').forEach((d) => d.classList.toggle('is-on', d.dataset.def === k));
    }));
  }
})();
