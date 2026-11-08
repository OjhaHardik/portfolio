/* The Dale study: the comparison switch (the site's own table, one side at a time)
   and the pan of screens, pinned on wide screens so scrolling down walks you along the page. */
(function () {
  'use strict';
  const { $, $$, motion } = window.ST;

  /* ---------- Comparison switch ---------- */
  const cmp = $('#cmp');
  if (cmp) {
    const btns = $$('.cmp-switch button', cmp);
    const sides = $$('[data-side]', cmp);
    const show = (side) => {
      cmp.dataset.show = side;
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.side === side)));
      sides.forEach((s) => s.setAttribute('aria-hidden', String(s.dataset.side !== side)));
    };
    btns.forEach((b) => b.addEventListener('click', () => show(b.dataset.side)));
    show('dale');
  }

  /* ---------- Pinned pan: the row moves sideways as you scroll down, the way the site's rooms do ---------- */
  const pan = $('.pan');
  const track = $('#panRail');
  if (pan && track && motion && window.matchMedia('(min-width: 1025px) and (min-height: 700px)').matches) {
    pan.classList.add('is-pinned');
    const dist = () => {
      const last = track.lastElementChild;
      const pad = parseFloat(getComputedStyle(track).paddingRight) || 0;
      return Math.max(0, last.offsetLeft + last.offsetWidth + pad - window.innerWidth);
    };
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: pan, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true }
    });
  }
})();
