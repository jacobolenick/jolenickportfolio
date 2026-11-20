/*
  Dugout Series 1 — rip a pack of 10 baseball cards from a 30-card set.
  A pixel baseball sits in the bottom-right corner of every page; click it to open a pack.
  Sounds are synthesized with Web Audio (no audio files).
*/
(() => {
  // ---------- the set (edit freely) ----------
  const TEAMS = {
    'Red Sox':   { body: '#ffffff', numc: '#bd3039', trim: '#0c2340', cap: '#0c2340', logo: '#bd3039' },
    Yankees:     { body: '#ffffff', numc: '#0c2340', trim: '#0c2340', pin: '#9aa6bf', cap: '#0c2340', logo: '#ffffff' },
    Mariners:    { body: '#ffffff', numc: '#0c2c56', trim: '#005c5c', cap: '#0c2c56', logo: '#005c5c' },
    Brooklyn:    { body: '#ffffff', numc: '#005a9c', trim: '#005a9c', cap: '#005a9c', logo: '#ffffff' },
    Braves:      { body: '#ffffff', numc: '#ce1141', trim: '#13274f', cap: '#13274f', brim: '#ce1141', logo: '#ce1141' },
    Giants:      { body: '#f5efe0', numc: '#fd5a1e', trim: '#27251f', cap: '#27251f', logo: '#fd5a1e' },
    Orioles:     { body: '#ffffff', numc: '#df4601', trim: '#111111', cap: '#111111', brim: '#df4601', logo: '#df4601' },
    Padres:      { body: '#2f241d', numc: '#ffc425', trim: '#ffc425', cap: '#2f241d', logo: '#ffc425' },
    Athletics:   { body: '#003831', numc: '#efb21e', trim: '#efb21e', cap: '#003831', brim: '#efb21e', logo: '#efb21e' },
    Pirates:     { body: '#27251f', numc: '#fdb827', trim: '#fdb827', cap: '#27251f', logo: '#fdb827' },
    Cleveland:   { body: '#ffffff', numc: '#0c2340', trim: '#e31937', cap: '#0c2340', brim: '#e31937', logo: '#e31937' },
    Dodgers:     { body: '#ffffff', numc: '#ef3e42', trim: '#005a9c', cap: '#005a9c', logo: '#ffffff' },
    Angels:      { body: '#ffffff', numc: '#ba0021', trim: '#003263', cap: '#ba0021', logo: '#ffffff' },
    Mets:        { body: '#ffffff', numc: '#002d72', trim: '#ff5910', pin: '#a9b6d6', cap: '#002d72', logo: '#ff5910' },
    Royals:      { body: '#ffffff', numc: '#004687', trim: '#bd9b60', cap: '#004687', logo: '#ffffff' },
    Cubs:        { body: '#ffffff', numc: '#0e3386', trim: '#cc3433', pin: '#9fb0dc', cap: '#0e3386', logo: '#cc3433' },
    Reds:        { body: '#ffffff', numc: '#c6011f', trim: '#111111', cap: '#c6011f', logo: '#ffffff' },
  };
  // Portrait looks: skin tone (1 light – 5 deep), hair color, extras: g = goatee, b = beard, m = mustache, l = long hair, r = cap backwards
  const SKIN = ['#f1c7a5', '#dca57e', '#b97a51', '#8a5634', '#5e3a22'];
  const HAIR = { k: '#221811', n: '#5b3a24' };
  // [name, team, position, number, years, legend, look]
  const SET = [
    ['David Ortiz', 'Red Sox', 'DH', 34, '1997 – 2016', 1, '4k-g'],
    ['Derek Jeter', 'Yankees', 'SS', 2, '1995 – 2014', 1, '3k'],
    ['Ken Griffey Jr.', 'Mariners', 'CF', 24, '1989 – 2010', 1, '4k-r'],
    ['Babe Ruth', 'Yankees', 'RF', 3, '1914 – 1935', 1, '1n'],
    ['Jackie Robinson', 'Brooklyn', '2B', 42, '1947 – 1956', 1, '5k'],
    ['Hank Aaron', 'Braves', 'RF', 44, '1954 – 1976', 1, '5k'],
    ['Willie Mays', 'Giants', 'CF', 24, '1951 – 1973', 1, '5k'],
    ['Mariano Rivera', 'Yankees', 'RP', 42, '1995 – 2013', 1, '3k'],
    ['Ichiro Suzuki', 'Mariners', 'RF', 51, '2001 – 2019', 1, '2k'],
    ['Cal Ripken Jr.', 'Orioles', 'SS', 8, '1981 – 2001', 1, '1n'],
    ['Tony Gwynn', 'Padres', 'RF', 19, '1982 – 2001', 1, '4k-m'],
    ['Rickey Henderson', 'Athletics', 'LF', 24, '1979 – 2003', 1, '5k'],
    ['Pedro Martinez', 'Red Sox', 'SP', 45, '1992 – 2009', 1, '3k'],
    ['Roberto Clemente', 'Pirates', 'RF', 21, '1955 – 1972', 1, '4k'],
    ['Manny Ramirez', 'Red Sox', 'LF', 24, '1993 – 2011', 1, '3k-gl'],
    ['Omar Vizquel', 'Cleveland', 'SS', 13, '1989 – 2012', 1, '2k'],
    ['Chipper Jones', 'Braves', '3B', 10, '1993 – 2012', 1, '1n'],
    ['Shohei Ohtani', 'Dodgers', 'DH / P', 17, '2018 – now', 0, '2k'],
    ['Aaron Judge', 'Yankees', 'RF', 99, '2016 – now', 0, '3k'],
    ['Mookie Betts', 'Dodgers', 'SS', 50, '2014 – now', 0, '4k-b'],
    ['Mike Trout', 'Angels', 'OF', 27, '2011 – now', 0, '1n'],
    ['Juan Soto', 'Mets', 'RF', 22, '2018 – now', 0, '3k'],
    ['Bobby Witt Jr.', 'Royals', 'SS', 7, '2022 – now', 0, '1n'],
    ['Pete Crow-Armstrong', 'Cubs', 'CF', 4, '2023 – now', 0, '1n'],
    ['Nick Kurtz', 'Athletics', '1B', 16, '2025 – now', 0, '1n'],
    ['Julio Rodríguez', 'Mariners', 'CF', 44, '2022 – now', 0, '3k'],
    ['Ronald Acuña Jr.', 'Braves', 'RF', 13, '2018 – now', 0, '3k-b'],
    ['Paul Skenes', 'Pirates', 'SP', 30, '2024 – now', 0, '1n-m'],
    ['Elly De La Cruz', 'Reds', 'SS', 44, '2023 – now', 0, '3k'],
    ['Gunnar Henderson', 'Orioles', 'SS', 2, '2022 – now', 0, '1n'],
  ].map(([name, team, pos, num, years, legend, look], i) => ({ id: i + 1, name, team, pos, num, years, legend: !!legend, look }));
  const PACK_SIZE = 10, HOLO_ODDS = 1 / 6;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  let soundOn = store.get('dugout-sound', true);

  // ---------- sound ----------
  let ac;
  const audio = () => (ac = ac || new (window.AudioContext || window.webkitAudioContext)());
  function noise(a, dur) {
    const b = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = a.createBufferSource(); s.buffer = b; return s;
  }
  const sfx = {
    rip() {
      const a = audio(), t = a.currentTime, s = noise(a, 0.6), f = a.createBiquadFilter(), g = a.createGain();
      f.type = 'bandpass'; f.Q.value = 0.9;
      f.frequency.setValueAtTime(700, t); f.frequency.exponentialRampToValueAtTime(4800, t + 0.42);
      g.gain.setValueAtTime(0, t);
      for (let k = 0; k < 24; k++) g.gain.setValueAtTime(0.2 + Math.random() * 0.55, t + 0.01 + k * 0.019); // crinkly foil
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      s.connect(f).connect(g).connect(a.destination); s.start(t);
    },
    whoosh() {
      const a = audio(), t = a.currentTime, s = noise(a, 0.45), f = a.createBiquadFilter(), g = a.createGain();
      f.type = 'lowpass'; f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(2200, t + 0.35);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.12); g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      s.connect(f).connect(g).connect(a.destination); s.start(t);
    },
    flick() {
      const a = audio(), t = a.currentTime, s = noise(a, 0.07), f = a.createBiquadFilter(), g = a.createGain();
      f.type = 'highpass'; f.frequency.value = 2400;
      g.gain.setValueAtTime(0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      s.connect(f).connect(g).connect(a.destination); s.start(t);
    },
    chime(big) {
      const a = audio(), t = a.currentTime;
      (big ? [784, 988, 1319, 1568] : [880, 1319]).forEach((hz, i) => {
        const o = a.createOscillator(), g = a.createGain(), at = t + i * 0.07;
        o.type = 'triangle'; o.frequency.value = hz;
        g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(0.14, at + 0.02); g.gain.exponentialRampToValueAtTime(0.001, at + 0.5);
        o.connect(g).connect(a.destination); o.start(at); o.stop(at + 0.55);
      });
    },
  };
  const play = (name, arg) => { if (soundOn) try { sfx[name](arg); } catch (e) {} };

  // ---------- helpers ----------
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const mountAll = (root) => root.querySelectorAll('canvas[data-pix]').forEach((c) => window.Pixel && Pixel.mount(c));
  const unmountAll = (root) => root.querySelectorAll('canvas[data-pix]').forEach((c) => window.Pixel && Pixel.unmount(c));

  function cardHTML(c, i) {
    const t = TEAMS[c.team];
    const frame = t.body !== '#ffffff' && t.body !== '#f5efe0' ? t.body : t.numc;
    const x = c.look.split('-')[1] || '';
    const beard = x.includes('g') ? 'goatee' : x.includes('b') ? 'beard' : x.includes('m') ? 'mustache' : '';
    return `<div class="tc${c.legend ? ' legend' : ''}${c.holo ? ' holo' : ''}" style="--team:${frame};--team2:${t.trim}">
      <div class="tc-inner">
        <div class="tc-face tc-front">
          <div class="tc-top"><span>${esc(c.team)}</span><span>No. ${pad(c.id)}/${SET.length}</span></div>
          <div class="tc-art">
            <canvas data-pix="face" data-scale="fluid" data-i="${i}" data-skin="${SKIN[+c.look[0] - 1]}" data-hair="${HAIR[c.look[1]]}"${beard ? ` data-beard="${beard}"` : ''}${x.includes('l') ? ' data-long="1"' : ''}${x.includes('r') ? ' data-back="1"' : ''} data-cap="${t.cap}"${t.brim ? ` data-brim="${t.brim}"` : ''} data-logo="${t.logo}" data-body="${t.body}" data-trim="${t.trim}" aria-label="Pixel portrait of ${esc(c.name)}"></canvas>
            <span class="tc-badge">${c.holo ? 'Holo · ' : ''}${c.legend ? 'Legend' : 'Active'}</span>
          </div>
          <div class="tc-name">${esc(c.name)}</div>
          <div class="tc-meta"><span>${esc(c.pos)} · #${c.num}</span><span>${esc(c.years)}</span></div>
          <div class="tc-shine"></div>
        </div>
        <div class="tc-face tc-back"><div class="tc-back-in"><canvas data-pix="baseball" data-scale="fluid" aria-hidden="true"></canvas><b>DUGOUT</b><span>Series 1 · Baseball</span></div></div>
      </div>
    </div>`;
  }

  // ---------- floating baseball ----------
  const fab = el('button', 'rip-fab', '<canvas data-pix="baseball" data-scale="3" aria-hidden="true"></canvas><span class="rip-tip">Rip a pack</span>');
  fab.type = 'button';
  fab.setAttribute('aria-label', 'Rip open a pack of baseball cards');
  document.body.appendChild(fab);
  mountAll(fab);
  fab.addEventListener('click', open);

  // ---------- modal ----------
  let modal, stage, pull, idx, revealed, lastFocus;

  function open() {
    lastFocus = document.activeElement;
    modal = el('div', 'rip');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Dugout Series 1 card pack');
    modal.innerHTML = `
      <div class="rip-bar">
        <span class="rip-status"></span>
        <div class="rip-actions">
          <button type="button" class="rip-icon" data-sound aria-label="Toggle sound"></button>
          <button type="button" class="rip-icon" data-close aria-label="Close">✕</button>
        </div>
      </div>
      <div class="rip-stage"></div>`;
    document.body.appendChild(modal);
    document.documentElement.classList.add('rip-open');
    stage = modal.querySelector('.rip-stage');
    modal.querySelector('[data-close]').addEventListener('click', close);
    const snd = modal.querySelector('[data-sound]');
    const paintSound = () => { snd.textContent = soundOn ? '♪ on' : '♪ off'; snd.setAttribute('aria-pressed', soundOn); };
    snd.addEventListener('click', () => { soundOn = !soundOn; store.set('dugout-sound', soundOn); paintSound(); });
    paintSound();
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target === stage) close(); });
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => modal.classList.add('in'));
    showPack();
  }

  function close() {
    if (!modal) return;
    document.removeEventListener('keydown', onKey);
    unmountAll(modal);
    modal.remove(); modal = null;
    document.documentElement.classList.remove('rip-open');
    lastFocus && lastFocus.focus && lastFocus.focus();
  }

  function setStatus(html) { modal.querySelector('.rip-status').innerHTML = html; }

  function onKey(e) {
    if (e.key === 'Escape') return close();
    if (!stage.querySelector('.deck')) {
      if ((e.key === 'Enter' || e.key === ' ') && stage.querySelector('.pack') && document.activeElement === stage.querySelector('.pack')) { e.preventDefault(); tear(); }
      return;
    }
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); advance(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
  }

  // ---------- pack ----------
  function showPack() {
    unmountAll(stage);
    const collected = store.get('dugout-collection', []);
    setStatus(`Dugout Series 1 · <b>${collected.length}/${SET.length}</b> collected`);
    stage.innerHTML = `
      <div class="pack-wrap">
        <div class="pack" tabindex="0" role="button" aria-label="Rip open the pack">
          <div class="pack-top"></div>
          <div class="pack-body">
            <div class="pack-shine"></div>
            <span class="pack-series">Series 1 · Baseball</span>
            <canvas data-pix="baseball" data-scale="fluid" aria-hidden="true"></canvas>
            <b class="pack-brand">DUGOUT</b>
            <span class="pack-count">${PACK_SIZE} cards</span>
          </div>
        </div>
        <p class="rip-hint">Drag across the top, or tap, to rip it open</p>
      </div>`;
    mountAll(stage);
    const pack = stage.querySelector('.pack');
    pack.focus({ preventScroll: true });
    let x0 = null, done = false;
    pack.addEventListener('pointerdown', (e) => { x0 = e.clientX; try { pack.setPointerCapture(e.pointerId); } catch (err) {} });
    pack.addEventListener('pointermove', (e) => {
      if (x0 === null || done) return;
      const dx = Math.abs(e.clientX - x0);
      pack.style.setProperty('--peel', Math.min(dx / 4, 18) + 'deg');
      if (dx > 70) { done = true; tear(); }
    });
    pack.addEventListener('pointerup', () => { if (!done) { done = true; tear(); } x0 = null; });
  }

  function tear() {
    const pack = stage.querySelector('.pack');
    if (!pack || pack.classList.contains('torn')) return;
    pull = shuffle(SET).slice(0, PACK_SIZE).map((c) => ({ ...c, holo: Math.random() < HOLO_ODDS }));
    // legends + holos go to the back of the pack, like real packs
    pull.sort((a, b) => (a.legend + a.holo * 2) - (b.legend + b.holo * 2));
    play('rip');
    pack.classList.add('torn');
    stage.querySelector('.rip-hint').textContent = '';
    setTimeout(showDeck, reduce ? 50 : 650);
  }

  // ---------- viewer ----------
  function showDeck() {
    unmountAll(stage);
    idx = 0; revealed = new Set();
    play('whoosh');
    stage.innerHTML = `
      <div class="viewer">
        <div class="deck">${pull.map((c, i) => cardHTML(c, i)).join('')}</div>
        <div class="deck-nav">
          <button type="button" class="rip-icon" data-prev aria-label="Previous card">←</button>
          <span class="deck-count"></span>
          <button type="button" class="rip-icon" data-next aria-label="Next card">→</button>
        </div>
        <div class="thumbs">${pull.map((c, i) => `<button type="button" data-go="${i}" aria-label="Card ${i + 1}"></button>`).join('')}</div>
        <p class="rip-hint">Tap the card to flip it · tap again for the next one</p>
      </div>`;
    mountAll(stage);
    const deck = stage.querySelector('.deck');
    deck.classList.add('dealing');
    setTimeout(() => deck.classList.remove('dealing'), reduce ? 0 : 700);
    deck.addEventListener('click', (e) => { if (e.target.closest('.tc.current')) advance(); });
    deck.addEventListener('pointermove', (e) => {
      const c = deck.querySelector('.tc.current'); if (!c || reduce) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty('--rx', ((e.clientY - r.top) / r.height - 0.5) * -10 + 'deg');
      c.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 12 + 'deg');
      c.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
    });
    deck.addEventListener('pointerleave', () => { const c = deck.querySelector('.tc.current'); c && (c.style.setProperty('--rx', '0deg'), c.style.setProperty('--ry', '0deg')); });
    stage.querySelector('[data-prev]').addEventListener('click', () => go(idx - 1));
    stage.querySelector('[data-next]').addEventListener('click', advance);
    stage.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => go(+b.dataset.go)));
    // swipe
    let sx = null;
    deck.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
    deck.addEventListener('touchend', (e) => {
      if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null;
      if (dx < -50) advance(); else if (dx > 50) go(idx - 1);
    });
    layout();
  }

  function reveal(i) {
    if (revealed.has(i)) return;
    revealed.add(i);
    const c = pull[i];
    if (c.holo || c.legend) play('chime', c.holo && c.legend); else play('flick');
    const col = new Set(store.get('dugout-collection', []));
    col.add(c.id); store.set('dugout-collection', [...col]);
  }

  function advance() {
    if (!revealed.has(idx)) { reveal(idx); layout(); return; }
    if (idx < pull.length - 1) go(idx + 1);
    else showSummary();
  }

  function go(i) {
    if (i < 0 || i >= pull.length) return;
    if (i > idx && !revealed.has(idx)) reveal(idx);
    if (i !== idx) play('flick');
    idx = i; layout();
  }

  function layout() {
    const cards = stage.querySelectorAll('.deck .tc');
    cards.forEach((c, i) => {
      const k = i - idx;
      c.classList.toggle('current', k === 0);
      c.classList.toggle('flipped', revealed.has(i));
      c.classList.toggle('past', k < 0);
      c.style.zIndex = String(100 - Math.abs(k));
      c.style.setProperty('--k', String(Math.max(k, 0)));
      c.setAttribute('aria-hidden', k === 0 ? 'false' : 'true');
    });
    stage.querySelector('.deck-count').textContent = `${idx + 1} / ${pull.length}`;
    stage.querySelector('[data-prev]').disabled = idx === 0;
    stage.querySelectorAll('[data-go]').forEach((b, i) => {
      b.classList.toggle('on', i === idx);
      b.classList.toggle('seen', revealed.has(i));
      b.disabled = !revealed.has(i) && i !== idx;
    });
    const last = idx === pull.length - 1 && revealed.has(idx);
    stage.querySelector('[data-next]').setAttribute('aria-label', last ? 'See your whole pull' : 'Next card');
    const c = pull[idx];
    setStatus(revealed.has(idx) ? `${c.legend ? '★ ' : ''}${esc(c.name)}${c.holo ? ' · <b>Holo!</b>' : ''}` : 'Dugout Series 1');
  }

  function showSummary() {
    unmountAll(stage);
    const col = store.get('dugout-collection', []);
    const legends = pull.filter((c) => c.legend).length, holos = pull.filter((c) => c.holo).length;
    setStatus(`Your pull · <b>${col.length}/${SET.length}</b> collected`);
    stage.innerHTML = `
      <div class="summary">
        <p class="summary-line">${legends} legend${legends === 1 ? '' : 's'} · ${holos} holo${holos === 1 ? '' : 's'}${col.length === SET.length ? ' · You’ve completed the set! 🏆' : ''}</p>
        <div class="summary-grid">${pull.map((c, i) => `<button type="button" class="mini" data-i="${i}" aria-label="View ${esc(c.name)}">${cardHTML(c, i)}</button>`).join('')}</div>
        <div class="summary-cta">
          <button type="button" class="btn solid" data-again>Rip another pack</button>
          <button type="button" class="btn" data-close2>Done</button>
        </div>
      </div>`;
    stage.querySelectorAll('.mini .tc').forEach((t) => t.classList.add('flipped'));
    mountAll(stage);
    stage.querySelectorAll('.mini').forEach((m) => m.addEventListener('click', () => {
      const i = +m.dataset.i; showDeckAt(i);
    }));
    stage.querySelector('[data-again]').addEventListener('click', showPack);
    stage.querySelector('[data-close2]').addEventListener('click', close);
    stage.querySelector('[data-again]').focus({ preventScroll: true });
  }

  function showDeckAt(i) {
    const keep = pull;
    showDeck();
    pull = keep;
    pull.forEach((_, n) => revealed.add(n));
    idx = i; layout();
  }
})();
