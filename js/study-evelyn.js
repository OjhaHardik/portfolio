/* Evelyn Dew study: two small switches taken from the product.
   - The label proof swaps the prototype's front panel for the carton's, line by line, so each change sits where it was made.
   - The name picker circles the e or the d in the mark, the way the site's own story section does.
   Both fade and shift with opacity and transform only (CSS), and still switch instantly under reduced motion. */
(function () {
  'use strict';
  const { $, $$ } = window.ST;

  /* ---------- Label proof: two tabs, one panel ---------- */
  const panel = $('#pfPanel');
  const tabs = $$('[data-pf]');
  if (panel && tabs.length) {
    const show = (state) => {
      panel.dataset.state = state;
      tabs.forEach((t) => {
        const on = t.dataset.pf === state;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (on) panel.setAttribute('aria-labelledby', t.id);
      });
      // only the visible version is read out
      $$('.pf-old', panel).forEach((s) => s.setAttribute('aria-hidden', String(state !== 'old')));
      $$('.pf-new', panel).forEach((s) => s.setAttribute('aria-hidden', String(state !== 'new')));
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => show(t.dataset.pf));
      t.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        next.focus();
        show(next.dataset.pf);
      });
    });
    show('old');
  }

  /* ---------- The name in the mark ---------- */
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
