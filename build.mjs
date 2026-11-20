// Builds the static site from src/content.mjs.  Run: node build.mjs
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as C from './src/content.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SHORTS = JSON.parse(readFileSync(join(ROOT, 'data', 'youtube-shorts.json'), 'utf8'));
const compact = (n) => (n < 1000 ? String(n) : n < 1e6 ? (n / 1e3).toFixed(n < 1e4 ? 1 : 0).replace(/\.0$/, '') + 'K' : (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M');
const EYE = '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 3C4.4 3 1.7 5.4.6 8c1.1 2.6 3.8 5 7.4 5s6.3-2.4 7.4-5C14.3 5.4 11.6 3 8 3zm0 8.2A3.2 3.2 0 1 1 8 4.8a3.2 3.2 0 0 1 0 6.4zM8 6.4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z"/></svg>';
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Serve images from ./images when the folder is present (the GitHub repo); otherwise use C.IMG.
const IMG_BASE = existsSync(join(ROOT, 'images')) ? '/images/' : C.IMG;
const img = (p) => IMG_BASE + p.split('/').map(encodeURIComponent).join('/');
const pix = (name, scale = 3, label = '') => `<canvas data-pix="${name}" data-scale="${scale}" aria-label="${esc(label)}"></canvas>`;
const ext = (href) => (href.startsWith('http') ? ' target="_blank" rel="noopener"' : '');
const year = Math.max(new Date().getFullYear(), 2026);

const SUN = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M7 0h2v3H7zM7 13h2v3H7zM0 7h3v2H0zM13 7h3v2h-3zM2 3.4 3.4 2l2 2L4 5.4zM10.6 12l1.4-1.4 2 2-1.4 1.4zM2 12.6l2-2L5.4 12l-2 2zM10.6 4l2-2L14 3.4l-2 2zM5 5h6v6H5z"/></svg>';

function layout({ title, description = C.site.description, path = '/', body, nav = '' }) {
  const full = title ? `${title} — ${C.site.name}` : `${C.site.name} — ${C.site.title}`;
  const navItem = (href, label, key) => `<a href="${href}"${nav === key ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${C.site.url}${path}">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${C.site.url}${path}">
<meta property="og:site_name" content="${C.site.name}">
<meta property="og:image" content="${C.site.url}/assets/og-image.png">
<meta property="og:image:width" content="2400">
<meta property="og:image:height" content="1260">
<meta property="og:image:alt" content="${esc(C.site.name)} — I design the systems behind the screens in your car.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(full)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${C.site.url}/assets/og-image.png">
<meta name="theme-color" content="#f4f3ef">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Geist+Mono&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css">
<script>try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
</head>
<body>
<header class="top">
  <div class="wrap">
    <a class="brand" href="/">${pix('mark', 2, 'Jacob Olenick logo')}<span>${C.site.name}</span></a>
    <nav class="nav mono" aria-label="Main">
      ${navItem('/#work', 'Work', 'work')}
      ${navItem('/notes/', 'Notes', 'notes')}
      ${navItem('/experience.html', 'Experience', 'experience')}
      ${navItem('/about/', 'About', 'about')}
      <button class="theme" type="button" aria-label="Toggle dark mode">${SUN}</button>
    </nav>
  </div>
</header>
<main>
${body}
</main>
${footer()}
<script src="/assets/pixel.js"></script>
<script src="/assets/site.js"></script>
<script src="/assets/packs.js"></script>
</body>
</html>
`;
}

function footer() {
  return `<footer class="foot">
  <div class="wrap">
    <p class="label"><b>Contact</b></p>
    <h2>Building a design system?<br><span class="muted">Let’s talk.</span></h2>
    <div class="links">
      ${C.site.links.map((l) => `<a class="link" href="${l.href}"${ext(l.href)}>${l.label} ↗</a>`).join('\n      ')}
    </div>
    <div class="links social">
      <span class="mono">Talking baseball</span>
      ${C.site.social.map((l) => `<a class="link" href="${l.href}" target="_blank" rel="noopener">${l.label} ↗</a>`).join('\n      ')}
    </div>
    ${pix('pets', 3, 'A pixel golden doodle walking over to a tuxedo cat')}
    <div class="fine mono"><span>© ${year} ${C.site.name}</span><span>Designed &amp; built with care — and a lot of pixels.</span></div>
  </div>
</footer>`;
}

const workRow = (p) => `<li><a href="/projects/${p.slug}/">
        ${pix(p.anim, 3, p.name)}
        <div><h3>${esc(p.name)}</h3><p>${esc(p.short)}</p></div>
        <div class="meta mono"><em>${esc(p.tags[0])}</em>${p.year} <span class="arrow">→</span></div>
      </a></li>`;

// ---------- home ----------
function home() {
  const body = `
<section class="hero">
  <div class="wrap">
    <p class="status mono"><i></i>${C.site.title} · ${C.site.company}</p>
    <h1>${esc(C.intro.lead)}</h1>
    <div class="intro">${C.intro.body.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    <div class="stage">
      ${pix('hero', 'fluid', 'Animation: color tokens assemble into components, then a screen, then a car dashboard')}
      <div class="steps mono" aria-hidden="true">
        <span data-hero-step="0">tokens</span><span data-hero-step="1">components</span><span data-hero-step="2">screens</span><span data-hero-step="3">the car</span>
      </div>
    </div>
  </div>
</section>

<section id="what">
  <div class="wrap">
    <h2 class="label"><b>01</b> What a design systems designer does</h2>
    <div class="process">
      ${C.process.map((s) => `<div class="step">
        ${pix(s.anim, 3, s.title)}
        <h3><span class="mono">${s.n}</span>${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <h2 class="label"><b>02</b> By the numbers</h2>
    <div class="numbers">
      ${C.numbers.map((n) => `<div><strong>${esc(n.value)}</strong><span>${esc(n.label)}</span></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section id="work">
  <div class="wrap">
    <h2 class="label"><b>03</b> Selected work</h2>
    <ul class="work">
      ${C.projects.map(workRow).join('\n      ')}
    </ul>
  </div>
</section>

<section id="plugins">
  <div class="wrap">
    <h2 class="label"><b>04</b> Figma plugins I’ve built</h2>
    <div class="plugins">
      ${C.plugins.map((p) => `<a href="${p.href}" target="_blank" rel="noopener">
        ${pix(p.anim, 3, p.name)}
        <div><strong>${esc(p.name)} <span class="arrow" style="display:inline">↗</span></strong><span>${esc(p.text)}</span></div>
      </a>`).join('\n      ')}
    </div>
    <p class="support">Free for the community. <a class="link" href="https://ko-fi.com/O5O31U1KMI" target="_blank" rel="noopener">Support more plugins, resources and UI kits on Ko-fi ↗</a></p>
  </div>
</section>

<section>
  <div class="wrap">
    <h2 class="label"><b>05</b> Path</h2>
    <dl class="path">
      <dt class="mono">Now</dt><dd>${C.experience[0].role}, ${C.experience[0].org}</dd>
      <dt class="mono">Before</dt><dd class="muted">${[...new Set(C.experience.slice(1).map((e) => e.org.replace(/ \(.*\)/, '')))].slice(0, 9).join(', ')}</dd>
      <dt class="mono">Toolkit</dt><dd><ul class="chips">${C.stack.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></dd>
    </dl>
    <a class="more link mono" href="/experience.html">Full experience <span class="arrow">→</span></a>
  </div>
</section>

<section>
  <div class="wrap">
    <h2 class="label"><b>06</b> Notes</h2>
    <ul class="rows">
      ${C.notes.slice(0, 4).map((n) => `<li><a href="/notes/#${n.slug}"><span class="mono">${n.date}</span><h3>${esc(n.title)}</h3><span class="mono arrow">→</span></a></li>`).join('\n      ')}
    </ul>
    <a class="more link mono" href="/notes/">All notes <span class="arrow">→</span></a>
  </div>
</section>`;
  return layout({ body, nav: 'work' });
}

// ---------- project pages ----------
function project(p, i) {
  const prev = C.projects[(i - 1 + C.projects.length) % C.projects.length];
  const next = C.projects[(i + 1) % C.projects.length];
  const figs = (images) => images && images.length
    ? `<div class="figs${images.length > 1 ? ' two' : ''}">${images.map(([src, cap]) => `<figure><img src="${img(src)}" alt="${esc(cap)}" loading="lazy"><figcaption>${esc(cap)}</figcaption></figure>`).join('')}</div>`
    : '';
  const links = [
    p.live && `<a class="btn solid" href="${p.live}" target="_blank" rel="noopener">View live site ↗</a>`,
    p.figma && `<a class="btn" href="${p.figma}" target="_blank" rel="noopener">View Figma file ↗</a>`,
  ].filter(Boolean).join('');

  const body = `
<div class="wrap">
  <header class="page-head">
    <a class="back mono" href="/#work">← All work</a>
    ${pix(p.anim, 6, p.name)}
    <h1>${esc(p.title)}</h1>
    <p class="lede">${esc(p.summary)}</p>
    <div class="facts mono">
      <span><b>Role</b>${esc(p.role)}</span>
      <span><b>Year</b>${p.year}</span>
      <span><b>Type</b>${p.tags.map(esc).join(' · ')}</span>
    </div>
    ${links ? `<div class="cta">${links}</div>` : ''}
    ${p.stats ? `<div class="stats">${p.stats.map((s) => `<div><strong>${esc(s.value)}</strong><span class="mono">${esc(s.unit)}</span><p>${esc(s.label)}</p></div>`).join('')}</div>` : ''}
    ${p.cover ? `<div class="cover"><img src="${img(p.cover)}" alt="${esc(p.title)} cover" fetchpriority="high"></div>` : ''}
    ${p.video ? `<div class="cover"><video src="${img(p.video)}" autoplay muted loop playsinline aria-label="${esc(p.title)} walkthrough"></video></div>` : ''}
  </header>

  <div class="prose">
    <div class="block"><h2>Overview</h2><div><p>${esc(p.overview)}</p></div></div>
    <div class="block"><h2>My role</h2><div><p class="role">${esc(p.role)}</p>${p.roleItems ? `<ul>${p.roleItems.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}</div></div>
    ${p.sections.map((s) => `<div class="block"><h2>${esc(s.h)}</h2><div>${s.p ? `<p>${esc(s.p)}</p>` : ''}${s.list ? `<ul>${s.list.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}</div>${figs(s.images)}</div>`).join('\n    ')}
    <div class="block"><h2>Tools</h2><div><ul class="chips">${p.tools.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div></div>
  </div>

  <nav class="pager" aria-label="More projects">
    <a href="/projects/${prev.slug}/"><span class="mono">← Previous</span>${esc(prev.name)}</a>
    <a href="/projects/${next.slug}/"><span class="mono">Next →</span>${esc(next.name)}</a>
  </nav>
</div>`;
  return layout({ title: p.name, description: p.summary, path: `/projects/${p.slug}/`, body, nav: 'work' });
}

// ---------- notes ----------
function notesPage() {
  const body = `
<div class="wrap">
  <header class="page-head">
    <a class="back mono" href="/">← Home</a>
    <h1>Notes</h1>
    <p class="lede">Thoughts and learnings on design systems, product design, and building with AI.</p>
  </header>
  <div class="prose">
    ${C.notes.map((n) => `<article class="note" id="${n.slug}">
      <time class="mono">${n.date}</time>
      <div><h2>${esc(n.title)}</h2>${n.body.map((b) => `<p>${esc(b)}</p>`).join('')}${n.link ? `<a class="link mono" href="${n.link.href}"${ext(n.link.href)}>${esc(n.link.label)} →</a>` : ''}</div>
    </article>`).join('\n    ')}
  </div>
</div>`;
  return layout({ title: 'Notes', description: 'Notes on design systems, product design, and building with AI by Jacob Olenick.', path: '/notes/', body, nav: 'notes' });
}

const redirect = (to) => `<!doctype html><meta charset="utf-8"><title>Redirecting…</title><meta http-equiv="refresh" content="0; url=${to}"><link rel="canonical" href="${to}"><a href="${to}">Continue</a>`;

// ---------- experience ----------
function experiencePage() {
  const body = `
<div class="wrap">
  <header class="page-head">
    <a class="back mono" href="/">← Home</a>
    <h1>Experience</h1>
    <p class="lede">Eight years of product design, most of it spent building the systems underneath — from startups to some of the biggest brands in the world.</p>
  </header>
  <div class="prose">
    <div class="timeline">
      <div class="road" aria-hidden="true">${pix('car', 3)}</div>
      ${C.experience.map((e) => `<div class="job${e.now ? ' now' : ''}">
        <span class="mono">${e.years}</span>
        <h2>${esc(e.role)}</h2>
        <p class="org">${esc(e.org)}</p>
        <p>${esc(e.text)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</div>`;
  return layout({ title: 'Experience', description: 'Jacob Olenick’s experience: General Motors, Eli Lilly, CVS Health, Adobe, Credit One Bank, Cisco, Wells Fargo, Paramount+, AXS and more.', path: '/experience.html', body, nav: 'experience' });
}

// ---------- about ----------
function aboutPage() {
  const body = `
<div class="wrap">
  <header class="page-head">
    <a class="back mono" href="/">← Home</a>
    <h1>About</h1>
  </header>
  <div class="prose">
    <div class="about-grid">
      <img src="${img(C.about.photo)}" alt="Portrait of Jacob Olenick">
      <div>${C.about.body.map((b) => `<p>${esc(b)}</p>`).join('')}
        <div class="cta">${C.site.links.map((l) => `<a class="btn" href="${l.href}" target="_blank" rel="noopener">${l.label} ↗</a>`).join('')}</div>
      </div>
    </div>
  </div>

  <section class="fan">
    <h2 class="label"><b>⚾</b> My favorite teams</h2>
    <div class="fan-grid">
      ${C.about.teams.map((t, i) => `<div>
        <canvas data-pix="cap" data-scale="4" data-i="${i}" data-letters="${t.letters}" data-c1="${t.c1}" data-c2="${t.c2}" data-brim="${t.brim}"${t.stripe ? ' data-stripe="1"' : ''} aria-label="Pixel cap for the ${esc(t.name)}"></canvas>
        <strong>${esc(t.name)}</strong>
      </div>`).join('\n      ')}
    </div>
  </section>

  <section class="fan">
    <h2 class="label"><b>⚾</b> My favorite players</h2>
    <div class="fan-grid">
      ${C.about.players.map((p, i) => `<div>
        <canvas data-pix="jersey" data-scale="4" data-i="${i}" data-num="${p.num}" data-body="${p.body}" data-numc="${p.numc}" data-trim="${p.trim}"${p.pin ? ` data-pin="${p.pin}"` : ''} aria-label="Pixel jersey number ${p.num} for ${esc(p.name)}"></canvas>
        <strong>${esc(p.name)}</strong><span class="mono">#${p.num} · ${esc(p.team)}</span>
      </div>`).join('\n      ')}
    </div>
  </section>

  <section class="fan shorts" data-shorts>
    <div class="shorts-head">
      <h2 class="label"><b>⚾</b> My Shorts</h2>
      <div class="shorts-nav">
        <button type="button" data-dir="-1" aria-label="Previous Shorts">←</button>
        <button type="button" data-dir="1" aria-label="Next Shorts">→</button>
      </div>
    </div>
    <div class="shorts-intro">
      <p>I make baseball content around the MLB and MiLB${(() => { const v = SHORTS.shorts.filter((x) => Number.isFinite(x.views)); return v.length ? ` — <strong class="views-total">${compact(v.reduce((a, x) => a + x.views, 0))} views</strong> across ${v.length} Shorts` : ''; })()}. <a class="link" href="${SHORTS.channelUrl}" target="_blank" rel="noopener">@jacobtalks-baseball on YouTube ↗</a></p>
    </div>
    <div class="shorts-track" tabindex="0" aria-label="YouTube Shorts">
      ${SHORTS.shorts.map((v) => `<a class="short" href="https://www.youtube.com/shorts/${v.id}" target="_blank" rel="noopener" title="${esc(v.title)}">
        <img src="https://i.ytimg.com/vi/${v.id}/oar2.jpg" data-id="${v.id}" alt="${esc(v.title.replace(/\s#\S+/g, '').trim())}" loading="lazy" decoding="async">
        ${Number.isFinite(v.views) ? `<span class="short-views" aria-label="${v.views.toLocaleString('en-US')} views">${EYE}${compact(v.views)}</span>` : ''}
        <svg class="short-play" viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="20" rx="6" fill="#ff0033"/><path d="M11.5 6v8l7-4z" fill="#fff"/></svg>
        <span class="short-title">${esc(v.title.replace(/\s*#\S*/g, '').trim())}</span>
      </a>`).join('\n      ')}
    </div>
  </section>

  <section class="fan">
    <h2 class="label"><b>⚾</b> Find me talking baseball</h2>
    <ul class="rows socials">
      ${C.site.social.map((l) => `<li><a href="${l.href}" target="_blank" rel="noopener"><span class="mono">${l.label}</span><h3>${esc(l.handle)}</h3><span class="mono arrow">↗</span></a></li>`).join('\n      ')}
    </ul>
  </section>
</div>`;
  return layout({ title: 'About', description: 'About Jacob Olenick, Senior Design Systems Designer at General Motors.', path: '/about/', body, nav: 'about' });
}

function notFound() {
  const body = `<div class="wrap"><header class="page-head">${pix('generate', 6)}<h1>Page not found</h1><p class="lede">This pixel wandered off. <a class="link" href="/">Head home →</a></p></header></div>`;
  return layout({ title: 'Not found', path: '/404.html', body });
}

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 9" shape-rendering="crispEdges"><rect width="9" height="9" fill="#141414"/><path fill="#f4f3ef" d="M4 1h3v1H4zM5 2h1v5H5zM2 6h3v1H2zM1 5h1v1H1z"/><path fill="#2d5bff" d="M7 6h1v1H7z"/></svg>`;

// ---------- write ----------
const out = (rel, html) => { const f = join(ROOT, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, html); };
for (const d of ['projects', 'notes', 'about']) if (existsSync(join(ROOT, d))) rmSync(join(ROOT, d), { recursive: true });

out('index.html', home());
C.projects.forEach((p, i) => out(`projects/${p.slug}/index.html`, project(p, i)));
out('notes/index.html', notesPage());
C.notes.forEach((n) => out(`notes/${n.slug}/index.html`, redirect(`/notes/#${n.slug}`)));
out('experience.html', experiencePage());
out('about/index.html', aboutPage());
out('404.html', notFound());
// legacy URLs from the previous site → new pages
out('about.html', redirect('/about/'));
out('notes.html', redirect('/notes/'));
C.projects.forEach((p) => out(`projects/${p.slug}.html`, redirect(`/projects/${p.slug}/`)));
C.notes.forEach((n) => out(`notes/${n.slug}.html`, redirect(`/notes/#${n.slug}`)));
out('assets/favicon.svg', FAVICON);
console.log(`Built ${C.projects.length} projects, ${C.notes.length} notes.`);
