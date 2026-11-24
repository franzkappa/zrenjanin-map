# Zrenjanin e la crisi dell’acqua — Mappa editoriale D3.js

Mappa editoriale interattiva e responsive per l’inchiesta giornalistica CIJI / OBCT **“Safe to Drink, Hard to Trust: Zrenjanin’s Water Crisis Is Far from Over”**.

Questa edizione è realizzata con **D3.js (v7)** secondo un’architettura ibrida **Canvas + SVG**, ispirata agli standard editoriali cartografici de *Il Post* e alle mappe ad alta definizione per il data journalism.

---

## Caratteristiche Principali

1. **Testo reale vettoriale (DOM / SVG `<text>`) e piena selezionabilità**:
   - Tutte le scritte della mappa (toponimi, sottotitoli, nomi dei fiumi BEGEJ e TISA, titolo e legenda) sono vero testo HTML/SVG.
   - Pienamente **selezionabili col mouse (`cursor: text`, `user-select: text`), ricercabili (`Cmd+F`), accessibili** e scalabili su qualsiasi display ad alta densità (Retina, 4K) senza alcuna sgranatura.

2. **Basemap chiara e luminosa (Stile *Il Post*)**:
   - Superamento delle vecchie basemap raster sgranate e scure.
   - Fondo carta caldo e luminoso (`#f6f2ea`, equivalente a `--land: #f4f2ec` de *Il Post*).
   - Eliminazione delle ombreggiature fangose (hillshade scuro in moltiplicazione) per una resa nitida e tipografica.
   - Tessuto urbano vettoriale (`assets/urban.geojson`) e rete viaria primaria/secondaria vettoriale (`assets/roads.geojson`) derivati da OpenStreetMap.

3. **Idrografia vettoriale a poligoni reali**:
   - Fiumi e bacini d'acqua non sono semplici linee uniformi, bensì **veri poligoni con la loro morfologia geografica** (`assets/water.geojson`):
     - Alveo poligonale del fiume **Begej** con le anse storiche e i meandri urbani; etichetta toponomastica collocata al di sopra del corso d'acqua parallelamente all'asse fluviale, senza coprire la linea d'acqua né toccare la viabilità.
     - Tratto poligonale del fiume **Tisa** sul confine occidentale, con etichetta aderente alla sponda.
     - Bacini delle peschiere storiche di **Ribnjak Ečka** (Belo jezero, Koča jezero, Joca jezero, Mika jezero).
     - Rete delle zone umide della riserva naturale di **Carska Bara**.
     - Laghi urbani di Zrenjanin (Peskara, laghi centrali).
     - Canale navigabile Danubio-Tisa-Danubio (DTD).

4. **Legenda a due colonne ed Inset Map autonoma**:
   - Legenda riorganizzata su **due colonne affiancate** per la massima compattezza ed equilibrio visivo:
     - Colonna sinistra: **Pallino nero** per *Cities and villages* (Zrenjanin e gli 8 villaggi con pin neri e contorno bianco a contrasto) e **Rombo arancione** per *Metito Treatment Plant* (complesso di potabilizzazione).
     - Colonna destra: **Linea teal** per *Rivers and basins* (fiumi Begej e Tisa, bacini urbani, vasche di Ečka e canali).
   - Legenda essenziale senza intestazione "KEY" né dicitura ridondante "Map: CIJI".
   - **Inset map autonoma ingrandita** (`.panel-stack`): presentata in una scheda separata ed elegante direttamente sotto al pannello di testata (`aspect-ratio: 306/200`). Mostra l'intera Serbia nel contesto regionale allargato dei Balcani e dell'Adriatico senza tagli artificiali a ovest (fino a 13.0°E, includendo interamente Slovenia, Croazia con Istria e isole, Bosnia-Erzegovina e mar Adriatico).
   - Tutti i confini internazionali vettoriali sono nitidi e completi, con etichette toponomastiche chiare dotate di alone (`SERBIA`, `HUNGARY`, `ROMANIA`, `BULGARIA`, `BOSNIA & HERZ.`, `CROATIA`, `SLOVENIA`, `MONTENEGRO`, `KOSOVO`, `N. MACEDONIA`) ed evidenziazione in arancione dell'area inquadrata sul territorio della Serbia (senza puntini né toponimi ridondanti per la massima pulizia grafica).

5. **Piena ottimizzazione per dispositivi mobili**:
   - Layout fluido con calcolo automatico della proiezione cartografica (`d3.geoMercator().fitExtent(...)`).
   - Adattamento dinamico su schermi stretti (≤ 700 px): scheda compatta in alto con legenda a due colonne, minimappa a 125 px in basso a sinistra e loghi OBCT/CIJI in basso a destra.

---

## Luoghi e Dati Geografici

Coordinate geografiche WGS84, verificate su OpenStreetMap/Nominatim:

| Luogo / Elemento | Tipo | Coordinate | Descrizione & Ruolo nell'inchiesta |
|---|---|---|---|
| **Zrenjanin** | Città | `45.3836, 20.3819` | Capoluogo della municipalità, pin nero centrale |
| **Metito Treatment Plant** | Impianto | `45.4060, 20.3935` | Complesso di potabilizzazione gestito da Pannonian Water / Metito, pin a rombo arancione |
| **Begej** | Fiume | Poligono fluviale | Asse idrografico su cui si scaricano i reflui, punto focale della crisi ecologica; etichetta collocata al di sopra dell'alveo fluviale |
| **Tisa** | Fiume | Poligono fluviale | Fiume principale a ovest del comune di Zrenjanin |
| **Mihajlovo** | Villaggio | `45.4719, 20.4164` | A nord di Zrenjanin, comunità rurale lungo la direttrice settentrionale |
| **Elemir** | Villaggio | `45.4428, 20.2984` | A nord-ovest, comunità rurale storica |
| **Aradac** | Villaggio | `45.3797, 20.3014` | A ovest di Zrenjanin, verso il fiume Tisa |
| **Klek** | Villaggio | `45.4214, 20.4797` | A est, dove il Begej e il canale DTD entrano nella municipalità |
| **Mužlja** | Quartiere / Villaggio | `45.3484, 20.4041` | Immediatamente a sud di Zrenjanin |
| **Ečka** | Villaggio | `45.3176, 20.4394` | A sud lungo il Begej, sede del castello storico e delle peschiere |
| **Lukino Selo** | Villaggio | `45.3069, 20.4266` | A sud, fra le aree umide e le vasche di acquacoltura |
| **Stajićevo** | Villaggio | `45.2944, 20.4569` | A sud-est lungo il Begej, nei pressi della riserva naturale di Carska Bara |

---

## Struttura del Progetto

```
.
├── index.html                  Mappa principale interattiva/responsive in D3.js
├── map_d3.js                   Motore D3: basemap canvas, vettori SVG (acque, strade, centri, toponimi), inset, scala
├── source/
│   ├── places.js               Dati geografici dei toponimi e coordinate WGS84
│   └── geo_layers.js           Bundle vettoriale compatto ad alte prestazioni (urban, strade, bacini, fiumi e confini Balcani)
├── vendor/
│   ├── d3.min.js               D3.js v7.9.2 (licenza BSD-3-Clause)
│   └── d3-tile.min.js          Plugin ufficiale d3-tile per proiezioni Web Mercator
├── assets/
│   ├── balkans-countries.geojson Dati vettoriali per la minimappa inset
│   ├── water.geojson           Poligoni geografici reali di fiumi e bacini idrici
│   ├── roads.geojson           Tracciati vettoriali della rete stradale
│   ├── urban.geojson           Poligoni del tessuto urbano e rurale
│   ├── fonts/                  Famiglia Montserrat (Regular, Medium, SemiBold, Bold) con licenza OFL
│   └── logos/                  Loghi CIJI e OBCT in alta definizione
├── scripts/
│   ├── check.sh                Script di verifica automatica dell'integrità
│   └── check.py                Controlli di presenza asset, coordinate e struttura DOM
├── favicon.ico                 Favicon
├── robots.txt                  Direttive web crawler
├── ISTRUZIONI_WEBMASTER.md     Guida rapida per pubblicazione e integrazione WordPress
├── zrenjanin-map-webmaster.zip Pacchetto di distribuzione compatto pronto per la produzione (~776 KB)
├── README.md                   Documentazione tecnica del progetto
└── HANDOFF.md                  Note di passaggio di consegne e registro decisioni
```

---

## Come Incorporare e Usare

### 1. Inserimento in un articolo WordPress o CMS (Consigliato)

Ospitare la cartella della mappa come file statici sul server web (es. via FTP/cPanel in `/wp-content/uploads/interactive/zrenjanin-map/` o `/interactive/zrenjanin-map/`) e inserire nell'articolo un blocco **HTML personalizzato**:

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

Regola CSS opzionale per ottimizzare l'altezza su smartphone (da inserire nel CSS del tema WordPress):
```css
@media (max-width: 768px) {
  .ciji-map-wrapper iframe {
    height: 580px !important;
  }
}
```

### 2. Pacchetto per il Webmaster

Per passare tutti i materiali al webmaster è disponibile l'archivio ZIP pronto all'uso:
- **`zrenjanin-map-webmaster.zip`** (~776 KB): contiene tutti i file di produzione (`index.html`, `map_d3.js`, font Montserrat locali, vettori, loghi e dipendenze D3) inclusi nella cartella `zrenjanin-map/`, corredati dal file [`ISTRUZIONI_WEBMASTER.md`](ISTRUZIONI_WEBMASTER.md).

### 3. Esecuzione in locale per sviluppo o anteprima

```bash
python3 -m http.server 8000
# Aprire http://localhost:8000 nel browser
```

---

## Verifica e QA

Per eseguire tutti i test automatici di validazione:
```bash
./scripts/check.sh
```
