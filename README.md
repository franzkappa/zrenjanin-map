# Zrenjanin and the water crisis — D3.js editorial map

Responsive editorial map for the CIJI / OBCT journalistic investigation **“Safe to Drink, Hard to Trust: Zrenjanin’s Water Crisis Is Far from Over”**.

Built with **D3.js (v7)** using a hybrid **Canvas + SVG** architecture, designed for high-definition data journalism and seamless embedding in external articles.

- **Live map (English)**: https://franzkappa.github.io/zrenjanin-map/
- **Live map (Italian)**: https://franzkappa.github.io/zrenjanin-map/?lang=it (also accessible via `/it/`)

---

## Key Features

1. **Real vector typography (DOM / SVG `<text>`) & full text selection**:
   - All map labels (place names, river labels `BEGEJ` and `TISA`, title, and legend) are real HTML/SVG text elements.
   - Fully **selectable with the mouse cursor (`cursor: text`, `user-select: text`)**, searchable (`Cmd+F` / `Ctrl+F`), accessible, and crisp on Retina/4K displays without raster pixelation.

2. **Clean, light paper basemap**:
   - Warm paper background (`#f6f2ea`) free of raster artifacts or dark hillshade muddiness.
   - Vector urban built-up areas (`assets/urban.geojson`) and primary/secondary road network (`assets/roads.geojson`) derived from OpenStreetMap.

3. **True-polygon vector hydrography**:
   - Rivers and water basins are rendered as **real geometric polygons** (`assets/water.geojson`):
     - **Begej** river channel and urban meanders, with the `BEGEJ` label placed above and parallel to the watercourse without overlapping roads or water lines.
     - **Tisa** river polygon along the western border, with its label hugging the riverbank.
     - **Ribnjak Ečka** fishponds (*Belo jezero*, *Koča jezero*, *Joca jezero*, *Mika jezero*).
     - **Carska Bara** wetland reserve network.
     - Zrenjanin urban lakes (*Peskara*, central lakes).
     - **Danube–Tisa–Danube (DTD)** navigable canal.

4. **Two-column legend & standalone inset map**:
   - Compact **two-column legend**:
     - Left column: **Black dot** for *Cities and villages* (*Città e villaggi*) and **Orange diamond** for *Metito Treatment Plant* (*Impianto di trattamento Metito*).
     - Right column: **Teal line** for *Rivers and basins* (*Fiumi e bacini idrici*).
   - **Standalone inset locator map** (`.panel-stack`, `aspect-ratio: 306/200`) showing Serbia in its full Balkan & Adriatic context (down to 13.0°E, including Slovenia, Croatia, Bosnia & Herzegovina, and the Adriatic Sea) with international borders, haloed country labels, and an orange framing rectangle highlighting Zrenjanin.

5. **Bilingual support (`EN` / `IT`)**:
   - Single codebase serving English by default (`/` or `?lang=en`) and Italian via `?lang=it` (with `/it/` redirecting to `../?lang=it`).
   - Translates header, `<title>`, `<html lang>`, legend items, plant label (`Impianto di trattamento Metito`), inset country labels (`UNGHERIA`, `CROAZIA`, `BOSNIA ED ERZ.`, `MACEDONIA DEL N.`, etc.), sources, and credits.

6. **Mobile-first responsive layout**:
   - Dynamic Mercator projection fitting (`d3.geoMercator().fitExtent(...)`).
   - Dedicated compact mobile layout (`≤ 700 px`): top header card, 125 px inset map anchored bottom-left, and OBCT/CIJI logos bottom-right.

---

## Places & Geographic Data

Verified WGS84 coordinates (OpenStreetMap / Nominatim):

| Place / Feature | Type | Coordinates | Description & Role in the Investigation |
|---|---|---|---|
| **Zrenjanin** | City | `45.3836, 20.3819` | Municipality seat, central black pin |
| **Metito Treatment Plant** | Plant | `45.4060, 20.3935` | Water treatment complex (*Fabrika vode*, Mihajlovački drum 10) operated by Pannonian Water / Metito, orange diamond pin |
| **Begej** | River | River polygon | Main hydrographic axis impacted by discharges and ecological crisis |
| **Tisa** | River | River polygon | Major river along the western border of Zrenjanin municipality |
| **Mihajlovo** | Village | `45.4719, 20.4164` | Rural village north of Zrenjanin |
| **Elemir** | Village | `45.4428, 20.2984` | Historic rural community north-west of Zrenjanin |
| **Aradac** | Village | `45.3797, 20.3014` | Village west of Zrenjanin, toward the Tisa river |
| **Klek** | Village | `45.4214, 20.4797` | Village east of Zrenjanin, where the Begej and DTD canal enter the municipality |
| **Mužlja** | District / Village | `45.3484, 20.4041` | Immediately south of Zrenjanin |
| **Ečka** | Village | `45.3176, 20.4394` | South along the Begej, site of the historic castle and fishponds |
| **Lukino Selo** | Village | `45.3069, 20.4266` | South, nestled among wetlands and aquaculture basins |
| **Stajićevo** | Village | `45.2944, 20.4569` | South-east along the Begej, near Carska Bara nature reserve |

---

## Project Structure

```text
.
├── index.html                    Main responsive D3.js map (supports ?lang=en and ?lang=it)
├── it/
│   └── index.html                Redirect to ../?lang=it for clean /it/ URLs
├── map_d3.js                     D3 engine: canvas basemap, SVG vectors, inset map, scale bar
├── source/
│   ├── places.js                 Place names (EN/IT) and WGS84 coordinates
│   └── geo_layers.js             Synchronous vector bundle (urban, roads, water polygons, Balkans)
├── vendor/
│   ├── d3.min.js                 D3.js v7.9.2 (BSD-3-Clause)
│   └── d3-tile.min.js            Official d3-tile plugin for Web Mercator projections
├── assets/
│   ├── balkans-countries.geojson Vector boundaries for the inset locator map
│   ├── water.geojson             OpenStreetMap river and water basin polygons
│   ├── roads.geojson             Vector road network
│   ├── urban.geojson             Urban and rural built-up polygons
│   ├── fonts/                    Local Montserrat font family (OFL) — GDPR-compliant
│   └── logos/                    High-resolution CIJI and OBCT logos
├── scripts/
│   ├── check.sh                  Automated integrity check runner
│   └── check.py                  Asset presence, coordinate bounds, and DOM/JS checks
├── favicon.ico                   Favicon
├── robots.txt                    Crawler directives (noindex)
├── WEBMASTER_INSTRUCTIONS.md     WordPress & static-hosting deployment guide
├── zrenjanin-map-webmaster.zip   Self-contained production bundle (~778 KB)
├── README.md                     Technical documentation
└── HANDOFF.md                    Handoff notes and decision log
```

---

## Embed

The map is published via **GitHub Pages** from this repository. Use the URL matching the language of the host article:

### English article
```html
<iframe
  src="https://franzkappa.github.io/zrenjanin-map/"
  title="Zrenjanin and the water crisis — editorial map"
  style="width: 100%; height: 700px; border: 0; display: block;"
  loading="lazy"
  allowfullscreen>
</iframe>
```

### Italian article
```html
<iframe
  src="https://franzkappa.github.io/zrenjanin-map/?lang=it"
  title="Zrenjanin e la crisi idrica — mappa editoriale"
  style="width: 100%; height: 700px; border: 0; display: block;"
  loading="lazy"
  allowfullscreen>
</iframe>
```

*(Optional responsive CSS for mobile devices in WordPress — Appearance → Customize → Additional CSS)*:
```css
@media (max-width: 768px) {
  .ciji-map-wrapper iframe {
    height: 580px !important;
  }
}
```

### Self-hosted Webmaster Bundle
If you prefer hosting static files directly on your own server instead of GitHub Pages, deploy `zrenjanin-map-webmaster.zip` and follow [`WEBMASTER_INSTRUCTIONS.md`](WEBMASTER_INSTRUCTIONS.md).

---

## Local Development & Verification

Start a local static server:
```bash
python3 -m http.server 8000
# English: http://localhost:8000
# Italian: http://localhost:8000/?lang=it
```

Run automated validation checks:
```bash
./scripts/check.sh
```
