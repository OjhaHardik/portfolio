/* Dark (default) / light toggle. Light uses Ice Silver, Deep Aubergine and Marigold. */
(function () {
  const btn = document.getElementById('themeBtn');
  if (!btn) return;
  const root = document.documentElement;
  const label = () => btn.setAttribute('aria-label', root.dataset.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  label();
  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    if (next === 'dark') delete root.dataset.theme; else root.dataset.theme = next;
    try { localStorage.setItem('ho-theme', next); } catch (e) { /* storage blocked */ }
    label();
  });
})();
