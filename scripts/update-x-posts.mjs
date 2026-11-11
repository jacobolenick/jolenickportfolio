#!/usr/bin/env node
/**
 * Updates data/x-posts.json (+ local media) for @jtalksbaseball.
 * Primary: Jina reader snapshot of the public X profile (no API key).
 * Optional: set X_API_BEARER for Twitter API v2 (more posts, stable IDs).
 */
import { createWriteStream, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { createHash } from 'node:crypto';

const SCREEN_NAME = 'jtalksbaseball';
const USER_ID = '2116225954901364736';
const PROFILE_URL = `https://x.com/${SCREEN_NAME}`;
const JINA_PROFILE = `https://r.jina.ai/${PROFILE_URL}`;
const MAX_POSTS = 12;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_PATH = join(ROOT, 'data', 'x-posts.json');
const MEDIA_DIR = join(ROOT, 'images', 'x');

const UA = 'Mozilla/5.0 (compatible; jolenickportfolio/1.0)';

function stripMarkdownTweetText(raw) {
  if (!raw) return '';
  let text = raw
    .replace(/^\[\!\[[^\]]*\]\([^\)]*\)\]\(https:\/\/x\.com\/jtalksbaseball\)\s*/i, '')
    .replace(/\[([^\]]+)\]\(https:\/\/x\.com\/[^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\(https:\/\/twitter\.com\/[^)]+\)/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[Video \d+\]\([^)]*\)/g, '')
    .replace(/([^\s])#/g, '$1 #')
    .replace(/\s+/g, ' ')
    .trim();
  return text;
}

function bestMediaUrl(url) {
  if (!url || url.startsWith('blob:')) return null;
  if (url.includes('profile_images') || url.includes('profile_banners')) return null;
  if (url.includes('pbs.twimg.com')) {
    const base = url.split('?')[0];
    return `${base}?format=jpg&name=large`;
  }
  return url;
}

function parseJinaMarkdown(markdown) {
  const section = markdown.split('##')[1] || markdown;
  const listChunk = section.includes('posts') ? section.split('posts').slice(1).join('posts') : section;
  const items = [...listChunk.matchAll(/^\*\s+(.+)$/gm)].map((m) => m[1].trim());
  const posts = [];

  for (const item of items) {
    const text = stripMarkdownTweetText(item);
    if (!text || text.length < 8) continue;

    const mediaUrls = [...item.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)]
      .map((m) => bestMediaUrl(m[1]))
      .filter(Boolean)
      .filter((u) => !u.includes('_normal.jpg'));

    const idFromVideo = item.match(/amplify_video_thumb\/(\d+)\//)?.[1];
    const id = idFromVideo || createHash('sha1').update(text + (mediaUrls[0] || '')).digest('hex').slice(0, 16);
    const url = idFromVideo
      ? `https://x.com/${SCREEN_NAME}/status/${idFromVideo}`
      : PROFILE_URL;

    posts.push({
      id,
      url,
      text,
      mediaRemote: mediaUrls[0] || null,
      hasVideo: Boolean(idFromVideo),
    });
    if (posts.length >= MAX_POSTS) break;
  }
  return posts;
}

async function downloadFile(url, destPath) {
  const response = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'image/*' },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`Download ${response.status}`);
  const body = response.body;
  if (!body) throw new Error('Empty body');
  await pipeline(Readable.fromWeb(body), createWriteStream(destPath));
}

async function fetchFromJina() {
  const response = await fetch(JINA_PROFILE, {
    headers: { 'User-Agent': UA, Accept: 'text/plain' },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`Jina fetch failed: ${response.status}`);
  const markdown = await response.text();
  return parseJinaMarkdown(markdown);
}

async function fetchFromApiV2(bearer) {
  const base = 'https://api.twitter.com/2';
  const params = new URLSearchParams({
    max_results: String(Math.min(MAX_POSTS, 10)),
    exclude: 'retweets,replies',
    'tweet.fields': 'created_at,attachments,text,entities',
    expansions: 'attachments.media_keys',
    'media.fields': 'url,preview_image_url,type,alt_text',
  });
  const response = await fetch(`${base}/users/${USER_ID}/tweets?${params}`, {
    headers: { Authorization: `Bearer ${bearer}`, 'User-Agent': UA },
  });
  if (!response.ok) throw new Error(`X API v2 ${response.status}`);
  const data = await response.json();
  const mediaByKey = new Map((data.includes?.media || []).map((m) => [m.media_key, m]));
  return (data.data || []).slice(0, MAX_POSTS).map((tweet) => {
    const keys = tweet.attachments?.media_keys || [];
    const media = keys.map((k) => mediaByKey.get(k)).find(Boolean);
    const mediaRemote =
      media?.url || media?.preview_image_url || null;
    return {
      id: tweet.id,
      url: `https://x.com/${SCREEN_NAME}/status/${tweet.id}`,
      text: tweet.text?.replace(/\s+https:\/\/t\.co\/\w+/g, '').trim() || '',
      mediaRemote,
      hasVideo: media?.type === 'video' || media?.type === 'animated_gif',
    };
  });
}

async function main() {
  let rawPosts = [];
  const apiBearer = process.env.X_API_BEARER?.trim();

  if (apiBearer) {
    try {
      rawPosts = await fetchFromApiV2(apiBearer);
    } catch (err) {
      console.warn('X API v2 failed, falling back to Jina:', err.message);
    }
  }
  if (!rawPosts.length) {
    rawPosts = await fetchFromJina();
  }
  if (!rawPosts.length) {
    throw new Error('No X posts parsed.');
  }

  mkdirSync(MEDIA_DIR, { recursive: true });
  const posts = [];

  for (const item of rawPosts) {
    let media = null;
    if (item.mediaRemote) {
      const ext = item.mediaRemote.includes('.webp') ? 'webp' : 'jpg';
      const file = `${item.id}.${ext}`;
      const dest = join(MEDIA_DIR, file);
      try {
        await downloadFile(item.mediaRemote, dest);
        media = `images/x/${file}`;
      } catch (err) {
        console.warn(`Media skipped for ${item.id}:`, err.message);
      }
    }
    posts.push({
      id: item.id,
      url: item.url,
      text: item.text,
      media,
      hasVideo: item.hasVideo,
    });
  }

  const payload = {
    screenName: SCREEN_NAME,
    profileUrl: PROFILE_URL,
    updatedAt: new Date().toISOString(),
    posts,
  };

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${posts.length} posts to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
