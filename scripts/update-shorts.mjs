// Refreshes data/youtube-shorts.json — new Shorts + current view counts — then you rebuild.
//   node scripts/update-shorts.mjs && node build.mjs
//
// New Shorts come from the channel's public RSS feed (latest ~15 uploads); each is checked
// against youtube.com/shorts/<id> (Shorts answer 200, regular videos redirect).
//
// View counts, best source first:
//   1. YouTube Data API, if YOUTUBE_API_KEY is set (most reliable)
//   2. The RSS feed's view statistics (latest ~15 uploads)
//   3. The public video page
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'youtube-shorts.json');
const MAX = 30;
const KEY = process.env.YOUTUBE_API_KEY;
const UA = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36', 'accept-language': 'en-US,en;q=0.9' };
const data = JSON.parse(readFileSync(FILE, 'utf8'));
const unescape = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

// ---- new Shorts from RSS ----
const xml = await (await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${data.channelId}`, { headers: UA })).text();
const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
  id: (e.match(/<yt:videoId>([^<]+)/) || [])[1],
  title: unescape((e.match(/<title>([^<]*)/) || [, ''])[1]),
  views: +((e.match(/<media:statistics views="(\d+)"/) || [])[1] ?? NaN),
})).filter((e) => e.id);

const known = new Set(data.shorts.map((s) => s.id));
const fresh = [];
for (const e of entries) {
  if (known.has(e.id)) continue;
  const r = await fetch(`https://www.youtube.com/shorts/${e.id}`, { method: 'HEAD', redirect: 'manual', headers: UA });
  if (r.status === 200) fresh.push({ id: e.id, title: e.title });
}
data.shorts = [...fresh, ...data.shorts].slice(0, MAX);

// ---- view counts ----
const views = new Map();
if (KEY) {
  for (let i = 0; i < data.shorts.length; i += 50) {
    const ids = data.shorts.slice(i, i + 50).map((s) => s.id).join(',');
    const j = await (await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${KEY}`)).json();
    (j.items || []).forEach((it) => views.set(it.id, +it.statistics.viewCount));
  }
}
entries.forEach((e) => { if (!views.has(e.id) && Number.isFinite(e.views)) views.set(e.id, e.views); });
for (const s of data.shorts) {
  if (views.has(s.id)) continue;
  try {
    const html = await (await fetch(`https://www.youtube.com/watch?v=${s.id}`, { headers: UA })).text();
    const m = html.match(/"viewCount":"(\d+)"/) || html.match(/"viewCount":\{"simpleText":"([\d,]+)/);
    if (m) views.set(s.id, +m[1].replace(/,/g, ''));
  } catch {}
}

let updated = 0;
for (const s of data.shorts) if (views.has(s.id)) { s.views = views.get(s.id); updated++; }
data.updatedAt = new Date().toISOString();
writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
console.log(`Added ${fresh.length} new Shorts. View counts for ${updated}/${data.shorts.length}.`);
