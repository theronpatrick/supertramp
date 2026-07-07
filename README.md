# supertramp

Source repo for [theron.dev](https://theron.dev). All projects build their output into `docs/`, which is served via GitHub Pages.

---

## Projects

### Portfolio — `client/`

The main personal portfolio site at theron.dev. A Vue 2 + Webpack app with a floating bubble navigation UI linking to About Me, Resume, Road Trip, Contact, and Projects sections.

**Stack:** Vue 2.1, Webpack 2.2 (legacy build)

**Build:**
```bash
# from repo root
npm run build
```
Outputs to `docs/`. Also copies `twit/` to `docs/twit/` and triggers the old roadtrip build as part of the same script.

**Dev:**
```bash
npm run dev   # localhost:4001
```

---

### Roadtrip Scrapbook — `roadtrip/`

Digital scrapbook for Theron's cross-country road trips. A Vue 2 + Vite app deployed to `theron.dev/roadtrip/`.

**Sections:**
- **Summer of Snap** (`/summerofsnap`) — Slideshow-style photo theater
- **Selfie Gallery** (`/selfiegallery`) — Gallery of trip selfies
- **Stats, Facts, and Fun** (`/stats`) — Scroll-based infographics
- **Bumper Sticker Explorer** (`/bumperstickers`) — Interactive parallax bumper sticker scene

**Stack:** Vue 2.7, vue-router 3, Vite 5.4

**Build:**
```bash
cd roadtrip
npm run build       # outputs to roadtrip/dist/
```
To deploy, copy `roadtrip/dist/` to `docs/roadtrip/` and push.

**Dev:**
```bash
cd roadtrip
npm run dev         # localhost:5173
```

---

### Bison Brawl — `roadtrip/bison/`

A standalone national parks photo-guessing game. A random photo from one of your Imgur trip albums is shown; the player picks which park it's from out of four choices. Completely separate from the Vue scrapbook — its own Preact app, its own build, deployed to `theron.dev/bison/`.

**Stack:** Preact 10.25, Vite 5.4

**Cache system:** Album data is pre-fetched from the Imgur API and baked into a static JS file rather than fetched at runtime. To add parks or refresh photos:

1. Add entries to `bison/fetch_albums.sh` in the format `"ALBUM_ID:Log_Name"` — the album ID is the last segment of the Imgur album URL
2. Run `bash fetch_albums.sh` from `roadtrip/bison/` — generates a new `src/data/api/cache.YY.M.D.js`
3. Update the import in `bison/src/App.jsx` to point to the new cache file
4. Manually verify `parkName` fields — acronyms like `u_s` get capitalized to `"U S"` and need a manual fix to `"U.S."`

**Build (bison only):**
```bash
# from roadtrip/
npm run build:bison
```
Builds the Preact app, copies output to `docs/bison/`, and pushes. If you changed source files alongside the build, stage and commit them in the same commit rather than letting `build:bison` auto-commit.

**Manual build + deploy:**
```bash
cd roadtrip/bison && npm run build && cd ..
rm -rf ../docs/bison && mkdir -p ../docs/bison && cp -R bison/dist/* ../docs/bison/
cd .. && git add docs/bison roadtrip/bison/fetch_albums.sh roadtrip/bison/src/App.jsx roadtrip/bison/src/data/api/cache.YY.M.D.js
git commit -m "Add [park] to Bison Brawl" && git push origin master
```

**Build (both roadtrip + bison together):**
```bash
cd roadtrip
npm run build:deploy
```

**Dev:**
```bash
cd roadtrip/bison
npm run dev         # localhost:3000
```

---

### Twit — `twit/`

A minimal vanilla JS tool for downloading tweet/X videos directly to Cloudflare R2, via a Cloudflare Worker backend (`gunnison.therondevelopment.workers.dev`). Deployed at `theron.dev/twit/`.

**Stack:** Vanilla JS + HTML, no build step

**Deploy:**
```bash
# from repo root (included in the main build script)
cp -R twit docs/twit/
```
Or use the dedicated script to auto-bump the version number before copying:
```bash
npm run build-twit
```

---

### Sound Square — `docs/level100/`

A 3D interactive sound grid game deployed at `theron.dev/level100/`. The source lives in a separate repo — only the built output is committed here into `docs/level100/`. The `level100/` folder in this repo is just a `_redirects` stub for SPA routing.

---

## Deployment

All projects deploy as static files via GitHub Pages served from `docs/`. Pushing to `master` is all that's needed — no CI pipeline.

| Path | Source |
|------|--------|
| `theron.dev/` | `client/` (Webpack) |
| `theron.dev/roadtrip/` | `roadtrip/` (Vite) |
| `theron.dev/bison/` | `roadtrip/bison/` (Vite) |
| `theron.dev/twit/` | `twit/` (static) |
| `theron.dev/level100/` | external repo → `docs/level100/` |
