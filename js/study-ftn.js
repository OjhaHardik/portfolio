/* FTN World study: the site's own elevation drawn in five steps as you scroll (the build, step by step),
   and a working picker for the practice's drawing catalogue. */
(function () {
  'use strict';
  const { $, $$, motion } = window.ST;

  /* ---------- Drawing set picker ---------- */
  const data = window.FTN_DRAWINGS;
  const ticks = $('#ticks');
  const list = $('#setList');
  const sum = $('#setSum');
  const tabs = $$('.set-tabs button');
  const label = { planning: 'Planning', architecture: 'Architecture', interiors: 'Interiors', landscape: 'Landscape' };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const show = (key) => {
    const rows = data[key];
    const essential = rows.filter((r) => r[1]).length;
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.k === key)));
    ticks.innerHTML = rows.map((r, i) => '<i class="' + (r[1] ? 'is-e' : '') + '" style="--i:' + i + '"></i>').join('');
    sum.textContent = label[key] + ': ' + rows.length + ' drawing types, ' + essential + ' essential.';
    list.innerHTML = rows.map((r) => '<li class="' + (r[1] ? 'is-e' : '') + '">' + esc(r[0]) + (r[1] ? '<span class="sr"> (essential)</span>' : '') + '</li>').join('');
  };
  if (data && ticks) {
    tabs.forEach((t) => t.addEventListener('click', () => show(t.dataset.k)));
    show('planning');
  }

  /* ---------- Elevation, scaled so line weights stay constant ---------- */
  const elev = $('.f-elev');
  const draw = $('.draw');
  if (elev && 'ResizeObserver' in window) {
    new ResizeObserver(() => {
      const w = elev.getBoundingClientRect().width || 1200;
      elev.style.setProperty('--u', (1200 / w).toFixed(3));
    }).observe(elev);
  }

  /* ---------- The pinned drawing: each line that appears is a stage of the project ---------- */
  const steps = $$('.draw-step');
  const log = $$('#drawLog li');
  const setStep = (n) => {
    steps.forEach((s, i) => s.classList.toggle('is-on', i === n));
    log.forEach((l, i) => l.classList.toggle('is-done', i <= n));
  };
  log.forEach((l) => l.classList.add('is-done')); // complete by default; the scene below resets it when it runs

  if (elev && motion && window.matchMedia('(min-width: 1025px) and (min-height: 700px)').matches) {
    draw.classList.add('is-pinned');
    const groups = $$('[data-step]', elev);
    const prep = groups.map((g) => {
      const solid = [], dashed = [];
      $$('.ln', g).forEach((el) => {
        if (el.classList.contains('ln-dash')) { gsap.set(el, { opacity: 0 }); dashed.push(el); return; }
        const len = el.getTotalLength ? el.getTotalLength() : 0;
        if (!len) return;
        el.style.strokeDasharray = len;
        el.style.strokeDashoffset = len;
        solid.push(el);
      });
      return { solid, dashed };
    });
    gsap.set($$('.fills > *', elev), { opacity: 0 });
    gsap.set($('.labels', elev), { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    prep.forEach((g, i) => {
      tl.to(g.solid, { strokeDashoffset: 0, duration: 0.8, stagger: 0.8 / Math.max(g.solid.length, 1) * 0.6 }, i);
      tl.to(g.dashed, { opacity: 1, duration: 0.4 }, i + 0.55);
    });
    tl.to($('.labels', elev), { opacity: 1, duration: 0.5 }, 1.2);
    tl.to($$('.fills > *', elev), { opacity: 1, duration: 0.8, stagger: 0.04 }, 4.1);

    setStep(0);
    ScrollTrigger.create({
      trigger: draw, start: 'top top', end: () => '+=' + Math.round(window.innerHeight * 4),
      pin: true, scrub: 0.6, animation: tl, invalidateOnRefresh: true,
      onUpdate: (self) => setStep(Math.min(4, Math.max(0, Math.floor(self.progress * 5 - 0.001))))
    });
  }
})();
