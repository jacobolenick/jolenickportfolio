# jacobolenick.com — v2

A minimal static portfolio with canvas pixel animations. No framework, no dependencies.

## Edit
All copy lives in `src/content.mjs` (projects, experience, notes, plugins, about).
After editing, rebuild:

    node build.mjs

## Preview locally

    node scripts/serve.mjs     # http://localhost:4321

## Images
Images live in `images/`. The build uses that folder automatically when it's present; without it
(e.g. a fresh copy with no images), pages fall back to loading images from `IMG` in `src/content.mjs`.

## Structure
- `index.html`, `projects/<slug>/`, `notes/`, `experience.html`, `about/`, `404.html` — generated
- URLs match the old site, so existing links keep working (old `/notes/<slug>/` URLs redirect to `/notes/#<slug>`)
- `assets/pixel.js` — the pixel animation engine + every animation (procedural, ~10fps, pauses off-screen, respects reduced motion)
- `assets/style.css` — tokens at the top; light/dark follows the system with a manual toggle

## Deploy
This repo is served by GitHub Pages (custom domain in `CNAME`). Edit, run `node build.mjs`, commit and push to `main` — the site updates in a minute or two.
Old URLs from the previous site (`/about.html`, `/projects/<slug>.html`, `/notes/<slug>.html`) redirect to the new pages.

## YouTube Shorts carousel
The About page carousel (with view counts) is built from `data/youtube-shorts.json`. To pull in new Shorts and fresh view counts:

    node scripts/update-shorts.mjs && node build.mjs

If the site is hosted from a GitHub repo, `.github/workflows/update-shorts.yml` does this automatically every day.

View counts come from the public RSS feed and video pages. For the most reliable counts, set a
`YOUTUBE_API_KEY` environment variable (or a repo secret of the same name for the GitHub workflow).

## Dugout card packs
The pixel baseball in the bottom-right corner of every page opens a pack of 10 random cards from a
30-card set (`SET` and `TEAMS` at the top of `assets/packs.js`). About 1 in 6 cards is a holo.
Sounds are synthesized with Web Audio, so there are no audio files. Each visitor's collection
progress is stored in their own browser.
