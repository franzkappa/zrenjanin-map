# HANDOFF — Zrenjanin Map (D3.js Edition)

## Objective

Responsive bilingual (`EN` / `IT`) editorial map for the CIJI / OBCT journalistic investigation **“Safe to Drink, Hard to Trust: Zrenjanin’s Water Crisis Is Far from Over”**.  
The map illustrates Zrenjanin's drinking water crisis, focusing on the **Metito Treatment Plant** (*Fabrika vode*), the **Begej** river course, the municipality's water basins, and the 8 surrounding villages.

---

## Current Production Status (2026-11-24)

- **GitHub Repository**: https://github.com/franzkappa/zrenjanin-map (`public`, branch `main`)
- **GitHub Pages Live URLs**:
  - English (default): https://franzkappa.github.io/zrenjanin-map/
  - Italian: https://franzkappa.github.io/zrenjanin-map/?lang=it (also accessible via `/it/`, which redirects to `../?lang=it`)
- **Security & Privacy**: `*.docx` is excluded in `.gitignore` so unpublished article manuscripts stay local and are never pushed to the public repository. `.nojekyll` is present so GitHub Pages serves static assets directly. `robots.txt` disallows indexing (`Disallow: /`).
- **Cache-busting**: `source/places.js?v=20261124-2` and `map_d3.js?v=20261124-2` are versioned in `index.html` so browser caches refresh immediately after updates.
- **Validation**: `./scripts/check.sh` → `ALL CHECKS PASS`.

---

## Version History & Technical Decisions

### Phase 1 — Initial static version (2026-11-11)
- Built as a macro-regional static map (Vojvodina, Danube, Novi Sad, Belgrade, Kovin, Titel) using MapLibre GL JS + CARTO Positron + Playwright (`scripts/shoot.py`) to export 12 raster images.
- Plant position was provisional, north-west of the city.

### Phase 2 — Real plant coordinates verification (2026-11-18)
- Verified real coordinates of the *Fabrika vode* water treatment plant on **Mihajlovački drum 10**, north of the city center: **`45°24'21.7"N 20°23'36.7"E`** (`45.4060, 20.3935`).

### Phase 3 — Migration to D3.js & local framing (2026-11-18)
- Migrated to D3.js v7 with a hybrid Canvas + SVG architecture.

### Phase 4 — Editorial styling, polygon hydrography, text selection, legend simplification (2026-11-18)
- **Editorial requests**:
  1. Unified black dot for *Cities and villages*, removed subtitle deck under `<h1>`, linked *Rivers* to the river symbol.
  2. Enabled full text selection on all SVG labels (`user-select: text !important`, `pointer-events: auto !important`, `cursor: text`).
  3. Replaced dark/raster hillshade artifacts with a clean warm paper palette (`#f6f2ea`).
  4. Added full OpenStreetMap water polygons (`assets/water.geojson` bundled synchronously into `source/geo_layers.js`) for the Begej, Tisa, Ribnjak Ečka fishponds, Carska Bara wetlands, urban lakes, and DTD canal.

### Phase 5 — Tighter zoom, regional inset map, legend & label cleanup (2026-11-18)
- **Editorial requests**:
  1. Closer municipal framing (`desktop: [[20.238, 45.272], [20.498, 45.482]]`).
  2. Removed redundant "KEY" heading and "Map: CIJI" text.
  3. Added regional inset map showing Serbia and neighbouring countries synchronously.
  4. Removed secondary subtitles ("Mihajlovački drum", "67,000 residents").

### Phase 6 — Standalone inset card, full Balkan borders, two-column legend, Tisa label (2026-11-18)
- **Editorial requests**:
  1. Separated the inset map into a standalone card beneath the header/legend panel (`.panel-stack`, `aspect-ratio: 306/200`).
  2. Regenerated Balkan country polygons without the 16.0°E western clip so Slovenia, Croatia (Istria and islands), Bosnia & Herzegovina, and the Adriatic Sea render completely.
  3. Removed "Zrenjanin in Serbia" caption beneath the inset.
  4. Reorganized legend into 2 columns (`Cities and villages` / `Metito Treatment Plant` on left; `Rivers and basins` on right).
  5. Moved `TISA` label adjacent to the western riverbank (`lat ~45.38`).

### Phase 7 — Begej label placement & inset cleanup (2026-11-18)
- **Editorial requests**:
  1. Placed `BEGEJ` label above and parallel to the river across from Mužlja (`[20.408, 45.356]` → `[20.418, 45.346]`, `dy: -8`), avoiding road and water overlaps.
  2. Removed the pin/text label inside the inset map, leaving only the orange framing rectangle over Serbia.

### Phase 8 — Cleanup, iframe hardening, webmaster distribution bundle (2026-11-18)
- Changed `#map-container` from `100vw`/`100vh` to `100%`/`100%` to prevent Safari/iOS scrollbar jitter inside `<iframe>` embeds.
- Removed obsolete Phase 1 MapLibre files and debug screenshots while preserving the unpublished investigation `.docx` locally.
- Packaged the 23 production files into `zrenjanin-map-webmaster.zip`.

### Phase 9 — GitHub Pages publication, bilingual EN/IT support, cache-busting & English docs (2026-11-24)
- **GitHub & Hosting**:
  - Initialized Git repository, added `*.docx` to `.gitignore` and `.nojekyll` for GitHub Pages, and pushed to `franzkappa/zrenjanin-map`.
  - Enabled GitHub Pages (`main` branch, root `/`) at `https://franzkappa.github.io/zrenjanin-map/`.
- **Bilingual Support (`?lang=it` & `/it/`)**:
  - Added synchronous query-parameter detection (`window.MAP_LANG` from `?lang=it`, defaulting to `en`) in `index.html` and `map_d3.js`.
  - Added `it/index.html` redirect to `../?lang=it` (matching `franzkappa/breznik-map`).
  - Added Italian translations for all UI & cartographic strings:
    - Title: `Zrenjanin e la crisi idrica`
    - Legend: `Città e villaggi`, `Impianto di trattamento Metito`, `Fiumi e bacini idrici`
    - Map plant pin (`source/places.js` `name_it`): `Impianto di trattamento Metito`
    - Inset country labels (`map_d3.js`): `SERBIA`, `UNGHERIA`, `ROMANIA`, `BULGARIA`, `BOSNIA ED ERZ.`, `CROAZIA`, `SLOVENIA`, `MONTENEGRO`, `KOSOVO`, `MACEDONIA DEL N.`
    - Sources & credits localized in Italian.
  - Adjusted `html[lang="it"]` legend spacing (`gap: 10px`, `font-size: 7.8px`) so the two-column legend fits cleanly inside the 312 px card without wrapping or overflowing.
  - Added cache-busting query strings (`source/places.js?v=20261124-1`, `map_d3.js?v=20261124-1`) so browsers fetch updated JS immediately after deploys.
- **Documentation**:
  - Translated `README.md`, `HANDOFF.md`, and `WEBMASTER_INSTRUCTIONS.md` (replacing `ISTRUZIONI_WEBMASTER.md`) to English and refreshed `zrenjanin-map-webmaster.zip`.

### Phase 10 — Source attribution & cartography signature (2026-11-24)
- **Non-visual authorship metadata**:
  - Embedded cartography signature (`Cartography: Federico Caruso, caruso@balcanicaucaso.org` in EN, `Cartografia: Federico Caruso, caruso@balcanicaucaso.org` in IT) across `index.html` (HTML comment, `<meta name="author">`, `<meta name="cartography">`, `data-cartography` on `#map-container`, and `?lang=it` runtime updates), `it/index.html`, `map_d3.js`, and `source/places.js`.
  - Added the same localized HTML comment and `data-cartography` attribute to the `.ciji-map-wrapper` embed snippets in `WEBMASTER_INSTRUCTIONS.md` and `README.md`.
- **Cache-busting & bundle**:
  - Bumped asset query strings in `index.html` to `?v=20261124-2` and rebuilt `zrenjanin-map-webmaster.zip`.

### Phase 11 — Visible map credit in legend (2026-11-24)
- **Legend attribution**:
  - Added `Map: Federico Caruso/OBCT` (English) and `Mappa: Federico Caruso/OBCT` (Italian, `?lang=it`) on a second line inside the `.source` footer of the legend panel (`index.html`, switching `.source` from `data-i18n` to `data-i18n-html`, with `margin: 7px 0 0`).
- **Validation & bundle**:
  - Extended `scripts/check.py` to verify both `Map: Federico Caruso/OBCT` and `Mappa: Federico Caruso/OBCT` in `index.html`.
  - Updated documentation (`README.md`, `HANDOFF.md`) and rebuilt `zrenjanin-map-webmaster.zip`.

---

## Repository Architecture Summary

- **`index.html`**: Main D3 responsive map with `.panel-stack` (header + two-column legend + standalone inset card), local Montserrat `@font-face` rules, and synchronous `?lang=it` i18n script.
- **`it/index.html`**: Lightweight redirect (`meta refresh`) to `../?lang=it`.
- **`map_d3.js`**: D3 rendering engine (Canvas `#f6f2ea` basemap, SVG urban/roads/water polygons, `BEGEJ` & `TISA` labels, EN/IT place & inset country labels, dynamic km scale bar).
- **`source/places.js`**: 10 verified locations (`desktop` / `mobile` bounds, coordinates, `name` + `name_it` for the plant).
- **`source/geo_layers.js`**: Compact synchronous bundle of `urban`, `roads`, `water`, and `balkans` GeoJSON layers for instant offline/`file://` loading.
- **`scripts/check.sh` / `scripts/check.py`**: Automated integrity suite verifying required assets, coordinate bounds, DOM/legend structure, and D3 calls.

---

## Running Checks

```bash
./scripts/check.sh
```

Verifies:
1. Presence of all required files (HTML, JS, GeoJSON, logos, Montserrat fonts).
2. Geographic coordinates within allowed desktop/mobile bounding boxes.
3. DOM integrity in `index.html` (`Cities and villages`, `Metito Treatment Plant`, `Rivers`, EN/IT `Map: Federico Caruso/OBCT` / `Mappa: Federico Caruso/OBCT` legend credit, absence of `.deck`).
4. References to `d3.tile()`, `d3.geoMercator()`, and `pin-shadow` in `map_d3.js`.
