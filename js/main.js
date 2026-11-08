(function () {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const icon = (name) => '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  function hydrateIcons(root = document) {
    $$('[data-icon]', root).forEach((el) => { if (!el.firstChild) el.innerHTML = icon(el.dataset.icon); });
  }

  function session(key, value) {
    try {
      if (value === undefined) return sessionStorage.getItem(key);
      sessionStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  gsap.registerPlugin(ScrollTrigger);
  document.addEventListener('touchstart', () => {}, { passive: true }); // lets iOS show :active press states on touch-down

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function goTo(target) {
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else if (typeof target === 'number') window.scrollTo({ top: target });
    else target.scrollIntoView();
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute('href');
    const el = hash.length > 1 && document.getElementById(hash.slice(1));
    if (!el) return;
    e.preventDefault();
    goTo(el);
    history.replaceState(null, '', hash);
  });

  /* ---------- Hero: program monitor ---------- */
  const heroVideo = $('#heroVideo');
  const heroReel = $('#heroReel');
  const reelFrames = $$('.reel-frame', heroReel);
  const reelSegs = $$('.seg', heroReel);
  const cues = $$('.hero-title .cue');
  const pauseBtn = $('#heroReelPause');
  const firstFrame = $('.reel-frame img').decode().catch(() => {});
  let reelNow = 0;

  if (!reduce) {
    heroVideo.preload = 'auto';
    heroVideo.src = 'Assets/site/hero-tall.mp4';
  }

  function syncHeroVideo() {
    const live = reelFrames[reelNow].contains(heroVideo) && !heroReel.classList.contains('is-paused') && !heroReel.classList.contains('is-off');
    if (live && heroVideo.src) heroVideo.play().catch(() => {});
    else heroVideo.pause();
  }

  function showFrame(n) {
    if (n === reelNow) return;
    reelNow = n;
    reelFrames.forEach((f, i) => f.classList.toggle('is-on', i === n));
    cues.forEach((c, i) => c.classList.toggle('is-on', i === n));
    reelSegs.forEach((s, i) => {
      s.classList.toggle('is-on', i === n);
      s.classList.toggle('is-done', i < n);
      if (i === n) s.setAttribute('aria-current', 'true'); else s.removeAttribute('aria-current');
    });
    syncHeroVideo();
  }

  // CSS runs the clock (see .seg.is-on in main.css), so hover, focus and pause all hold it for free
  heroReel.addEventListener('animationend', (e) => {
    if (!reduce && e.animationName === 'seg-fill') showFrame((reelNow + 1) % reelFrames.length);
  });
  reelSegs.forEach((s, i) => s.addEventListener('click', () => showFrame(i)));
  cues.forEach((c, i) => {
    c.addEventListener('pointerenter', () => showFrame(i));
    c.addEventListener('focus', () => showFrame(i));
  });
  pauseBtn.addEventListener('click', () => {
    const paused = heroReel.classList.toggle('is-paused');
    pauseBtn.setAttribute('aria-label', paused ? 'Play the reel' : 'Pause the reel');
    syncHeroVideo();
  });
  new IntersectionObserver(([entry]) => {
    heroReel.classList.toggle('is-off', !entry.isIntersecting);
    syncHeroVideo();
  }).observe(heroReel);

  function heroIn() {
    if (reduce) return;
    gsap.timeline()
      .fromTo('.hero-title', { filter: 'blur(16px)', opacity: 0, y: 30 }, { filter: 'blur(0px)', opacity: 1, y: 0, duration: 1.6, ease: 'expo.out' }, 0.1)
      .fromTo('.hero-foot', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, 0.45)
      .fromTo('.hero-reel', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)
      .fromTo('.hero-reel-frame', { clipPath: 'inset(10% 10% 10% 10%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out' }, 0)
      .from('.vf-corner', { opacity: 0, scale: 1.6, duration: 1, stagger: 0.05, ease: 'expo.out' }, 0.1)
      .fromTo('.vf-focus', { opacity: 1, scale: 1.8 }, { scale: 1, duration: 1, ease: 'expo.out' }, 0.2)
      .to('.vf-focus', { opacity: 0, duration: 0.4 }, 1.3);
  }

  /* ---------- Slate intro ---------- */
  function runIntro(done) {
    const slate = $('#slate');
    const d = new Date();
    $('#slateDate').textContent = [d.getDate(), d.getMonth() + 1, d.getFullYear()].map((n) => String(n).padStart(2, '0')).join('.');

    const finish = () => {
      slate.hidden = true;
      document.body.classList.remove('is-loading');
      if (lenis) lenis.start();
      heroIn();
      done();
    };

    if (reduce || session('ho-slate')) { finish(); return; }
    session('ho-slate', '1');
    if (lenis) lenis.stop();
    gsap.set('.hero-title, .hero-foot, .hero-reel', { opacity: 0 });

    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    gsap.from('.clapper', { y: 24, opacity: 0, duration: 0.6, ease: 'expo.out' });
    Promise.race([Promise.all([document.fonts.ready, firstFrame, wait(700)]), wait(1800)]).then(() => {
      gsap.timeline({ onComplete: finish })
        .to('.clapper-stick', { rotate: 0, duration: 0.16, ease: 'power4.in' })
        .to('.clapper', { y: 4, duration: 0.06, yoyo: true, repeat: 1 })
        .to({}, { duration: 0.3 });
    });
  }

  /* ---------- Interface: UI builds itself ---------- */
  const stage = $('#uiStage');
  const stageItems = $$('#stageList li');
  let stageNow = -1;
  let clickTimers = [];

  function setStage(n) {
    if (n === stageNow) return;
    stageNow = n;
    for (let s = 1; s <= 4; s++) stage.classList.toggle('s' + s, n >= s);
    stageItems.forEach((li, i) => {
      li.classList.toggle('is-active', i === n);
      li.classList.toggle('is-done', i < n);
    });
    clickTimers.forEach(clearTimeout);
    clickTimers = [];
    if (n >= 4) {
      const r = stage.getBoundingClientRect();
      const p = $('.ph-play', stage).getBoundingClientRect();
      stage.style.setProperty('--cx0', r.width * 0.45 + 'px');
      stage.style.setProperty('--cy0', r.height * 1.05 + 'px');
      stage.style.setProperty('--cx', p.left - r.left + p.width * 0.45 + 'px');
      stage.style.setProperty('--cy', p.top - r.top + p.height * 0.5 + 'px');
      clickTimers.push(setTimeout(() => stage.classList.add('is-clicked'), 1100));
      clickTimers.push(setTimeout(() => { stage.classList.remove('is-clicked'); stage.classList.add('is-playing'); }, 1280));
    } else {
      stage.classList.remove('is-clicked', 'is-playing');
    }
  }

  function renderCases() {
    $('#cases').innerHTML = UI_PROJECTS.map((p) => (
      // the picture sits above the text, so it keeps its own colour; with a case study, the whole card is the link
      '<article class="case case--' + esc(p.tone) + (p.caseStudy ? ' case--link' : '') + '">' +
        '<div class="case-media">' +
          (p.image ? '<img src="' + esc(p.image) + '" alt="" loading="lazy">' : '<span class="case-mark" aria-hidden="true">' + esc(p.name.charAt(0)) + '</span>') +
        '</div>' +
        '<div class="case-body">' +
          '<span class="case-tag">' + esc(p.tag || 'Concept') + '</span>' +
          '<h4 class="case-name">' + esc(p.name) + '</h4>' +
          '<p class="case-sum">' + esc(p.summary) + '</p>' +
          '<p class="case-meta"><span>' + esc(p.role) + '</span><span>' + esc(p.platform) + '</span><span>' + esc(p.year) + '</span></p>' +
          (p.caseStudy
            ? '<a class="case-cta link-arrow" href="' + esc(p.caseStudy) + '">Read case study <span class="ic" data-icon="arrow-right"></span></a>'
            : '<span class="case-cta case-cta--soon">Case study in progress</span>') +
        '</div>' +
      '</article>'
    )).join('');
  }

  /* ---------- The Edit: scrub through clips ---------- */
  const strip = $('#tlStrip');
  const tlViewport = $('.tl-viewport');
  const clips = [];
  let activeClip = -1;

  function renderTimeline() {
    let html = '';
    PORTFOLIO_DATA.forEach((cat) => {
      const picks = cat.items.slice().sort((a, b) => a.number - b.number).slice(0, 2);
      html += '<div class="tl-group" data-cat="' + esc(cat.slug) + '"><div class="tl-v2">' + esc(cat.name) + '</div><div class="tl-v1">';
      picks.forEach((item) => {
        const w = item.ratio === 'horizontal' ? 230 : 150;
        html += '<button type="button" class="tl-clip" data-i="' + clips.length + '" style="width:' + w + 'px;background-image:url(&quot;' + encodeURI(item.thumbnail) + '&quot;)" aria-label="Show ' + esc(item.title) + '"></button>';
        clips.push({ item, cat });
      });
      html += '</div></div>';
    });
    strip.insertAdjacentHTML('beforeend', html);
    $$('.tl-clip', strip).forEach((el, i) => { clips[i].el = el; clips[i].group = el.closest('.tl-group'); });
    drawWave();
  }

  function drawWave() {
    const canvas = $('#tlWave');
    const w = strip.scrollWidth;
    const h = 44;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.fillStyle = 'rgba(163,163,170,.35)';
    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    let amp = 0.4;
    const pad = parseFloat(getComputedStyle(strip).paddingLeft) || 0;
    for (let x = pad; x < w - pad; x += 3) {
      amp += (rand() - 0.5) * 0.25;
      amp = Math.max(0.12, Math.min(0.95, amp));
      const bh = Math.max(2, amp * (h - 10) * (0.6 + rand() * 0.4));
      ctx.fillRect(x, (h - bh) / 2, 2, bh);
    }
  }

  function setClip(i) {
    if (i === activeClip || !clips[i]) return;
    const prev = clips[activeClip];
    if (prev) { prev.el.classList.remove('is-active'); prev.group.classList.remove('is-active'); }
    activeClip = i;
    const { item, cat, el, group } = clips[i];
    el.classList.add('is-active');
    group.classList.add('is-active');
    const img = $('#monitorImg');
    img.src = item.thumbnail;
    img.alt = item.title;
    $('#monitorBg').style.backgroundImage = 'url("' + encodeURI(item.thumbnail) + '")';
    $('#clipCat').textContent = cat.name;
    $('#clipTitle').textContent = item.title;
    $('#clipLink').href = item.link;
  }

  function clipAt(pos) {
    for (let i = 0; i < clips.length; i++) {
      const el = clips[i].el;
      if (pos >= el.offsetLeft - 2 && pos < el.offsetLeft + el.offsetWidth + 2) return i;
    }
    return -1;
  }

  /* ---------- Rolling: showreel ---------- */
  const reel = $('#reel');
  const reelVideo = $('#reelVideo');
  reelVideo.poster = SITE.reel.poster;

  function playReel() {
    if (!reelVideo.src) reelVideo.src = SITE.reel.src;
    reel.classList.add('is-playing');
    reelVideo.controls = true;
    reelVideo.play().catch(() => {});
  }
  $('#reelPlay').addEventListener('click', playReel);
  reelVideo.addEventListener('play', () => window.Soundtrack.duck(true));
  reelVideo.addEventListener('pause', () => window.Soundtrack.duck(false));
  reelVideo.addEventListener('ended', () => {
    reel.classList.remove('is-playing');
    reelVideo.controls = false;
  });

  /* ---------- Darkroom ---------- */
  const pickPath = '<svg class="pick" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" vector-effect="non-scaling-stroke" d="M52 5 C82 4 97 24 95 52 C93 81 72 96 46 95 C19 94 4 74 5 47 C6 23 26 7 58 9"/></svg>';

  function renderSheet() {
    $('#sheet').innerHTML = PHOTOS.map((p) => (
      '<figure class="frame frame--' + esc(p.shape || 'normal') + '">' +
        '<img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '" loading="lazy">' +
        (p.pick ? pickPath : '') +
      '</figure>'
    )).join('');

    const frames = $$('.frame');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const i = frames.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('is-developed'), (i % 4) * 180);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    frames.forEach((f) => io.observe(f));

    if (!finePointer || reduce) return;
    const loupe = $('#loupe');
    const ZOOM = 2.4;
    const R = 90;
    $('#sheet').addEventListener('pointermove', (e) => {
      const frame = e.target.closest('.frame.is-developed');
      if (!frame) { loupe.classList.remove('is-on'); return; }
      const img = $('img', frame);
      if (!img.naturalWidth) return;
      const r = img.getBoundingClientRect();
      const scale = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const x = e.clientX - r.left - (r.width - dw) / 2;
      const y = e.clientY - r.top - (r.height - dh) / 2;
      loupe.style.left = e.clientX + 'px';
      loupe.style.top = e.clientY + 'px';
      loupe.style.backgroundImage = 'url("' + img.currentSrc + '")';
      loupe.style.backgroundSize = dw * ZOOM + 'px ' + dh * ZOOM + 'px';
      loupe.style.backgroundPosition = -(x * ZOOM - R) + 'px ' + -(y * ZOOM - R) + 'px';
      loupe.classList.add('is-on');
    });
    $('#sheet').addEventListener('pointerleave', () => loupe.classList.remove('is-on'));
  }

  /* ---------- Every cut: one category at a time ---------- */
  const total = PORTFOLIO_DATA.reduce((n, c) => n + c.items.length, 0);
  const rail = $('#workRail');
  const railPrev = $('#railPrev');
  const railNext = $('#railNext');

  function renderWork() {
    $('#workLede').textContent = total + ' reels and films across healthcare, food, beauty, education, real estate, short film and creative work.';
    $('#chips').innerHTML = PORTFOLIO_DATA.map((c) => (
      '<button type="button" class="chip" role="tab" id="tab-' + esc(c.slug) + '" data-filter="' + esc(c.slug) + '" aria-controls="workRail" aria-selected="false" tabindex="-1">' +
        esc(c.name) + ' <small>' + c.items.length + '</small></button>'
    )).join('');

    $('#chips').addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (b) setFilter(b.dataset.filter);
    });
    // arrow keys move along the tabs, as screen reader users expect from a tab list
    $('#chips').addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      const tabs = $$('#chips .chip');
      const i = tabs.indexOf(document.activeElement);
      if (!step || i < 0) return;
      e.preventDefault();
      const next = tabs[(i + step + tabs.length) % tabs.length];
      next.focus();
      setFilter(next.dataset.filter);
    });

    railPrev.addEventListener('click', () => rail.scrollBy({ left: -rail.clientWidth * 0.8, behavior: 'smooth' }));
    railNext.addEventListener('click', () => rail.scrollBy({ left: rail.clientWidth * 0.8, behavior: 'smooth' }));
    rail.addEventListener('scroll', syncRailButtons, { passive: true });
    window.addEventListener('resize', syncRailButtons);

    // the cards rise in the first time the rail comes on screen
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      rail.classList.add('is-in');
      io.disconnect();
    }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(rail);
    setFilter(PORTFOLIO_DATA[0].slug, true);
  }

  function syncRailButtons() {
    railPrev.disabled = rail.scrollLeft < 4;
    railNext.disabled = rail.scrollLeft > rail.scrollWidth - rail.clientWidth - 4;
  }

  function setFilter(slug, silent) {
    const cat = PORTFOLIO_DATA.find((c) => c.slug === slug);
    $$('#chips .chip').forEach((b) => {
      const on = b.dataset.filter === slug;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    rail.setAttribute('aria-labelledby', 'tab-' + slug);
    const before = rail.offsetHeight;
    rail.innerHTML = cat.items.slice().sort((a, b) => a.number - b.number).map((item, n) => (
      '<a class="vcard ' + esc(item.ratio) + '" href="' + esc(item.link) + '" target="_blank" rel="noopener noreferrer" style="animation-delay:' + Math.min(n * 45, 360) + 'ms">' +
        '<div class="vcard-thumb">' +
          '<img src="' + esc(item.thumbnail) + '" alt="" loading="lazy">' +
          '<span class="vcard-play glass"><span class="ic" data-icon="play-fill"></span></span>' +
        '</div>' +
        '<p class="vcard-title">' + esc(item.title) + '</p>' +
      '</a>'
    )).join('');
    hydrateIcons(rail);
    rail.scrollLeft = 0;
    syncRailButtons();
    if (silent) return;
    // replay the rise for the new set
    if (rail.classList.contains('is-in')) {
      rail.classList.remove('is-in');
      void rail.offsetWidth;
      rail.classList.add('is-in');
    }
    if (rail.offsetHeight !== before) ScrollTrigger.refresh();
  }

  function categoryFromHash() {
    const slug = location.hash.slice(1);
    return PORTFOLIO_DATA.some((c) => c.slug === slug) ? slug : null;
  }

  /* ---------- Graphics: a spotlight flow ----------
     One piece in the centre, its neighbours turned away. A single critically damped spring drives the
     position, so every move (buttons, keys, chips, a flick) starts from wherever it is and can be
     interrupted. Dragging tracks the pointer 1:1; on release the flick's velocity carries into the spring. */
  function renderGraphics() {
    const flow = $('#gfxFlow');
    const track = $('#gfxTrack');
    const pieces = GRAPHICS_DATA.flatMap((cat) => cat.items.map((item) => ({ item, cat })));
    const firstOf = {};
    pieces.forEach(({ cat }, i) => { if (!(cat.slug in firstOf)) firstOf[cat.slug] = i; });

    track.innerHTML = pieces.map(({ item, cat }, i) => (
      '<figure class="flow-item" data-i="' + i + '" style="--ar:' + item.width + ' / ' + item.height + '">' +
        '<a href="graphics.html#' + esc(cat.slug) + '" tabindex="-1" draggable="false">' +
          '<img src="' + esc(item.image) + '" alt="' + esc(item.title + ', ' + cat.name) + '" width="' + item.width + '" height="' + item.height + '" loading="lazy" draggable="false">' +
        '</a>' +
      '</figure>'
    )).join('');
    $('#gfxChips').innerHTML = GRAPHICS_DATA.map((cat) => (
      '<button type="button" class="chip" data-cat="' + esc(cat.slug) + '" aria-pressed="false">' + esc(cat.name) + ' <small>' + cat.items.length + '</small></button>'
    )).join('');

    const items = $$('.flow-item', track);
    const links = items.map((el) => $('a', el));
    const chips = $$('#gfxChips .chip');
    const glows = $$('.flow-glow i', flow);
    const n = items.length;
    const loop = n >= 5; // with fewer pieces the ring would show the same ones on both sides
    const wrap = (i) => ((i % n) + n) % n;
    let now = -1;
    let pos = 0;
    let target = 0;
    let vel = 0;
    let raf = 0;
    let lastT = 0;
    let glowK = 0;

    function layout(p) {
      items.forEach((el, i) => {
        let d = i - p;
        if (loop) { d = wrap(d); if (d > n / 2) d -= n; } // the nearest way round the ring
        const a = Math.abs(d);
        const s = Math.sign(d);
        el.style.setProperty('--x', (s * (Math.min(a, 1) * 0.7 + Math.max(a - 1, 0) * 0.42)).toFixed(4));
        el.style.setProperty('--ry', (s * Math.min(a, 1) * -34).toFixed(2) + 'deg');
        el.style.setProperty('--s', (1 - Math.min(a, 2) * 0.12).toFixed(4));
        el.style.setProperty('--b', (1 - Math.min(a, 1.5) * 0.14).toFixed(3));
        el.style.opacity = Math.max(0, Math.min(1, 2.9 - a)).toFixed(3);
        el.style.visibility = a > 2.9 ? 'hidden' : '';
        el.style.zIndex = String(100 - Math.round(a * 10));
      });
    }

    // the piece nearest the centre owns the caption, the chips and the glow
    function setCurrent(k) {
      if (k === now) return;
      now = k;
      const { item, cat } = pieces[k];
      items.forEach((el, j) => el.classList.toggle('is-center', j === k));
      links.forEach((a, j) => { a.tabIndex = j === k ? 0 : -1; });
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.cat === cat.slug)));
      $('#gfxTitle').textContent = item.title;
      $('#gfxCat').textContent = cat.name;
      if (!loop) { $('#gfxPrev').disabled = k === 0; $('#gfxNext').disabled = k === n - 1; }
      glowK = 1 - glowK;
      glows[glowK].style.backgroundImage = 'url("' + encodeURI(item.image) + '")';
      glows[glowK].classList.add('is-on');
      glows[1 - glowK].classList.remove('is-on');
    }

    function tick(ts) {
      const dt = Math.min(0.032, (ts - lastT) / 1000);
      lastT = ts;
      const w = (2 * Math.PI) / 0.55; // response 0.55s, damping 1
      vel += (w * w * (target - pos) - 2 * w * vel) * dt;
      pos += vel * dt;
      if (Math.abs(target - pos) < 0.0005 && Math.abs(vel) < 0.002) { pos = target; vel = 0; raf = 0; }
      else raf = requestAnimationFrame(tick);
      layout(pos);
    }
    function stop() { cancelAnimationFrame(raf); raf = 0; vel = 0; }

    // i may run past either end when looping; v hands over a flick's velocity, in pieces per second
    function go(i, v) {
      target = loop ? i : Math.max(0, Math.min(n - 1, i));
      setCurrent(wrap(target));
      if (typeof v === 'number') vel = v;
      if (reduce) { stop(); pos = target; layout(pos); return; }
      if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(tick); }
    }
    // the target for piece k on the lap nearest the current position
    const lap = (k) => {
      if (!loop) return k;
      const base = Math.round(pos);
      let d = wrap(k - base);
      if (d > n / 2) d -= n;
      return base + d;
    };

    const stepPx = () => flow.clientHeight * 0.75 * 0.7; // distance between the centre and the next piece
    const rubber = (over) => (over * 0.55) / (1 + over * 0.55); // past either end it resists more the further you pull
    const soft = (p) => (loop ? p : p < 0 ? -rubber(-p) : p > n - 1 ? n - 1 + rubber(p - n + 1) : p);
    const follow = (p) => { pos = soft(p); target = pos; layout(pos); setCurrent(wrap(Math.round(pos))); };

    let drag = null;
    let suppressClick = false;
    flow.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      drag = { id: e.pointerId, x0: e.clientX, p0: pos, moved: false, hist: [[e.clientX, e.timeStamp]] };
    });
    flow.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x0;
      if (!drag.moved) {
        if (Math.abs(dx) < 8) return;
        drag.moved = true;
        drag.p0 = pos; // grab it wherever it is, even mid-move
        drag.x0 = e.clientX;
        stop();
        flow.setPointerCapture(e.pointerId);
        flow.classList.add('is-dragging');
      }
      follow(drag.p0 - (e.clientX - drag.x0) / stepPx());
      drag.hist.push([e.clientX, e.timeStamp]);
      if (drag.hist.length > 5) drag.hist.shift();
    });
    const release = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (drag.moved) {
        const [x1, t1] = drag.hist[0];
        const [x2, t2] = drag.hist[drag.hist.length - 1];
        const v = -((x2 - x1) / Math.max(1, t2 - t1)) * 1000 / stepPx(); // pieces per second
        const travel = (v / 1000) * 0.995 / (1 - 0.995); // Apple's momentum projection (deceleration rate .995), in pieces
        flow.classList.remove('is-dragging');
        go(Math.round(pos + travel), v);
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 0);
      }
      drag = null;
    };
    flow.addEventListener('pointerup', release);
    flow.addEventListener('pointercancel', release);

    // a click on a side piece brings it to the centre; only the centre piece opens the gallery
    flow.addEventListener('click', (e) => {
      const el = e.target.closest('.flow-item');
      if (!suppressClick && (!el || el.classList.contains('is-center'))) return;
      e.preventDefault();
      if (!suppressClick) go(lap(Number(el.dataset.i)));
    });

    // a sideways trackpad swipe tracks like a drag, then settles on the nearest piece
    let settle = 0;
    flow.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      stop();
      follow(pos + e.deltaX / stepPx());
      clearTimeout(settle);
      settle = setTimeout(() => go(Math.round(pos)), 140);
    }, { passive: false });

    flow.addEventListener('keydown', (e) => {
      const step = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
      if (!step) return;
      e.preventDefault();
      go(target + step);
      links[now].focus({ preventScroll: true });
    });
    $('#gfxPrev').addEventListener('click', () => go(target - 1));
    $('#gfxNext').addEventListener('click', () => go(target + 1));
    $('#gfxChips').addEventListener('click', (e) => {
      const c = e.target.closest('.chip');
      if (c) go(lap(firstOf[c.dataset.cat]));
    });

    layout(pos);
    setCurrent(0);
  }

  /* ---------- Contact ---------- */
  function initContact() {
    $('#year').textContent = new Date().getFullYear();
    $('#socials').innerHTML = SITE.socials.filter((s) => s.href).map((s) =>
      '<li><a class="link-arrow" href="' + esc(s.href) + '" target="_blank" rel="noopener noreferrer">' + esc(s.label) + ' <span class="ic" data-icon="arrow-up-right"></span></a></li>'
    ).join('');

    const btn = $('#copyBtn');
    const label = $('.copy-label', btn);
    btn.addEventListener('click', async () => {
      let ok = false;
      try { await navigator.clipboard.writeText(SITE.email); ok = true; } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = SITE.email;
        document.body.appendChild(ta);
        ta.select();
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        ta.remove();
      }
      label.textContent = ok ? 'Copied' : 'Copy failed';
      btn.classList.toggle('is-copied', ok);
      setTimeout(() => { label.textContent = 'Copy'; btn.classList.remove('is-copied'); }, 2000);
    });
  }

  /* ---------- Timeline dock ---------- */
  const scenes = $$('[data-scene]');
  const dockTrack = $('#dockTrack');
  const dockHead = $('#dockHead');
  const dockClips = [];
  let starts = [];
  let activeScene = -1;

  function buildDock() {
    scenes.forEach((sec) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'dock-clip';
      b.textContent = sec.dataset.scene;
      b.setAttribute('aria-label', 'Go to ' + sec.dataset.scene);
      b.addEventListener('click', () => goTo(sec));
      dockTrack.appendChild(b);
      dockClips.push(b);
    });
  }

  function measureDock() {
    const max = ScrollTrigger.maxScroll(window);
    starts = scenes.map((sec) => Math.min(max, Math.max(0, sec.getBoundingClientRect().top + window.scrollY)));
    starts.forEach((s, i) => {
      const end = i < starts.length - 1 ? starts[i + 1] : max + window.innerHeight;
      dockClips[i].style.flexGrow = Math.max(1, end - s);
    });
    updateDock(window.scrollY);
  }

  const navLinks = $$('.topnav a[href^="#"]');
  const topbar = $('.topbar');
  function updateDock(y) {
    let i = 0;
    while (i < starts.length - 1 && y >= starts[i + 1] - 2) i++;
    const max = ScrollTrigger.maxScroll(window);
    const end = i < starts.length - 1 ? starts[i + 1] : max;
    const frac = end > starts[i] ? Math.min(1, (y - starts[i]) / (end - starts[i])) : 1;
    const clip = dockClips[i];
    dockHead.style.transform = 'translateX(' + (clip.offsetLeft + frac * clip.offsetWidth) + 'px)';

    if (i !== activeScene) {
      activeScene = i;
      dockClips.forEach((c, k) => c.classList.toggle('is-active', k === i));
      const id = '#' + scenes[i].id;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === id));
    }

    topbar.classList.toggle('is-top', y < 40);

    const frames = Math.floor(Math.max(0, y) / 6);
    const ff = frames % 24;
    const secs = Math.floor(frames / 24);
    $('#timecode').textContent = [Math.floor(secs / 3600), Math.floor(secs / 60) % 60, secs % 60, ff].map((n) => String(n).padStart(2, '0')).join(':');
  }

  /* ---------- Scroll scenes ---------- */
  function initScenes() {
    const mm = gsap.matchMedia();
    mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)', motion: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
      const { desktop, motion } = ctx.conditions;

      if (motion) {
        // Chapter cards: the title rises out of black while the card arrives, the motif plays
        // while it is pinned (--p), then the title lifts away as the next scene cuts in.
        $$('.chapter').forEach((ch) => {
          const copy = $('.chapter-copy', ch);
          gsap.timeline({
            scrollTrigger: {
              trigger: ch, start: 'top bottom', end: 'bottom top', scrub: 0.5,
              refreshPriority: -1, // measure after the pinned scenes above have added their scroll length
              onUpdate: (self) => {
                const p = self.progress;
                const at = (from, span) => Math.min(1, Math.max(0, (p - from) / span)).toFixed(3);
                ch.style.setProperty('--p', at(0.3, 0.42));
                ch.style.setProperty('--fin', at(0.04, 0.26));
                ch.style.setProperty('--fout', (1 - at(0.72, 0.28)).toFixed(3));
              }
            }
          })
            .fromTo(copy, { opacity: 0, y: 90 }, { opacity: 1, y: 0, duration: 0.24, ease: 'power3.out' }, 0.1)
            .to(copy, { opacity: 0, y: -90, scale: 0.96, duration: 0.2, ease: 'power2.in' }, 0.72)
            .set({}, {}, 1);
        });

        gsap.to('.hero-copy', { yPercent: -18, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

        ScrollTrigger.create({
          trigger: '.interface-pin', pin: true, start: 'top top',
          end: () => '+=' + window.innerHeight * (desktop ? 2.6 : 1.6),
          onUpdate: (self) => setStage(Math.min(4, Math.floor(self.progress * 5.2)))
        });
        gsap.from('.case', { opacity: 0, y: 40, duration: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.cases-grid', start: 'top 80%' } });
      } else {
        setStage(4);
      }

      if (desktop && motion) {
        const travel = () => strip.scrollWidth - tlViewport.clientWidth;
        gsap.to(strip, {
          x: () => -travel(), ease: 'none',
          onUpdate: () => {
            const i = clipAt(tlViewport.clientWidth / 2 - gsap.getProperty(strip, 'x'));
            if (i > -1) setClip(i);
          },
          scrollTrigger: { trigger: '.edit-pin', pin: true, start: 'top top', end: () => '+=' + travel() * 1.3, scrub: 0.6, invalidateOnRefresh: true }
        });
      }

      if (motion) {
        gsap.fromTo('.letterbox', { scaleY: 1 }, { scaleY: 0, ease: 'none', scrollTrigger: { trigger: reel, start: 'top 90%', end: 'center 55%', scrub: true } });
        gsap.fromTo(reel, { scale: 0.86 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: reel, start: 'top bottom', end: 'center 55%', scrub: true } });
      } else {
        gsap.set('.letterbox', { scaleY: 0 });
      }
      ScrollTrigger.create({ trigger: reel, start: 'top bottom', end: 'bottom top', onLeave: () => reelVideo.pause(), onLeaveBack: () => reelVideo.pause() });

      if (desktop && motion) {
        const roll = $('#creditsRoll');
        const screen = $('.credits-screen');
        const rollTravel = () => roll.scrollHeight - screen.clientHeight;
        gsap.to(roll, {
          y: () => -rollTravel(), ease: 'none',
          scrollTrigger: { trigger: '.credits-pin', pin: true, start: 'top top', end: () => '+=' + rollTravel(), scrub: 0.5, invalidateOnRefresh: true }
        });
        gsap.fromTo('.credits-portrait img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.credits-pin', start: 'top bottom', end: 'top top', scrub: true } });
      }

      if (motion) {
        gsap.from('.contact-inner', { opacity: 0, y: 60, ease: 'none', scrollTrigger: { trigger: '#contact', start: 'top 85%', end: 'top 25%', scrub: true } });
      }

      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => updateDock(self.scroll()) });
    });

    ScrollTrigger.addEventListener('refresh', measureDock);
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* ---------- Boot ---------- */
  renderCases();
  renderTimeline();
  renderSheet();
  renderWork();
  renderGraphics();
  initContact();
  buildDock();
  hydrateIcons();

  $$('.tl-clip').forEach((el) => el.addEventListener('click', () => setClip(Number(el.dataset.i))));
  setClip(0);

  window.Soundtrack.init();
  initScenes();

  runIntro(() => {
    setTimeout(() => window.Soundtrack.showPrompt(), 1400);
    ScrollTrigger.refresh();
    const cat = categoryFromHash();
    if (cat) { setFilter(cat); goTo($('#work')); }
  });

  window.addEventListener('hashchange', () => {
    const cat = categoryFromHash();
    if (cat) { setFilter(cat); goTo($('#work')); }
  });
})();
