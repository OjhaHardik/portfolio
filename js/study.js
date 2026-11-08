/* Case studies: shared behaviour for every study page. Each block only runs if its markup is on the page.
   Exposes window.ST so a page's own script can reuse the helpers.

   Motion, and why each piece exists:
   - Title words rise out of their own line, so the project's name lands before anything else.
   - Section headings do the same as they arrive, so each chapter announces itself.
   - The cover opens from an inset frame to the full width, so the reader steps into the project.
   - The opening statement lights up word by word at the speed you scroll, so it is read, not skimmed.
   - Phones drift at slightly different speeds, so they read as separate devices, not a flat strip.
   - Log rules draw left to right as each group arrives, so the dates read as a sequence.
   All of it is transform and opacity, and none of it runs when the device asks for less motion. */
(function () {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const icon = (name) => '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">' + ((window.ICONS && ICONS[name]) || '') + '</svg>';

  $$('[data-icon]').forEach((el) => { if (!el.firstChild) el.innerHTML = icon(el.dataset.icon); });
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Smooth scroll, the same feel as the home page ---------- */
  const motion = !reduce && window.gsap && window.ScrollTrigger && window.Lenis;
  let lenis = null;
  if (motion) {
    gsap.registerPlugin(ScrollTrigger);
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const el = document.getElementById(a.getAttribute('href').slice(1));
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { duration: 1.2 }); else el.scrollIntoView();
  });

  /* ---------- Top bar: clear over the hero, glass once scrolled ---------- */
  const topbar = $('.topbar');
  if (topbar) {
    const probe = document.createElement('i');
    probe.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none';
    document.body.prepend(probe);
    new IntersectionObserver(([e]) => topbar.classList.toggle('is-top', e.isIntersecting)).observe(probe);
  }

  /* ---------- Word masks for headings ---------- */
  const splitWords = (el, cls) => {
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/([ \t\n\r]+)/).forEach((part) => {
            if (!part) return;
            if (/^[ \t\n\r]+$/.test(part)) { frag.append(document.createTextNode(' ')); return; }
            const outer = document.createElement('span');
            outer.className = cls;
            if (cls === 'w') {
              const inner = document.createElement('span');
              inner.textContent = part;
              outer.append(inner);
              outer.style.setProperty('--i', i);
            } else {
              outer.textContent = part;
            }
            i++;
            frag.append(outer);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') {
          walk(n);
        }
      });
    };
    walk(el);
    return $$('.' + cls, el);
  };

  /* ---------- Reveal on enter ---------- */
  let io = null;
  if (!reduce) {
    const root = document.documentElement;
    root.classList.add('reveal-on', 'split-on');
    $$('[data-split]').forEach((el) => splitWords(el, 'w'));
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    $$('[data-reveal], [data-split]:not(.st-title), .st-log ol').forEach((el) => io.observe(el));

    /* the hero plays once the type is ready, so the words rise in their real shapes */
    const hero = $('.st-hero');
    const title = $('.st-title');
    const go = () => requestAnimationFrame(() => { hero && hero.classList.add('is-in'); title && title.classList.add('is-in'); });
    if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))]).then(go); else go();
  }

  if (motion) {
    /* ---------- Cover opens out ---------- */
    $$('.st-cover').forEach((cover) => {
      const frame = $('.st-cover-frame', cover);
      const media = $('.st-cover-frame > img, .st-cover-frame > video', cover);
      gsap.fromTo(frame, { scale: 0.86 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: cover, start: 'top bottom', end: 'top 12%', scrub: true }
      });
      if (media) {
        gsap.fromTo(media, { scale: 1.18, yPercent: -4 }, {
          scale: 1.02, yPercent: 4, ease: 'none',
          scrollTrigger: { trigger: cover, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
    });

    /* ---------- Statement lights up as you read ---------- */
    $$('[data-words]').forEach((el) => {
      const words = splitWords(el, 'lw');
      gsap.fromTo(words, { opacity: 0.16 }, {
        opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 42%', scrub: 0.4 }
      });
    });

    /* ---------- Depth: elements drift at their own speed ---------- */
    $$('[data-speed]').forEach((el) => {
      const s = parseFloat(el.dataset.speed) || 0;
      gsap.fromTo(el, { y: s * 60 }, {
        y: s * -60, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  /* ---------- Copy a colour value ---------- */
  $$('[data-copy]').forEach((btn) => {
    const label = btn.querySelector('.gd-hex-t');
    const text = label ? label.textContent : btn.textContent;
    btn.addEventListener('click', async () => {
      let ok = false;
      try { await navigator.clipboard.writeText(btn.dataset.copy); ok = true; } catch (e) { /* clipboard blocked */ }
      if (!label) return;
      label.textContent = ok ? 'Copied' : btn.dataset.copy;
      btn.classList.toggle('is-copied', ok);
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { label.textContent = text; btn.classList.remove('is-copied'); }, 1400);
    });
  });

  /* ---------- Films play only while they are on screen ---------- */
  $$('video[data-autoplay]').forEach((v) => {
    if (reduce) { v.removeAttribute('autoplay'); v.controls = true; return; }
    new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) v.play().catch(() => {}); else v.pause();
    }), { threshold: 0.35 }).observe(v);
  });

  /* ---------- Rails: buttons step one item, the mouse can drag, touch and trackpads scroll natively ---------- */
  $$('[data-rail]').forEach((rail) => {
    const id = rail.id;
    const items = () => Array.from(rail.children);
    const pad = () => parseFloat(getComputedStyle(rail).paddingLeft) || 0;
    const step = (dir) => {
      const x = rail.scrollLeft + pad();
      const list = items();
      const next = dir > 0 ? list.find((i) => i.offsetLeft > x + 8) : list.slice().reverse().find((i) => i.offsetLeft < x - 8);
      rail.scrollTo({ left: next ? next.offsetLeft - pad() : (dir > 0 ? rail.scrollWidth : 0), behavior: reduce ? 'auto' : 'smooth' });
    };
    $$('[data-rail-prev="' + id + '"]').forEach((b) => b.addEventListener('click', () => step(-1)));
    $$('[data-rail-next="' + id + '"]').forEach((b) => b.addEventListener('click', () => step(1)));
    rail.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });

    let down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 4) { moved = true; rail.classList.add('is-drag'); }
      rail.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', () => { down = false; rail.classList.remove('is-drag'); });
    rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    rail.addEventListener('dragstart', (e) => e.preventDefault());
  });

  window.addEventListener('load', () => { if (motion) ScrollTrigger.refresh(); });
  window.ST = { $, $$, reduce, motion, lenis, icon, splitWords };
})();
