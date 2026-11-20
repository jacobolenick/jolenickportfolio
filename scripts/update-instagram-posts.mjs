#!/usr/bin/env node
/**
 * Updates data/instagram-posts.json (+ local thumbnails) from @jacobtalksbaseball.
 * Uses Playwright (Chromium). In CI: npm install playwright-core && npx playwright install chromium.
 */
import { createWriteStream, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const USERNAME = 'jacobtalksbaseball';
const PROFILE_URL = `https://www.instagram.com/${USERNAME}/`;
const MAX_POSTS = 12;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_PATH = join(ROOT, 'data', 'instagram-posts.json');
const THUMB_DIR = join(ROOT, 'images', 'instagram');

function sanitizeAlt(alt) {
  if (!alt) return '';
  let text = alt
    .replace(/^Photo by Jake \| Baseball Creator on [^.]+\.\s*/i, '')
    .replace(/^Video by Jake \| Baseball Creator on [^.]+\.\s*/i, '')
    .replace(/\s*May be an image of\s*/i, '')
    .replace(/\s*May be a graphic of\s*/i, '')
    .replace(/\s*May be a video of\s*/i, '')
    .replace(/^text\.?$/i, '');
  return text.trim();
}

function parseOpenGraphCaption(description, title) {
  if (description) {
    let text = description.replace(/\s*-\s*@jacobtalksbaseball on [^.]+$/i, '').trim();
    text = text.replace(/\n+/g, ' ').trim();
    if (text.length > 12) return text;
  }
  if (title) {
    const quoted = title.match(/:\s*"(.+)"\s*$/s)?.[1];
    if (quoted) {
      return quoted.replace(/\n+/g, ' ').trim();
    }
  }
  return '';
}

async function readCaptionFromPage(page) {
  const { description, ogTitle } = await page.evaluate(() => ({
    description: document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '',
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
  }));
  return parseOpenGraphCaption(description, ogTitle);
}

async function fetchPostCaption(page, postUrl) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await page.goto(postUrl, { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForTimeout(attempt === 0 ? 1200 : 2200);
      await page.waitForSelector('meta[property="og:description"]', { timeout: 15_000 });
      const caption = await readCaptionFromPage(page);
      if (caption.length > 20) return caption;
    } catch {
      /* retry */
    }
  }
  return '';
}

async function downloadThumbnail(url, destPath) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'image/*' },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`Thumbnail download failed: ${response.status}`);
  const body = response.body;
  if (!body) throw new Error('Thumbnail response has no body');
  await pipeline(Readable.fromWeb(body), createWriteStream(destPath));
}

async function scrapePosts(page) {
  await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await page.waitForSelector('a[href*="/p/"], a[href*="/reel/"]', { timeout: 45_000 });
  return page.$$eval('a[href*="/p/"], a[href*="/reel/"]', (links, max) => {
    const seen = new Set();
    const out = [];
    for (const a of links) {
      const href = a.href.split('?')[0];
      if (seen.has(href)) continue;
      seen.add(href);
      const img = a.querySelector('img');
      if (!img || !img.src.includes('cdninstagram')) continue;
      const shortcode = new URL(href).pathname.match(/\/(p|reel)\/([^/]+)/)?.[2];
      if (!shortcode) continue;
      const isReel = href.includes('/reel/');
      out.push({
        shortcode,
        url: href,
        thumbnailRemote: img.src,
        alt: img.alt || '',
        mediaType: isReel ? 'reel' : 'image',
      });
      if (out.length >= max) break;
    }
    return out;
  }, MAX_POSTS);
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import('playwright-core'));
  } catch {
    console.error('Install playwright-core: npm install playwright-core && npx playwright install chromium');
    process.exit(1);
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'chrome' });
  } catch {
    browser = await chromium.launch({ headless: true });
  }

  const page = await browser.newPage();
  const rawPosts = await scrapePosts(page);

  if (!rawPosts.length) {
    await browser.close();
    throw new Error('No Instagram posts found on profile grid.');
  }

  mkdirSync(THUMB_DIR, { recursive: true });
  const posts = [];

  for (const item of rawPosts) {
    const ext = item.thumbnailRemote.includes('.webp') ? 'webp' : 'jpg';
    const localFile = `${item.shortcode}.${ext}`;
    const localPath = join(THUMB_DIR, localFile);
    try {
      await downloadThumbnail(item.thumbnailRemote, localPath);
    } catch (err) {
      console.warn(`Thumbnail skipped for ${item.shortcode}:`, err.message);
      continue;
    }
    const captionFromPage = await fetchPostCaption(page, item.url);
    const fallbackAlt = sanitizeAlt(item.alt);
    const caption = captionFromPage || (fallbackAlt.length > 12 ? fallbackAlt : '');
    posts.push({
      id: item.shortcode,
      url: item.url,
      thumbnail: `images/instagram/${localFile}`,
      caption,
      mediaType: item.mediaType,
    });
  }

  await browser.close();

  const payload = {
    username: USERNAME,
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
