#!/usr/bin/env node
/**
 * Updates data/youtube-shorts.json from @jacobtalks-baseball (Shorts tab + oEmbed).
 * Run locally or via .github/workflows/update-youtube-shorts.yml.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHANNEL_ID = 'UCNdzT3Xk9gRy613TC5wP6Kw';
const SHORTS_PAGE = 'https://www.youtube.com/@jacobtalks-baseball/shorts';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const MAX_SHORTS = 24;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_PATH = join(ROOT, 'data', 'youtube-shorts.json');

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function decodeXml(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function uniqueIds(ids) {
  const seen = new Set();
  const out = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

function parseShortIdsFromRss(xml) {
  if (!xml.includes('<feed')) return [];
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
  const ids = [];
  for (const match of entries) {
    const block = match[1];
    if (!block.includes('/shorts/')) continue;
    const id = block.match(/<yt:videoId>([^<]+)/)?.[1];
    if (id) ids.push(id);
  }
  return ids;
}

async function fetchShortIdsFromPage() {
  const response = await fetch(SHORTS_PAGE, {
    headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
  });
  if (!response.ok) {
    throw new Error(`Shorts page fetch failed: ${response.status}`);
  }
  const html = await response.text();
  const ids = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map((m) => m[1]);
  return uniqueIds(ids);
}

async function fetchShortIdsFromRss() {
  const response = await fetch(RSS_URL, {
    headers: {
      'User-Agent': UA,
      Accept: 'application/atom+xml, application/xml, text/xml, */*',
    },
    redirect: 'follow',
  });
  if (!response.ok) return [];
  const xml = await response.text();
  return parseShortIdsFromRss(xml);
}

async function fetchOembed(id) {
  const target = `https://www.youtube.com/shorts/${id}`;
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(target)}&format=json`;
  const response = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!response.ok) return null;
  return response.json();
}

async function buildShortEntry(id, rssMeta) {
  const oembed = await fetchOembed(id);
  const title = oembed?.title ?? rssMeta?.title ?? 'Jacob Talks Baseball Short';
  const thumbnail =
    oembed?.thumbnail_url ?? `https://i.ytimg.com/vi/${id}/hq2.jpg`;

  return {
    id,
    title,
    url: `https://www.youtube.com/shorts/${id}`,
    thumbnail,
  };
}

function parseRssShortMeta(xml) {
  const map = new Map();
  if (!xml.includes('<feed')) return map;
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
  for (const match of entries) {
    const block = match[1];
    if (!block.includes('/shorts/')) continue;
    const id = block.match(/<yt:videoId>([^<]+)/)?.[1];
    const titleRaw = block.match(/<media:title>([^<]+)/)?.[1];
    const published = block.match(/<published>([^<]+)/)?.[1];
    if (id) {
      map.set(id, {
        title: titleRaw ? decodeXml(titleRaw) : undefined,
        published: published ?? undefined,
      });
    }
  }
  return map;
}

async function main() {
  let rssXml = '';
  try {
    const rssRes = await fetch(RSS_URL, { headers: { 'User-Agent': UA } });
    if (rssRes.ok) rssXml = await rssRes.text();
  } catch {
    /* RSS optional */
  }

  const rssIds = parseShortIdsFromRss(rssXml);
  const pageIds = await fetchShortIdsFromPage();
  const orderedIds = uniqueIds([...rssIds, ...pageIds]).slice(0, MAX_SHORTS);
  const rssMeta = parseRssShortMeta(rssXml);

  const shorts = [];
  for (const id of orderedIds) {
    shorts.push(await buildShortEntry(id, rssMeta.get(id)));
  }

  const payload = {
    channelId: CHANNEL_ID,
    channelUrl: 'https://www.youtube.com/@jacobtalks-baseball',
    updatedAt: new Date().toISOString(),
    shorts,
  };

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${shorts.length} shorts to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
