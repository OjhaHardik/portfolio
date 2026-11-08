/* Graphics folio. Smooth scroll, word masks, reveals and the brochure rail come from js/study.js (window.ST).
   This file only opens finished pieces full size: a .slot with an <img> inside is a piece, an empty .slot is a
   placeholder and stays inert. Arrow keys step through every piece on the page, in reading order. */
(function () {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  const viewer = $('#viewer');
  const pieces = $$('.gf .slot > img');
  if (!viewer || !pieces.length) return;

  const vImg = $('#vImg');
  const vCap = $('#vCap');
  const lenis = () => window.ST && window.ST.lenis;
  let current = 0;

  function show(i) {
    current = (i + pieces.length) % pieces.length;
    const img = pieces[current];
    vImg.src = img.currentSrc || img.src;
    vImg.alt = img.alt;
    vCap.textContent = img.alt;
  }

  function open(i) {
    show(i);
    viewer.showModal();
    if (lenis()) lenis().stop();
  }

  pieces.forEach((img, i) => {
    const slot = img.parentElement;
    slot.classList.add('is-piece');
    slot.tabIndex = 0;
    slot.setAttribute('role', 'button');
    slot.setAttribute('aria-label', 'View ' + img.alt + ' full size');
    slot.addEventListener('click', () => open(i));
    slot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  $('#vClose').addEventListener('click', () => viewer.close());
  $('#vPrev').addEventListener('click', () => show(current - 1));
  $('#vNext').addEventListener('click', () => show(current + 1));
  viewer.addEventListener('click', (e) => { if (e.target === viewer) viewer.close(); });
  viewer.addEventListener('close', () => { if (lenis()) lenis().start(); });
  viewer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();
