/* Aafreenn study: the walkthrough (the step in the middle of the screen picks the browser's page)
   and the fit demo (a working copy of the product page's size and height block). */
(function () {
  'use strict';
  const { $, $$ } = window.ST;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Walkthrough ---------- */
  const steps = $$('.walk-step');
  if (steps.length) {
    const shots = $$('.browser-view img');
    const marks = $$('#walkIndex li');
    const url = $('#walkUrl');
    let now = -1;
    const show = (n) => {
      if (n === now) return;
      now = n;
      shots.forEach((s, i) => s.classList.toggle('is-on', i === n));
      marks.forEach((m, i) => { m.classList.toggle('is-on', i === n); m.classList.toggle('is-done', i < n); });
      steps.forEach((s, i) => s.classList.toggle('is-on', i === n));
      url.textContent = shots[n].dataset.url;
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) show(Number(e.target.dataset.shot)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach((s) => io.observe(s));
    show(0);
  }

  /* ---------- Fit demo ---------- */
  const demo = $('#fitDemo');
  if (!demo) return;
  const select = $('#demoHeight');
  for (let inches = 59; inches <= 71; inches++) {
    const label = Math.floor(inches / 12) + '′' + (inches % 12) + '″';
    select.insertAdjacentHTML('beforeend', '<option value="' + label + '">' + label + '</option>');
  }
  const cart = $('#demoCart');
  const empty = $('#demoEmpty');
  const error = $('#demoError');
  const MAX = 3; // the real store caps at the pooled stock; three lines is enough to make the point
  let lines = [];

  const render = () => {
    cart.innerHTML = lines.map((l, i) => (
      '<li class="demo-line">' +
        '<span><b>Mahira Farshi Set</b><small>Size: ' + esc(l.size) + ' &middot; Height: ' + esc(l.height) + '</small></span>' +
        '<button type="button" data-i="' + i + '" aria-label="Remove size ' + esc(l.size) + ', height ' + esc(l.height) + '">Remove</button>' +
      '</li>'
    )).join('');
    empty.hidden = lines.length > 0;
  };

  demo.addEventListener('change', () => { error.textContent = ''; demo.classList.remove('has-error'); });
  demo.addEventListener('submit', (e) => {
    e.preventDefault();
    const size = demo.elements.size.value;
    const height = select.value;
    const missing = [!size && 'a size', !height && 'a height'].filter(Boolean);
    if (missing.length) {
      error.textContent = 'Pick ' + missing.join(' and ') + ' first.';
      demo.classList.add('has-error');
      return;
    }
    if (lines.length >= MAX) {
      error.textContent = 'Three lines is enough for a demo. Remove one to add another.';
      return;
    }
    lines.push({ size, height });
    render();
  });
  cart.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-i]');
    if (!b) return;
    lines.splice(Number(b.dataset.i), 1);
    error.textContent = '';
    render();
  });
  render();
})();
