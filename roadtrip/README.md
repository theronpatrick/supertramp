# roadtrip

Digital scrapbook for Theron's cross-country road trips. This folder contains two independently-built projects that get deployed to `theron.dev` via the `docs/` folder at the repo root.

---

## Project Structure

```
roadtrip/
├── src/               # Vue 2 app (the main scrapbook)
├── bison/             # Separate Preact app (Bison Brawl game)
├── dist/              # Built output for the Vue app
└── package.json       # Scripts to build + deploy both projects
```

### Vue App — Main Scrapbook (`src/`)

A Vue 2 + Vite app that serves as the hub for all trip content. It deploys to `/roadtrip/` on theron.dev. Sections:

- **Main** — Landing page with nav buttons to all other sections, including a link out to Bison Brawl at `/bison/`
- **Summer of Snap** (`/summerofsnap`) — Slideshow-style theater for trip photos
- **Selfie Gallery** (`/selfiegallery`) — Gallery of selfie photos from the trip
- **Stats, Facts, and Fun** (`/stats`) — Scroll-based infographics about the trip
- **Bumper Sticker Explorer** (`/bumperstickers`) — Interactive parallax scene with clickable bumper stickers

### Bison Brawl — National Parks Game (`bison/`)

A fully separate Preact + Vite app that lives at `/bison/` on theron.dev. It's a national parks photo-guessing game: a random photo from one of your trip albums is shown, and the player picks which park it's from out of four choices. The two apps are completely independent — separate `package.json`, separate `node_modules`, separate build output.

---

## How the Bison Cache System Works

Bison Brawl doesn't call the Imgur API at runtime. Instead, album data is pre-fetched and baked into a static JS cache file that ships with the build.

### Adding a New Park

1. **Get the Imgur album ID** from the album URL. For example:
   `https://imgur.com/a/trip-2026-great-basin-t1IrQhw` → ID is `t1IrQhw`

2. **Add the entry to `bison/fetch_albums.sh`** in the `albums` array:
   ```bash
   "t1IrQhw:Great_Basin"
   ```
   The part before `:` is the album ID. The part after is just a label used for logging — it doesn't affect the game. The actual park name displayed in the game comes from the Imgur album title via the jq parser.

3. **Run the fetch script** from inside `bison/`:
   ```bash
   bash fetch_albums.sh
   ```
   This calls the Imgur API for every album in the list, extracts the title and image links, and writes a new cache file named `src/data/api/cache.YY.M.D.js` (e.g. `cache.26.7.7.js`).

4. **Update the import in `bison/src/App.jsx`** to point to the new cache file:
   ```js
   import cachedData from "./data/api/cache.26.7.7";
   ```

5. **Check the `parkName` field** in the new cache entries. The script derives it from the album title using a jq transform that splits on `_`, skips the `trip` prefix and year, and capitalizes each word. Names with acronyms (e.g. `u_s`) come out as `"U S"` — fix those manually in the cache file before building.

---

## Building

### Bison only

From the `roadtrip/` directory:
```bash
npm run build:bison
```

This builds the Preact app, copies the output to `../docs/bison/`, stages it, commits, and pushes. If you've also changed source files (like `fetch_albums.sh`, `App.jsx`, or the cache file), stage and commit those manually first, or do it all in one commit after the copy step.

**Manual equivalent** (more control over the commit):
```bash
# 1. Build
cd bison && npm run build && cd ..

# 2. Copy to docs
rm -rf ../docs/bison && mkdir -p ../docs/bison && cp -R bison/dist/* ../docs/bison/

# 3. Commit everything (source changes + built output)
cd .. && git add docs/bison roadtrip/bison/fetch_albums.sh roadtrip/bison/src/App.jsx roadtrip/bison/src/data/api/cache.YY.M.D.js
git commit -m "Add [park name] to Bison Brawl"
git push origin master
```

### Both projects (Vue app + Bison)

From `roadtrip/`:
```bash
npm run build:deploy
```

Builds both, copies both to `docs/`, and pushes in one commit.

### Vue app only

From `roadtrip/`:
```bash
npm run build
```

Output goes to `roadtrip/dist/`. To deploy, copy to `../docs/roadtrip/` and push.

---

## Dev Server

Vue app:
```bash
cd roadtrip && npm run dev   # localhost:5173
```

Bison:
```bash
cd roadtrip/bison && npm run dev   # localhost:3000
```

---

## Deployment

Both apps are deployed as static files via GitHub Pages served from the `docs/` folder at the repo root. The Vue app lives at `docs/roadtrip/` and Bison at `docs/bison/`. Pushing to `master` is all that's needed — no CI step.
