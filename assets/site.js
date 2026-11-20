// Theme toggle (follows the system until the visitor picks one)
(() => {
  const root = document.documentElement;
  const btn = document.querySelector('.theme');
  if (btn) btn.addEventListener('click', () => {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    window.Pixel && Pixel.rerenderAll();
  });
})();

// Experience page: a little car drives down the timeline as you scroll
(() => {
  const road = document.querySelector('.road');
  const car = road && road.querySelector('canvas');
  if (!car) return;
  let stopT;
  const update = () => {
    const r = road.getBoundingClientRect();
    const target = innerHeight * 0.45 - r.top;
    const max = r.height - car.offsetHeight;
    const y = Math.max(0, Math.min(max, target));
    car.style.transform = `translateY(${y}px)`;
    car.dataset.moving = '1';
    clearTimeout(stopT);
    stopT = setTimeout(() => (car.dataset.moving = '0'), 160);
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
})();

// Shorts carousel: arrow buttons page through the scroll-snap track
(() => {
  document.querySelectorAll('[data-shorts]').forEach((sec) => {
    const track = sec.querySelector('.shorts-track');
    const [prev, next] = sec.querySelectorAll('.shorts-nav button');
    const sync = () => {
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 4;
    };
    sec.querySelectorAll('.shorts-nav button').forEach((b) =>
      b.addEventListener('click', () => track.scrollBy({ left: +b.dataset.dir * track.clientWidth, behavior: 'smooth' })));
    track.addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync);
    sync();
  });
})();

// Shorts thumbnails: use the sharp vertical thumbnail, falling back if YouTube hasn't made one
(() => {
  const chain = ['oar2', 'oardefault', 'hq720', 'hqdefault'];
  document.querySelectorAll('.short img[data-id]').forEach((img) => {
    let k = 0;
    const next = () => { if (++k < chain.length) img.src = `https://i.ytimg.com/vi/${img.dataset.id}/${chain[k]}.jpg`; };
    img.addEventListener('error', next);
    img.addEventListener('load', () => { if (img.naturalWidth < 200) next(); }); // YouTube's 120×90 placeholder
    if (img.complete && img.naturalWidth && img.naturalWidth < 200) next();
  });
})();
