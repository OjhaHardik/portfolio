/* Soundtrack: off by default, starts only after a visitor chooses sound.
   Volume fades use the media element directly (works on file:// and with any host). */
window.Soundtrack = (function () {
  const audio = document.getElementById('music');
  const btn = document.getElementById('musicBtn');
  const prompt = document.getElementById('soundPrompt');
  const KEY = 'ho-sound';
  const target = SITE.music.volume;

  let available = false;
  let wanted = false;     // the visitor's choice
  let ducked = false;
  let fadeRaf = 0;

  function store(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* storage blocked */ }
  }
  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function fadeTo(volume, ms, done) {
    cancelAnimationFrame(fadeRaf);
    const from = audio.volume;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / ms);
      audio.volume = from + (volume - from) * t;
      if (t < 1) fadeRaf = requestAnimationFrame(step);
      else if (done) done();
    };
    fadeRaf = requestAnimationFrame(step);
  }

  function render() {
    const on = wanted && !audio.paused;
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Music on, ' + SITE.music.title : 'Music off');
    btn.querySelector('.music-label').textContent = on ? 'Sound on' : 'Sound';
  }

  function play() {
    if (!available) return;
    wanted = true;
    store('on');
    audio.volume = 0;
    audio.play().then(() => {
      fadeTo(ducked ? 0.04 : target, 2000);
      render();
    }).catch(() => {
      // Autoplay blocked: start on the next interaction instead
      const once = () => { play(); };
      window.addEventListener('pointerdown', once, { once: true });
      window.addEventListener('keydown', once, { once: true });
      render();
    });
  }

  function stop(remember) {
    wanted = false;
    if (remember) store('off');
    fadeTo(0, 900, () => { audio.pause(); render(); });
    render();
  }

  function hidePrompt() { prompt.hidden = true; }

  function showPrompt() {
    if (!available || stored()) return;
    prompt.hidden = false;
  }

  function duck(on) {
    ducked = on;
    if (!wanted || audio.paused) return;
    fadeTo(on ? 0.04 : target, on ? 500 : 1500);
  }

  function init() {
    audio.addEventListener('canplay', () => {
      if (available) return;
      available = true;
      btn.hidden = false;
      if (stored() === 'on') play();
    }, { once: true });
    audio.addEventListener('error', () => { available = false; btn.hidden = true; hidePrompt(); });
    audio.addEventListener('play', render);
    audio.addEventListener('pause', render);

    audio.src = SITE.music.src;
    audio.preload = 'auto';
    audio.load();

    btn.addEventListener('click', () => {
      hidePrompt();
      if (wanted && !audio.paused) stop(true); else play();
    });
    document.getElementById('soundOn').addEventListener('click', () => { hidePrompt(); play(); });
    document.getElementById('soundOff').addEventListener('click', () => { hidePrompt(); store('off'); });

    let resumeOnShow = false;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        resumeOnShow = wanted && !audio.paused;
        if (resumeOnShow) audio.pause();
      } else if (resumeOnShow) {
        audio.play().catch(() => {});
      }
    });
  }

  return { init, showPrompt, duck };
})();
