# Guida per il Webmaster: Pubblicazione e Integrazione su WordPress
## Mappa Editoriale: "Zrenjanin and the water crisis" (CIJI / OBCT)

Questo pacchetto contiene una **mappa interattiva responsive ad alte prestazioni** sviluppata in D3.js (v7) con architettura mista Canvas + SVG.

---

### 1. Caratteristiche Tecniche e Punti di Forza

- **Autoconsistente al 100%**: tutti i dati geografici e i confini sono inclusi in `source/geo_layers.js`. Non sono necessarie chiamate AJAX/fetch per file `.geojson` (nessun problema di CORS, HTTPS o configurazione MIME-type sul server).
- **GDPR-compliant**: i font tipografici (Montserrat) sono ospitati localmente nella cartella `assets/fonts/` (nessuna chiamata esterna a Google Fonts).
- **Testo reale selezionabile**: toponimi, legenda e scritte sono veri elementi DOM/SVG vettoriali (`<text>`), nitidi su display Retina/4K e accessibili.
- **Responsive**: la mappa calcola dinamicamente la proiezione Mercatore adattandosi sia a monitor desktop ampi che a smartphone (schermi ≤ 700 px con layout verticale dedicato).

---

### 2. Struttura del Pacchetto

```
zrenjanin-map/
├── index.html                  <!-- File principale della mappa -->
├── map_d3.js                   <!-- Logica cartografica D3.js e rendering -->
├── favicon.ico
├── robots.txt
├── source/
│   ├── geo_layers.js           <!-- Geometrie vettoriali compresse (fiumi, strade, città, Balcani) -->
│   └── places.js               <!-- Coordinate WGS84 dei punti di interesse -->
├── vendor/
│   ├── d3.min.js               <!-- Libreria D3.js v7.9.2 -->
│   └── d3-tile.min.js          <!-- Plugin Web Mercator D3-tile -->
└── assets/
    ├── balkans-countries.geojson
    ├── roads.geojson
    ├── urban.geojson
    ├── water.geojson
    ├── fonts/                  <!-- Famiglia di font Montserrat (OFL) -->
    └── logos/                  <!-- Loghi CIJI e OBCT in alta risoluzione -->
```

---

### 3. Step 1: Caricamento sul Server Web

Il metodo più pulito, stabile e sicuro per WordPress consiste nell'ospitare la cartella come file statici sul server:

1. Decomprimi lo zip sul tuo computer: otterrai la cartella `zrenjanin-map` (puoi rinominarla a piacere, es. `zrenjanin-map`).
2. Tramite **FTP/SFTP** (FileZilla, Cyberduck, ecc.) o il **File Manager** del pannello di controllo (cPanel, Plesk, RunCloud):
   - Carica l'intera cartella in una directory pubblica del tuo sito. Ad esempio:
     - `/wp-content/uploads/interactive/zrenjanin-map/`
     - oppure direttamente nella root del dominio: `/interactive/zrenjanin-map/`
3. Verifica nel browser che l'URL diretto si apra correttamente:
   - `https://tuosito.org/interactive/zrenjanin-map/` (o `index.html`)

---

### 4. Step 2: Inserimento nell'Articolo WordPress

All'interno dell'articolo in cui deve comparire l'inchiesta:

#### A. Con l'editor a blocchi Gutenberg (Consigliato)
1. Nel punto desiderato dell'articolo, clicca sul **`+`** per aggiungere un blocco.
2. Cerca e seleziona il blocco **HTML personalizzato** (*Custom HTML*).
3. Incolla il seguente codice di incorporamento:

```html
<!-- Mappa Editoriale CIJI / OBCT — Zrenjanin Water Crisis -->
<div class="ciji-map-wrapper" style="position: relative; width: 100%; max-width: 1080px; margin: 2.5rem auto; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
  <iframe
    src="https://tuosito.org/interactive/zrenjanin-map/index.html"
    title="Zrenjanin and the water crisis — editorial map"
    style="width: 100%; height: 700px; border: 0; display: block;"
    loading="lazy"
    allowfullscreen>
  </iframe>
</div>
```
*(Sostituisci `https://tuosito.org/interactive/zrenjanin-map/index.html` con il percorso effettivo in cui hai caricato la cartella).*

#### B. Con Page Builder (Elementor, Divi, WPBakery)
- Aggiungi un modulo **HTML** o **Code** e incolla lo snippet sopra.

---

### 5. Ottimizzazione Responsive per Dispositivi Mobili (Opzionale nel CSS del Tema)

Se il tema di WordPress supporta CSS personalizzato (in *Aspetto → Personalizza → CSS aggiuntivo* o nel file `style.css`), puoi inserire questa regola per regolare l'altezza su smartphone in modo ottimale:

```css
/* Altezza iframe mappa per smartphone */
@media (max-width: 768px) {
  .ciji-map-wrapper iframe {
    height: 580px !important;
  }
}
```

---

### 6. Metodo Alternativo: Hosting Statico Decoupled (Vercel / Netlify / Cloudflare Pages)

Se preferisci non caricare asset statici sullo spazio server di WordPress:
1. Crea un progetto su **Cloudflare Pages**, **Netlify** o **Vercel** trascinando la cartella decompressa.
2. Otterrai un URL HTTPS immediato e ultra-veloce su CDN globale (es. `https://zrenjanin-map.pages.dev`).
3. Inserisci quell'URL nell'attributo `src` dell'iframe nell'articolo WordPress.
