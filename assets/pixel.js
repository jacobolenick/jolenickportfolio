/*
  Tiny pixel animation engine.
  Usage: <canvas data-pix="name" data-scale="3"></canvas>
  data-scale="fluid" lets CSS size the canvas (keeps aspect ratio).
  Each animation draws on a w×h grid; CSS scales it up with crisp pixels.
  Colors are tokens read from CSS custom properties (--px-*), so dark mode just works.
*/
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const KEYS = ['i', 'm', 'l', 'a', 'o', 'y', 'g', 'p', 'd', 'r'];
  const C = {};
  const readColors = () => {
    const cs = getComputedStyle(document.documentElement);
    KEYS.forEach((k) => (C[k] = cs.getPropertyValue('--px-' + k).trim() || '#000'));
  };

  // ---------- drawing API, built on a single set(x, y, colorKey|null) ----------
  function api(w, h, set) {
    let clip = null;
    const g = {
      w, h,
      px(x, y, c) {
        x = Math.round(x); y = Math.round(y);
        if (x < 0 || y < 0 || x >= w || y >= h) return;
        if (clip && (x < clip[0] || y < clip[1] || x >= clip[2] || y >= clip[3])) return;
        set(x, y, c);
      },
      clip(x, y, cw, ch) { clip = [x, y, x + cw, y + ch]; },
      unclip() { clip = null; },
      rect(x, y, rw, rh, c) { for (let j = 0; j < rh; j++) for (let i = 0; i < rw; i++) g.px(x + i, y + j, c); },
      frame(x, y, rw, rh, c) {
        for (let i = 0; i < rw; i++) { g.px(x + i, y, c); g.px(x + i, y + rh - 1, c); }
        for (let j = 1; j < rh - 1; j++) { g.px(x, y + j, c); g.px(x + rw - 1, y + j, c); }
      },
      rrect(x, y, rw, rh, c) {
        g.rect(x, y, rw, rh, c);
        [[x, y], [x + rw - 1, y], [x, y + rh - 1], [x + rw - 1, y + rh - 1]].forEach(([a, b]) => g.px(a, b, null));
      },
      rframe(x, y, rw, rh, c) {
        for (let i = 1; i < rw - 1; i++) { g.px(x + i, y, c); g.px(x + i, y + rh - 1, c); }
        for (let j = 1; j < rh - 1; j++) { g.px(x, y + j, c); g.px(x + rw - 1, y + j, c); }
      },
      line(x0, y0, x1, y1, c) {
        x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
        const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
        let e = dx + dy;
        for (;;) {
          g.px(x0, y0, c);
          if (x0 === x1 && y0 === y1) break;
          const e2 = 2 * e;
          if (e2 >= dy) { e += dy; x0 += sx; }
          if (e2 <= dx) { e += dx; y0 += sy; }
        }
      },
      circle(cx, cy, r, c, fill) {
        for (let y = -r - 1; y <= r + 1; y++) for (let x = -r - 1; x <= r + 1; x++) {
          const d = Math.sqrt(x * x + y * y);
          if (fill ? d <= r + 0.2 : d <= r + 0.2 && d > r - 0.8) g.px(cx + x, cy + y, c);
        }
      },
      digit(n, x, y, c) {
        const rows = DIGITS[n % 10];
        for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) if (rows[j][i] === '1') g.px(x + i, y + j, c);
      },
      sprite(rows, x, y, map = {}, flip = false) {
        rows.forEach((row, j) => {
          for (let i = 0; i < row.length; i++) {
            const ch = row[flip ? row.length - 1 - i : i];
            if (ch === '.') continue;
            g.px(x + i, y + j, map[ch] || ch);
          }
        });
      },
    };
    return g;
  }

  const DIGITS = [
    ['111', '101', '101', '101', '111'], ['010', '110', '010', '010', '111'],
    ['111', '001', '111', '100', '111'], ['111', '001', '111', '001', '111'],
    ['101', '101', '111', '001', '001'], ['111', '100', '111', '001', '111'],
    ['111', '100', '111', '101', '111'], ['111', '001', '001', '001', '001'],
    ['111', '101', '111', '101', '111'], ['111', '101', '111', '001', '111'],
  ];

  // seeded random so animations are stable between frames
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const shuffle = (arr, r) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
  const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // record a drawing into a list of points (used by the hero morph)
  function record(w, h, fn) {
    const m = new Map();
    fn(api(w, h, (x, y, c) => (c ? m.set(x + ',' + y, c) : m.delete(x + ',' + y))));
    return [...m].map(([k, c]) => { const [x, y] = k.split(',').map(Number); return { x, y, c }; });
  }

  // ---------- sprites ----------
  const CURSOR = ['i....', 'ii...', 'ipi..', 'ippi.', 'ipppi', 'ipii.', 'ii.i.', '...i.'];
  const DOG_A = ['...........dd.', '..........dddd', '.d........ddid', 'dd.ddddddddddi', '.ddddddddddd..', '.ddddddddddd..', '.d.d.....d.d..', '.d.d.....d.d..'];
  const DOG_B = ['...........dd.', '..........dddd', '.d........ddid', 'dd.ddddddddddi', '.ddddddddddd..', '.ddddddddddd..', '..d.d...d.d...', '.d...d.d...d..'];
  const DOG_SIT = ['...........dd.', '..........dddd', '..........ddid', '.......ddddddi', '.d....ddddd...', 'dd...dddddd...', '.dddddddddd...', '..dd.dd.d.d...'];
  const CAT = ['i...i...', 'ii.ii...', 'iiiii...', 'iyiyi...', 'ipppi...', '.ipi...i', '.ipii..i', '.iiiiiii', '.ipip...'];
  const CAT_BLINK = ['i...i...', 'ii.ii...', 'iiiii...', 'iiiii...', 'ipppi...', '.ipi...i', '.ipii..i', '.iiiiiii', '.ipip...'];
  const CAR = ['..aaa..', '.aaaaa.', 'iaiiiai', '.aaaaa.', '.aaaaa.', '.aiiia.', 'iaaaaai', '.yaaay.'];
  const HEART = ['r.r', 'rrr', '.r.'];
  
  // ---------- animations ----------
  const A = {};

  // HERO: tokens → components → screen → the car
  const HW = 72, HH = 44;
  const acts = [
    (g) => { // tokens
      ['a', 'o', 'y', 'g'].forEach((c, k) => g.rrect(14 + k * 12, 8, 8, 8, c));
      g.rect(14, 22, 30, 3, 'i'); g.rect(14, 27, 22, 2, 'i'); g.rect(14, 31, 15, 1, 'm');
      [1, 2, 3, 4].forEach((s, k) => g.rect(48 + k * 2 + [0, 1, 3, 6][k], 31 - s, s, s, 'm'));
      g.rect(48, 22, 10, 1, 'm'); g.rect(48, 24, 6, 1, 'm');
    },
    (g) => { // components
      g.rrect(10, 9, 24, 9, 'a'); g.rect(15, 13, 14, 1, null);
      g.rrect(40, 9, 15, 9, 'g'); g.rect(47, 11, 6, 5, null);
      g.rframe(10, 25, 32, 9, 'm'); g.rect(13, 27, 1, 5, 'i');
      g.rrect(48, 25, 9, 9, 'a'); g.line(50, 29, 52, 31, null); g.line(52, 31, 55, 27, null);
      g.rrect(59, 9, 4, 4, 'o'); g.rrect(59, 15, 4, 3, 'y');
    },
    (g) => { // screen
      g.rframe(16, 5, 40, 32, 'i');
      g.rect(17, 9, 38, 1, 'l');
      g.rect(19, 7, 6, 1, 'i');
      g.rrect(19, 12, 16, 13, 'a');
      g.rect(38, 13, 14, 2, 'i'); g.rect(38, 17, 10, 1, 'm'); g.rect(38, 19, 12, 1, 'm');
      g.rrect(38, 22, 9, 3, 'y');
      g.rrect(19, 28, 14, 5, 'o'); g.rrect(45, 28, 8, 5, 'g'); g.rect(49, 29, 3, 3, null);
    },
    (g) => { // car dashboard
      g.rframe(17, 3, 46, 24, 'i');
      g.rrect(20, 6, 16, 12, 'g'); g.line(21, 15, 34, 8, 'p'); g.px(27, 11, 'o'); g.px(28, 11, 'o'); g.px(27, 12, 'o'); g.px(28, 12, 'o');
      g.rrect(39, 6, 21, 7, 'a'); g.rect(42, 9, 8, 1, 'p');
      g.rect(39, 15, 14, 1, 'i'); g.rect(39, 17, 9, 1, 'm');
      g.rrect(52, 19, 8, 4, 'o');
      [21, 26, 31, 36].forEach((x) => g.rrect(x, 21, 3, 3, 'm'));
      g.line(0, 31, 13, 29, 'm'); g.line(13, 29, 66, 29, 'm'); g.line(66, 29, 71, 31, 'm');
      g.circle(14, 43, 10, 'i'); g.circle(14, 43, 9, 'i'); g.rrect(10, 39, 9, 5, 'i');
      g.circle(58, 38, 4, 'm'); g.line(58, 38, 61, 36, 'o');
    },
  ];
  A.hero = {
    w: HW, h: HH, fps: 24, still: 3 * 98 + 40,
    draw(g, t, s) {
      if (!s.acts) {
        s.acts = acts.map((f) => record(HW, HH, f));
        const r = rng(7);
        s.scatter = s.acts[0].map((p) => ({ x: Math.floor(r() * HW), y: Math.floor(r() * HH), c: p.c }));
        s.act = -1;
      }
      const TR = 28, HOLD = 70, PER = TR + HOLD;
      const act = Math.floor(t / PER) % 4, local = t % PER;
      if (act !== s.act) {
        const from = s.act === -1 ? s.scatter : s.acts[s.act];
        s.parts = pair(from, s.acts[act], rng(11 + act));
        s.act = act;
        document.querySelectorAll('[data-hero-step]').forEach((el) => el.classList.toggle('on', +el.dataset.heroStep === act));
      }
      if (local >= TR) {
        s.acts[act].forEach((p) => g.px(p.x, p.y, p.c));
        // small signs of life while holding
        const k = local - TR;
        if (act === 1 && Math.floor(k / 8) % 2) g.rect(13, 27, 1, 5, null);
        if (act === 2 && Math.floor(k / 10) % 2) g.rect(38, 22, 9, 3, 'g');
        if (act === 3) { const x = 21 + ((k >> 3) % 4) * 5; g.rrect(x, 21, 3, 3, 'a'); g.line(58, 38, 58 + Math.round(Math.cos(-0.6 - k / 20) * 3), 38 + Math.round(Math.sin(-0.6 - k / 20) * 3), 'o'); }
        return;
      }
      for (const p of s.parts) {
        const q = clamp((local - p.d) / 14, 0, 1);
        if (p.out && q >= 1) continue;
        if (p.in && q <= 0) continue;
        const e = ease(q);
        g.px(p.x0 + (p.x1 - p.x0) * e, p.y0 + (p.y1 - p.y0) * e, q < 0.5 ? p.c0 : p.c1);
      }
    },
  };
  function pair(from, to, r) {
    const parts = [];
    const byColor = (list) => list.reduce((m, p) => ((m[p.c] = m[p.c] || []).push(p), m), {});
    const fa = byColor(from), tb = byColor(to);
    const leftA = [], leftB = [];
    const sortFn = (a, b) => a.y * HW + a.x - (b.y * HW + b.x);
    new Set([...Object.keys(fa), ...Object.keys(tb)]).forEach((c) => {
      const a = (fa[c] || []).slice().sort(sortFn), b = (tb[c] || []).slice().sort(sortFn);
      const n = Math.min(a.length, b.length);
      for (let i = 0; i < n; i++) parts.push(mk(a[i], b[i]));
      leftA.push(...a.slice(n)); leftB.push(...b.slice(n));
    });
    shuffle(leftA, r); shuffle(leftB, r);
    const n = Math.min(leftA.length, leftB.length);
    for (let i = 0; i < n; i++) parts.push(mk(leftA[i], leftB[i]));
    leftA.slice(n).forEach((p) => parts.push({ ...mk(p, p), out: true }));
    leftB.slice(n).forEach((p) => parts.push({ ...mk(p, p), in: true }));
    function mk(a, b) { return { x0: a.x, y0: a.y, x1: b.x, y1: b.y, c0: a.c, c1: b.c, d: Math.floor(r() * 8 + (b.x / HW) * 6) }; }
    return parts;
  }

  // ---- "what I do" ----
  A.tokens = {
    w: 32, h: 20, fps: 10, still: 20,
    draw(g, t) {
      const ph = t % 64;
      const wipe = ph < 10 ? ph * 3.4 : ph < 32 ? 32 : ph < 42 ? 32 - (ph - 32) * 3.4 : 0;
      const scene = (dark) => {
        if (dark) g.rrect(0, 0, 32, 20, 'i');
        else g.rframe(0, 0, 32, 20, 'l');
        ['a', 'o', 'y', 'g'].forEach((c, k) => { g.rrect(3 + k * 7, 3, 5, 5, c); g.rect(3 + k * 7, 10, 4, 1, dark ? 'm' : 'm'); });
        g.rect(3, 14, 12, 1, dark ? 'p' : 'i'); g.rect(3, 16, 8, 1, 'm');
        g.rrect(22, 13, 7, 4, dark ? 'a' : 'l'); g.rect(dark ? 26 : 23, 14, 2, 2, dark ? 'p' : 'i');
      };
      scene(false);
      if (wipe > 0) { g.clip(0, 0, Math.round(wipe), 20); g.rect(0, 0, 32, 20, null); scene(true); g.unclip(); }
    },
  };
  A.components = {
    w: 32, h: 20, fps: 12, still: 25,
    draw(g, t, s) {
      const ph = t % 44, cyc = Math.floor(t / 44);
      const color = ['a', 'o', 'g'][cyc % 3];
      const big = cyc % 2;
      const pressed = ph >= 16 && ph < 21;
      const bw = big ? 18 : 14, bh = big ? 7 : 6;
      const bx = 16 - bw / 2, by = 7 + (pressed ? 1 : 0);
      g.rrect(bx, by, bw, bh, pressed ? 'i' : color);
      g.rect(bx + 4, by + Math.floor(bh / 2), bw - 8, 1, null);
      // variant dots
      [0, 1, 2].forEach((k) => g.rect(12 + k * 3, 17, 2, 1, k === cyc % 3 ? 'i' : 'l'));
      // cursor
      let cx, cy;
      if (ph < 16) { const e = ease(ph / 16); cx = 28 + (19 - 28) * e; cy = 18 + (10 - 18) * e; }
      else if (ph < 32) { cx = 19; cy = 10; }
      else { const e = ease((ph - 32) / 12); cx = 19 + (28 - 19) * e; cy = 10 + (18 - 10) * e; }
      g.sprite(CURSOR, Math.round(cx), Math.round(cy));
      if (pressed) { g.px(cx - 2, cy - 1, 'o'); g.px(cx + 1, cy - 3, 'o'); g.px(cx - 1, cy - 3, 'o'); }
    },
  };
  A.code = {
    w: 32, h: 20, fps: 10, still: 30,
    draw(g, t) {
      g.rrect(1, 7, 10, 6, 'a'); g.rect(4, 10, 4, 1, null);
      for (let k = 0; k < 3; k++) g.px(12 + ((t + k * 3) % 8), 10, k === 0 ? 'a' : 'm');
      g.line(24, 6, 21, 9, 'i'); g.line(21, 9, 24, 12, 'i');
      g.line(25, 12, 27, 6, 'i');
      g.line(28, 6, 31, 9, 'i'); g.line(31, 9, 28, 12, 'i');
      const ph = t % 48;
      g.rect(21, 15, clamp(Math.floor(ph / 2), 0, 10), 1, 'm');
      g.rect(21, 17, clamp(Math.floor((ph - 20) / 2), 0, 7), 1, 'a');
      if (ph > 34 && (t >> 2) % 2) g.px(28, 17, 'i');
      g.rect(1, 2, 6, 1, 'l'); g.rect(1, 16, 8, 1, 'l');
    },
  };
  A.ship = {
    w: 32, h: 20, fps: 10, still: 40,
    draw(g, t) {
      const ph = t % 56;
      g.rrect(14, 0, 4, 4, 'a');
      // phone, tv, car display
      g.rframe(1, 7, 7, 12, 'i'); g.px(4, 17, 'm');
      g.rframe(10, 8, 12, 8, 'i'); g.rect(15, 16, 2, 1, 'i'); g.rect(13, 17, 6, 1, 'i');
      g.rframe(24, 10, 8, 6, 'i'); g.line(23, 17, 31, 17, 'm'); g.line(22, 18, 23, 17, 'm');
      const targets = [[4, 12], [16, 11], [28, 12]];
      targets.forEach(([x, y], k) => {
        const start = 4 + k * 10;
        const q = clamp((ph - start) / 8, 0, 1);
        if (q > 0 && q < 1) g.px(16 + (x - 16) * q, 3 + (y - 3) * q, 'a');
        if (q >= 1) g.rect(x - 1, y - 1, 2 + (k ? 1 : 0), 2, 'a');
      });
    },
  };

  // ---- project icons (20×15) ----
  A.tv = {
    w: 20, h: 15, fps: 8,
    draw(g, t) {
      g.rframe(1, 0, 18, 12, 'i'); g.rect(8, 12, 4, 1, 'i'); g.rect(5, 13, 10, 1, 'i');
      g.rect(3, 2, 14, 3, 'a'); g.rect(4, 3, 4, 1, 'p');
      g.clip(3, 6, 14, 4);
      const off = t % 5, base = Math.floor(t / 5);
      for (let k = -1; k < 5; k++) g.rect(3 + k * 5 - off, 6, 4, 4, ['o', 'y', 'g', 'm'][((k + base) % 4 + 4) % 4]);
      g.unclip();
    },
  };
  A.scoreboard = {
    w: 20, h: 15, fps: 8,
    draw(g, t) {
      g.rframe(0, 0, 20, 12, 'i');
      g.digit(Math.floor(t / 20) % 10, 4, 2, 'a'); g.digit(Math.floor(t / 31) % 10, 13, 2, 'o');
      if ((t >> 2) % 2) { g.px(9, 3, 'm'); g.px(10, 3, 'm'); g.px(9, 5, 'm'); g.px(10, 5, 'm'); }
      for (let x = 2; x < 18; x++) if ((x + t) % 4 === 0) g.px(x, 9, 'm');
      g.rect(3, 12, 1, 3, 'i'); g.rect(16, 12, 1, 3, 'i');
    },
  };
  A.card = {
    w: 20, h: 15, fps: 10,
    draw(g, t) {
      g.rrect(1, 2, 18, 11, 'a'); g.rect(3, 5, 4, 3, 'y'); g.px(5, 6, 'o');
      [3, 7, 11].forEach((x) => g.rect(x, 10, 3, 1, 'p'));
      const pos = (t % 36) - 6;
      g.clip(1, 2, 18, 11);
      for (let y = 2; y < 13; y++) { const x = pos + Math.floor((12 - y) / 2); g.px(x, y, 'p'); g.px(x + 1, y, 'p'); }
      g.unclip();
      g.rrect(1, 2, 1, 1, null);
    },
  };
  A.org = {
    w: 20, h: 15, fps: 10,
    draw(g, t) {
      const k = t % 30;
      g.rect(9, 3, 1, 4, 'm'); g.rect(2, 6, 15, 1, 'm');
      [2, 9, 16].forEach((x) => g.rect(x, 7, 1, 3, 'm'));
      g.rrect(7, 0, 5, 3, 'a');
      if (k < 4) g.px(9, 3 + k, 'a');
      else if (k < 12) { const d = k - 4; g.px(9 - d, 6, 'a'); g.px(9 + d, 6, 'a'); }
      else if (k < 15) [2, 9, 16].forEach((x) => g.px(x, 7 + (k - 12), 'a'));
      [0, 7, 14].forEach((x) => g.rrect(x, 10, 5, 4, k >= 15 && k < 27 ? 'a' : 'i'));
    },
  };
  A.athlete = { // vertical highlight feed on a phone, with a verified badge
    w: 20, h: 15, fps: 8,
    draw(g, t) {
      g.rframe(5, 0, 10, 15, 'i');
      g.clip(6, 1, 8, 13);
      const off = t % 7, base = Math.floor(t / 7);
      for (let k = -1; k < 3; k++) {
        const y = 1 + k * 7 - off, c = ['a', 'o', 'g'][((k + base) % 3 + 3) % 3];
        g.rect(7, y + 1, 6, 5, c);
        g.px(9, y + 2, 'p'); g.px(9, y + 3, 'p'); g.px(9, y + 4, 'p'); g.px(10, y + 3, 'p');
      }
      g.unclip();
      if ((t % 24) > 6) { g.px(17, 3, 'y'); g.px(16, 4, 'y'); g.px(17, 4, 'y'); g.px(18, 4, 'y'); g.px(17, 5, 'y'); }
      if ((t % 24) > 12) g.sprite(HEART, 1, 9 - ((t % 24) > 18 ? 1 : 0));
    },
  };
  A.generate = {
    w: 20, h: 15, fps: 12,
    draw(g, t, s) {
      if (!s.order) {
        s.img = record(20, 15, (r) => {
          r.rect(2, 1, 16, 13, 'l');
          r.circle(14, 4, 2, 'y', true);
          for (let x = 2; x < 18; x++) {
            const h1 = 8 - Math.abs(x - 7) * 0.9, h2 = 6 - Math.abs(x - 13) * 0.8;
            for (let y = 13; y > 13 - Math.max(h1, 0); y--) r.px(x, y, 'g');
            for (let y = 13; y > 13 - Math.max(h2, 0); y--) r.px(x, y, 'a');
          }
        });
        s.order = shuffle(s.img.slice(), rng(3));
      }
      g.frame(1, 0, 18, 15, 'i');
      const ph = t % 64, n = Math.min(s.order.length, ph * 7);
      for (let i = 0; i < n; i++) g.px(s.order[i].x, s.order[i].y, s.order[i].c);
      if (n < s.order.length && (t >> 1) % 2) g.px(s.order[n].x, s.order[n].y, 'i');
    },
  };
  A.seats = {
    w: 20, h: 15, fps: 8,
    draw(g, t, s) {
      if (!s.order) s.order = shuffle([...Array(24).keys()], rng(5));
      g.rect(5, 0, 10, 2, 'i');
      const sold = Math.floor((t % 56) / 2);
      for (let i = 0; i < 24; i++) {
        const row = Math.floor(i / 6), col = i % 6;
        const x = 1 + col * 3 + (row % 2 ? 1 : 0), y = 4 + row * 3 - (col === 0 || col === 5 ? 1 : 0);
        const isSold = s.order.indexOf(i) < sold;
        g.rect(x, y, 2, 2, i === 14 && (t >> 2) % 2 ? 'o' : isSold ? 'a' : 'l');
      }
    },
  };
  A.cart = {
    w: 20, h: 15, fps: 8,
    draw(g, t) {
      const x = 4, y = 3 + ((t >> 1) % 2);
      const ph = t % 40;
      if (ph > 6) g.rect(x + 4, y + 1, 2, 2, 'o');
      if (ph > 14) g.rect(x + 7, y + 1, 2, 2, 'g');
      if (ph > 22) g.rect(x + 5, y - 1, 3, 2, 'y');
      g.px(x - 2, y - 1, 'i'); g.px(x - 1, y - 1, 'i');
      g.line(x, y - 1, x + 2, y + 5, 'i');
      g.rect(x + 1, y + 3, 11, 1, 'i'); g.line(x + 12, y + 3, x + 11, y + 6, 'i');
      g.rect(x + 2, y + 6, 10, 1, 'i');
      const w = t % 2;
      g.rect(x + 3, y + 8, 2, 1, 'i'); g.rect(x + 9, y + 8, 2, 1, 'i');
      g.px(x + 3 + w, y + 9, 'i'); g.px(x + 9 + w, y + 9, 'i');
      for (let k = 0; k < 3; k++) g.px(17 - ((t + k * 5) % 16), 14, 'l');
    },
  };
  A.coffee = {
    w: 20, h: 15, fps: 8,
    draw(g, t) {
      g.rect(5, 7, 9, 6, 'i'); g.rect(6, 7, 7, 1, 'd');
      g.px(14, 8, 'i'); g.px(15, 8, 'i'); g.px(15, 9, 'i'); g.px(15, 10, 'i'); g.px(14, 10, 'i');
      g.rect(3, 13, 13, 1, 'm');
      [7, 9, 11].forEach((x, c) => {
        for (let y = 1; y < 6; y++) {
          if ((y + t + c) % 3 === 0) continue;
          g.px(x + Math.round(Math.sin((y + t * 0.6 + c * 2) * 0.9)), y, 'l');
        }
      });
    },
  };
  A.chart = {
    w: 20, h: 15, fps: 10,
    draw(g, t) {
      g.rect(1, 1, 1, 13, 'm'); g.rect(1, 13, 18, 1, 'm');
      const H = [4, 6, 5, 9, 11], ph = t % 48;
      H.forEach((h, k) => {
        const q = clamp((ph - k * 3) / 10, 0, 1);
        const hh = Math.round(h * ease(q));
        g.rect(3 + k * 3, 13 - hh, 2, hh, k === 4 ? 'o' : 'a');
      });
    },
  };

  // ---- plugin icons (12×12) ----
  A['p-color'] = { w: 12, h: 12, fps: 6, draw(g, t) { const c = ['a', 'o', 'y', 'g']; [[1, 1], [6, 1], [1, 6], [6, 6]].forEach(([x, y], k) => g.rrect(x, y, 5, 5, c[(k + Math.floor(t / 4)) % 4])); } };
  A['p-type'] = { w: 12, h: 12, fps: 10, draw(g, t) { [[2, 3, 10], [6, 2, 7], [9, 1, 5]].forEach(([y, h, w], k) => g.rect(1, y, clamp(Math.floor((t % 30) / 1.5) - k * 4, 0, w), h, k === 2 ? 'm' : 'i')); } };
  A['p-shadow'] = { w: 12, h: 12, fps: 6, draw(g, t) { const d = 1 + (Math.floor(t / 4) % 3); g.rect(2 + d, 2 + d, 6, 6, 'l'); g.rect(2, 2, 6, 6, 'a'); } };
  A['p-token'] = { w: 12, h: 12, fps: 6, draw(g, t) { g.rrect(1, 3, 10, 6, 'i'); g.px(3, 5, 'p'); g.px(3, 6, 'p'); g.rect(5, 5, (t % 8) < 4 ? 4 : 2, 1, 'y'); g.rect(5, 7, 3, 1, 'm'); } };
  A['p-pages'] = { w: 12, h: 12, fps: 5, draw(g, t) { const n = 1 + (t % 5); for (let k = 0; k < Math.min(n, 4); k++) { g.rect(1 + k, 1 + k, 7, 8, null); g.frame(1 + k, 1 + k, 7, 8, k === Math.min(n, 4) - 1 ? 'a' : 'i'); } } };
  A['p-check'] = { w: 12, h: 12, fps: 5, draw(g, t) { const n = t % 5; [1, 5, 9].forEach((y, k) => { if (k < n) g.rect(1, y, 3, 2, 'g'); else g.rect(1, y, 3, 2, 'l'); g.rect(6, y, 5, 1, k < n ? 'm' : 'i'); }); } };
  A['p-timer'] = { w: 12, h: 12, fps: 8, draw(g, t) { g.circle(6, 6, 5, 'i'); const a = t * 0.3 - Math.PI / 2; g.line(6, 6, 6 + Math.cos(a) * 3.4, 6 + Math.sin(a) * 3.4, 'a'); g.px(6, 0, 'o'); } };
  A['p-vote'] = { w: 12, h: 12, fps: 8, draw(g, t) { const ph = t % 16, b = ph < 3 ? -1 : 0; g.px(3, 2 + b, 'a'); g.rect(2, 3 + b, 3, 1, 'a'); g.rect(1, 4 + b, 5, 1, 'a'); g.rect(2, 5 + b, 3, 4, 'a'); g.digit(Math.floor(t / 16) % 10, 8, 3, 'i'); } };

  // ---- baseball: pixel caps + jerseys (colors come from data-* attributes) ----
  const LETTERS = {
    A: ['010', '101', '111', '101', '101'], L: ['100', '100', '100', '100', '111'], V: ['101', '101', '101', '101', '010'],
    U: ['101', '101', '101', '101', '111'], S: ['111', '100', '111', '001', '111'], H: ['101', '101', '111', '101', '101'],
    T: ['111', '010', '010', '010', '010'],
  };
  const glyph = (g, rows, x, y, c) => rows.forEach((r, j) => [...r].forEach((b, i) => b === '1' && g.px(x + i, y + j, c)));
  // draw a filled shape with a 1px outline so light/dark colors read on either background
  function shape(g, inside, fill, dy = 0) {
    for (let y = -1; y <= g.h; y++) for (let x = -1; x <= g.w; x++) {
      if (inside(x, y)) { const c = fill(x, y); if (c) g.px(x, y + dy, c); }
      else if (inside(x + 1, y) || inside(x - 1, y) || inside(x, y + 1) || inside(x, y - 1)) g.px(x, y + dy, 'm');
    }
  }
  A.cap = {
    w: 20, h: 15, fps: 8, still: 0,
    draw(g, t, s) {
      const d = s.el.dataset, off = (+d.i || 0) * 9;
      const k = (t + off) % 40, lift = k < 3 ? k : k < 8 ? 3 : k < 11 ? 11 - k : 0; // hat tip
      const crown = (x, y) => y <= 10 && y >= 2 && ((x - 11) / 6.6) ** 2 + ((y - 10.4) / 7.6) ** 2 <= 1;
      const brim = (x, y) => y >= 10 && y <= 11 && x >= 1 && x <= 10;
      shape(g, (x, y) => crown(x, y) || brim(x, y), (x, y) => {
        if (brim(x, y) && !crown(x, y)) return d.brim;
        if (y === 10) return d.brim;
        if (d.stripe && x % 3 === 0) return d.c2;
        return d.c1;
      }, -lift);
      g.px(11, 2 - lift, d.c2);
      const L = (d.letters || '').split('');
      const x0 = L.length === 1 ? 10 : 8;
      L.forEach((ch, n) => glyph(g, LETTERS[ch] || LETTERS.A, x0 + n * 4, 4 - lift, d.c2));
      // shadow on the ground
      g.rect(4, 14, 13 - lift * 2, 1, 'l');
    },
  };
  A.jersey = {
    w: 18, h: 17, fps: 6, still: 0,
    draw(g, t, s) {
      const d = s.el.dataset, off = (+d.i || 0) * 5;
      const wave = ((t + off) % 24) < 3 ? 1 : 0; // sleeves flutter
      const body = (x, y) => x >= 5 && x <= 12 && y >= 2 && y <= 15;
      const sleeve = (x, y) => (y >= 3 - wave && y <= 6 - wave && (x >= 2 && x <= 4 || x >= 13 && x <= 15)) || (y === 2 && (x === 4 || x === 13));
      const neck = (x, y) => (y === 2 && x >= 7 && x <= 10) || (y === 3 && x >= 8 && x <= 9);
      shape(g, (x, y) => (body(x, y) || sleeve(x, y)) && !neck(x, y), (x, y) => {
        if ((y === 2 && (x === 6 || x === 11)) || (y === 3 && (x === 7 || x === 10)) || (y === 4 && (x === 8 || x === 9))) return d.trim;
        if (sleeve(x, y) && !body(x, y) && (y === 6 - wave)) return d.trim;
        if (d.pin && (x - 5) % 3 === 2 && !(y >= 6 && y <= 12)) return d.pin;
        return d.body;
      });
      const n = String(d.num || '');
      if (n.length === 1) g.digit(+n, 7, 7, d.numc);
      else { g.digit(+n[0], 5, 7, d.numc); g.digit(+n[1], 9, 7, d.numc); }
    },
  };

  A.yt = { // pixel play button with a little "live" pulse
    w: 14, h: 10, fps: 6,
    draw(g, t) {
      g.rrect(0, 0, 14, 10, 'r');
      const big = (t % 12) < 2;
      g.rect(5, 2, 1, 6, 'p'); g.rect(6, 3, 1, 4, 'p'); g.rect(7, 3, 1, 4, 'p'); g.rect(8, 4, 1, 2, 'p');
      if (big) { g.rect(9, 4, 1, 2, 'p'); g.px(5, 1, 'p'); g.px(5, 8, 'p'); }
    },
  };

  A.baseball = { // spinning pixel baseball (fixed colors so it reads in both themes)
    w: 16, h: 16, fps: 10, still: 3,
    draw(g, t) {
      const cx = 7.5, cy = 7.5, r = 6.6;
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
        const d = Math.hypot(x - cx, y - cy);
        if (d <= r) g.px(x, y, (x - cx) + (y - cy) > 4.5 ? '#e4dfd3' : '#fbfaf6');
        else if (d <= r + 1) g.px(x, y, '#3b3a37');
      }
      const ph = t * 0.22;
      [0, Math.PI].forEach((o, n) => {
        const a = ph + o, front = Math.cos(a);
        if (front < -0.15) return;
        const base = cx + Math.sin(a) * 4.2, dir = n ? 1 : -1;
        for (let y = 2; y <= 13; y++) {
          const dy = y - cy, x = Math.round(base + dir * (dy * dy) / 14 * Math.max(front, 0.3));
          if (Math.hypot(x - cx, y - cy) > r - 0.6) continue;
          g.px(x, y, '#d8322a');
          if (y % 2 === 0) { g.px(x - 1, y, '#d8322a'); g.px(x + 1, y, '#d8322a'); }
        }
      });
    },
  };

  A.face = { // pixel player portrait: cap, face, hair, jersey — all from data-* attributes
    w: 20, h: 20, fps: 8, still: 0,
    draw(g, t, s) {
      const d = s.el.dataset, off = (+d.i || 0) * 7;
      const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = (v) => Math.max(0, Math.min(255, Math.round(v * k))); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(f).map((v) => v.toString(16).padStart(2, '0')).join(''); };
      const skin = d.skin, skinD = shade(skin, 0.86), hair = d.hair, cap = d.cap, ink = '#1b1712';
      const blink = (t + off) % 44 < 2, smile = (t + off) % 90 > 60;
      // jersey + shoulders
      for (let y = 16; y < 20; y++) for (let x = 2; x < 18; x++) {
        const edge = y === 16 && (x < 4 || x > 15);
        if (!edge) g.px(x, y, d.body);
      }
      g.rect(2, 16, 1, 4, shade(d.body, 0.85)); g.rect(17, 16, 1, 4, shade(d.body, 0.85));
      g.rect(7, 16, 6, 1, d.trim); g.px(8, 17, d.trim); g.px(11, 17, d.trim); g.rect(9, 17, 2, 1, skin); g.rect(9, 18, 2, 1, d.trim);
      // neck
      g.rect(8, 14, 4, 2, skinD);
      // long hair behind the head
      if (d.long) { g.rect(4, 7, 2, 10, hair); g.rect(14, 7, 2, 10, hair); }
      // head
      for (let y = 5; y <= 14; y++) for (let x = 5; x <= 14; x++) {
        const dx = (x - 9.5) / 5, dy = (y - 9.6) / 5.2;
        if (dx * dx + dy * dy <= 1.02) g.px(x, y, x >= 13 ? skinD : skin);
      }
      g.px(4, 9, skin); g.px(4, 10, skinD); g.px(15, 9, skinD); g.px(15, 10, skinD); // ears
      // hair at the temples
      g.px(5, 7, hair); g.px(5, 8, hair); g.px(14, 7, hair); g.px(14, 8, hair);
      // cap
      if (d.back) { // worn backwards
        for (let x = 5; x <= 14; x++) g.px(x, 6, cap);
        for (let y = 2; y <= 5; y++) for (let x = 5; x <= 14; x++) { const dx = (x - 9.5) / 5.2, dy = (y - 6) / 4.2; if (dx * dx + dy * dy <= 1) g.px(x, y, cap); }
        g.rect(8, 4, 4, 2, skin); g.rect(8, 5, 4, 1, shade(cap, 0.7)); // strap opening
      } else {
        for (let y = 1; y <= 6; y++) for (let x = 5; x <= 14; x++) { const dx = (x - 9.5) / 5.2, dy = (y - 6.4) / 5.4; if (dx * dx + dy * dy <= 1) g.px(x, y, cap); }
        g.px(9, 1, shade(cap, 0.75)); g.px(10, 1, shade(cap, 0.75));
        g.rect(4, 6, 12, 1, d.brim || shade(cap, 0.8)); g.rect(5, 7, 10, 1, shade(d.brim || cap, 0.6));
        g.rect(9, 3, 2, 2, d.logo);
      }
      // brows + eyes
      g.rect(7, 8, 2, 1, hair); g.rect(11, 8, 2, 1, hair);
      if (blink) { g.rect(7, 10, 2, 1, skinD); g.rect(11, 10, 2, 1, skinD); }
      else { g.px(7, 9, '#ffffff'); g.px(8, 9, ink); g.px(7, 10, ink); g.px(8, 10, ink); g.px(12, 9, '#ffffff'); g.px(11, 9, ink); g.px(11, 10, ink); g.px(12, 10, ink); }
      // nose
      g.px(10, 11, skinD); g.px(10, 12, skinD);
      // facial hair
      if (d.beard === 'beard') { for (let x = 5; x <= 14; x++) for (let y = 11; y <= 14; y++) { const dx = (x - 9.5) / 5, dy = (y - 9.6) / 5.2; if (dx * dx + dy * dy <= 1.02 && (y >= 13 || x <= 6 || x >= 13)) g.px(x, y, hair); } g.rect(8, 12, 4, 1, hair); }
      if (d.beard === 'goatee') { g.rect(8, 12, 4, 1, hair); g.rect(8, 14, 4, 1, hair); g.px(8, 13, hair); g.px(11, 13, hair); }
      if (d.beard === 'mustache') g.rect(8, 12, 4, 1, hair);
      // mouth
      if (smile) { g.rect(9, 13, 2, 1, '#7a2e22'); g.px(8, 12, d.beard ? hair : '#7a2e22'); g.px(11, 12, d.beard ? hair : '#7a2e22'); }
      else g.rect(9, 13, 2, 1, '#8a3a2c');
    },
  };

  // ---- misc ----
  A.mark = {
    w: 9, h: 9, fps: 3,
    draw(g, t) { g.rect(4, 1, 3, 1, 'i'); g.rect(5, 1, 1, 6, 'i'); g.rect(2, 6, 4, 1, 'i'); g.rect(1, 5, 1, 1, 'i'); if (t % 2) g.rect(7, 6, 1, 1, 'a'); },
  };
  A.pets = {
    w: 120, h: 14, fps: 8, still: 0,
    draw(g, t) {
      const L = 88, cyc = L * 2 + 40, ph = t % cyc;
      g.rect(0, 13, 120, 1, 'l');
      // cat
      g.sprite(t % 40 < 2 ? CAT_BLINK : CAT, 106, 4, { p: 'p' });
      if ((t >> 3) % 2) { g.px(113, 5, null); g.px(113, 4, 'i'); }
      let x, flip = false, frame;
      if (ph < L) { x = ph; frame = (t % 2) ? DOG_A : DOG_B; }
      else if (ph < L + 40) { x = L; frame = DOG_SIT; const k = ph - L; if (k > 6 && k < 34) g.sprite(HEART, x + 15, 1 - (k > 20 ? 1 : 0)); }
      else { x = L - (ph - L - 40); frame = (t % 2) ? DOG_A : DOG_B; flip = true; }
      g.sprite(frame, x + 2, 5, {}, flip);
    },
  };
  A.car = {
    w: 7, h: 11, fps: 8,
    draw(g, t, s) {
      g.sprite(CAR, 0, 0);
      if (s.el.dataset.moving === '1' && t % 2) { g.px(1, 9, 'y'); g.px(5, 9, 'y'); g.px(1, 10, 'y'); g.px(5, 10, 'y'); }
    },
  };

  // ---------- runtime ----------
  const items = [];
  function mount(cv) {
    const def = A[cv.dataset.pix];
    if (!def || cv._pix) return;
    cv._pix = true;
    cv.width = def.w; cv.height = def.h;
    const scale = cv.dataset.scale || '3';
    if (scale !== 'fluid') { cv.style.width = def.w * +scale + 'px'; cv.style.height = def.h * +scale + 'px'; }
    cv.setAttribute('role', 'img');
    const ctx = cv.getContext('2d');
    const g = api(def.w, def.h, (x, y, c) => {
      if (!c) ctx.clearRect(x, y, 1, 1);
      else { ctx.fillStyle = C[c] || c; ctx.fillRect(x, y, 1, 1); }
    });
    const it = { cv, def, g, ctx, s: { el: cv }, t: 0, last: 0, visible: false };
    it.render = () => { ctx.clearRect(0, 0, def.w, def.h); def.draw(g, it.t, it.s); };
    items.push(it);
    if (reduce.matches) { it.t = def.still ?? 12; it.render(); }
    else { it.render(); io.observe(cv); }
  }
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const it = items.find((i) => i.cv === e.target); if (it) it.visible = e.isIntersecting;
  }), { rootMargin: '80px' });

  function loop(now) {
    if (!document.hidden && !reduce.matches) {
      for (const it of items) {
        if (!it.visible) continue;
        const step = 1000 / (it.def.fps || 8);
        if (now - it.last >= step) { it.last = now; it.t++; it.render(); }
      }
    }
    requestAnimationFrame(loop);
  }

  function rerenderAll() { readColors(); items.forEach((it) => it.render()); }
  function unmount(cv) {
    const i = items.findIndex((it) => it.cv === cv);
    if (i > -1) { io.unobserve(cv); items.splice(i, 1); cv._pix = false; }
  }
  window.Pixel = { mount, unmount, rerenderAll, defs: A };

  readColors();
  document.querySelectorAll('canvas[data-pix]').forEach(mount);
  requestAnimationFrame(loop);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', rerenderAll);
  reduce.addEventListener('change', () => items.forEach((it) => { if (reduce.matches) { it.t = it.def.still ?? 12; } else io.observe(it.cv); it.render(); }));
})();
