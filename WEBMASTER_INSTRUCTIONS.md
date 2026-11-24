# Webmaster Guide: Deployment and WordPress Integration
## Editorial Map: "Zrenjanin and the water crisis" (CIJI / OBCT)

This package contains a **high-performance, responsive interactive map** built with D3.js (v7) using a hybrid Canvas + SVG architecture.

---

### 1. Technical Highlights

- **100% self-contained**: all geographic geometries and borders are bundled in `source/geo_layers.js`. No AJAX/fetch requests to `.geojson` files are required (no CORS, HTTPS, or server MIME-type issues).
- **GDPR-compliant**: Montserrat fonts are hosted locally in `assets/fonts/` (zero external calls to Google Fonts).
- **Real selectable text**: place names, legend items, and labels are genuine vector DOM/SVG `<text>` elements, crisp on Retina/4K screens and accessible.
- **Responsive**: dynamically computes the Mercator projection for both wide desktop monitors and smartphones (`≤ 700 px` dedicated mobile layout).
- **Bilingual (`EN` / `IT`)**: serves English by default and Italian with `?lang=it` (or `/it/`).

---

### 2. Package Structure

```text
zrenjanin-map/
├── index.html                  <!-- Main map page (supports ?lang=en and ?lang=it) -->
├── it/
│   └── index.html              <!-- Redirect to ../?lang=it -->
├── map_d3.js                   <!-- D3.js cartographic & rendering engine -->
├── favicon.ico
├── robots.txt
├── source/
│   ├── geo_layers.js           <!-- Bundled vector geometries (rivers, roads, urban, Balkans) -->
│   └── places.js               <!-- WGS84 coordinates & EN/IT place names -->
├── vendor/
│   ├── d3.min.js               <!-- D3.js v7.9.2 -->
│   └── d3-tile.min.js          <!-- D3-tile Web Mercator plugin -->
└── assets/
    ├── balkans-countries.geojson
    ├── roads.geojson
    ├── urban.geojson
    ├── water.geojson
    ├── fonts/                  <!-- Local Montserrat font family (OFL) -->
    └── logos/                  <!-- High-resolution CIJI and OBCT logos -->
```

---

### 3. Option A: Embed Directly from GitHub Pages (Fastest)

The map is already hosted on GitHub Pages with HTTPS and global CDN caching:

- **English**: `https://franzkappa.github.io/zrenjanin-map/`
- **Italian**: `https://franzkappa.github.io/zrenjanin-map/?lang=it`

---

### 4. Option B: Host Static Files on Your Own Web Server

1. Unzip `zrenjanin-map-webmaster.zip` locally to obtain the `zrenjanin-map/` folder.
2. Upload the entire folder via **FTP/SFTP** (FileZilla, Cyberduck, etc.) or your hosting **File Manager** (cPanel, Plesk, RunCloud) into a public directory, for example:
   - `/wp-content/uploads/interactive/zrenjanin-map/`
   - or `/interactive/zrenjanin-map/`
3. Verify the URLs open cleanly in a browser:
   - English: `https://yoursite.org/interactive/zrenjanin-map/`
   - Italian: `https://yoursite.org/interactive/zrenjanin-map/?lang=it`

---

### 5. WordPress / CMS Article Integration

#### A. Gutenberg Block Editor (Recommended)
1. Click **`+`** in the article editor and add a **Custom HTML** block.
2. Paste one of the two snippets below (replace the `src` domain if self-hosting):

**English:**
```html
<!-- CIJI / OBCT Editorial Map — Zrenjanin Water Crisis (EN) | Cartography: Federico Caruso, caruso@balcanicaucaso.org -->
<div class="ciji-map-wrapper" data-cartography="Cartography: Federico Caruso, caruso@balcanicaucaso.org" style="position: relative; width: 100%; max-width: 1080px; margin: 2.5rem auto; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
  <iframe
    src="https://franzkappa.github.io/zrenjanin-map/"
    title="Zrenjanin and the water crisis — editorial map"
    style="width: 100%; height: 700px; border: 0; display: block;"
    loading="lazy"
    allowfullscreen>
  </iframe>
</div>
```

**Italian:**
```html
<!-- CIJI / OBCT Editorial Map — Zrenjanin Water Crisis (IT) | Cartografia: Federico Caruso, caruso@balcanicaucaso.org -->
<div class="ciji-map-wrapper" data-cartography="Cartografia: Federico Caruso, caruso@balcanicaucaso.org" style="position: relative; width: 100%; max-width: 1080px; margin: 2.5rem auto; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
  <iframe
    src="https://franzkappa.github.io/zrenjanin-map/?lang=it"
    title="Zrenjanin e la crisi idrica — mappa editoriale"
    style="width: 100%; height: 700px; border: 0; display: block;"
    loading="lazy"
    allowfullscreen>
  </iframe>
</div>
```

#### B. Page Builders (Elementor, Divi, WPBakery, Avada / Fusion)
- Add an **HTML** or **Code** module and paste the snippet above.

---

### 6. Optional Mobile CSS Optimization

In WordPress (*Appearance → Customize → Additional CSS*):

```css
/* Optimal iframe map height on smartphones */
@media (max-width: 768px) {
  .ciji-map-wrapper iframe {
    height: 580px !important;
  }
}
```
