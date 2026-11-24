# HANDOFF — Mappa Zrenjanin (D3.js Edition)

## Obiettivo

Mappa editoriale responsiva in inglese per l’inchiesta giornalistica CIJI/OBCT **“Safe to Drink, Hard to Trust: Zrenjanin’s Water Crisis Is Far from Over”**.
La mappa illustra la crisi idrica di Zrenjanin focalizzandosi sull'impianto di potabilizzazione **"Metito Treatment Plant"**, sul corso del fiume **Begej**, sui bacini idrici della municipalità e sugli 8 villaggi circostanti.

---

## Cronologia delle Versioni e Decisioni Tecniche

### Fase 1 — Versione iniziale statica (11-11-2026)
- Creata come mappa puramente statica a livello macro-regionale (Vojvodina, Danubio, Novi Sad, Belgrado, Kovin, Titel).
- Basata su MapLibre GL JS + CARTO Positron + Playwright (`scripts/shoot.py`) per esportare 12 immagini raster (JPG, WebP, PNG a 1× e 2×).
- La posizione dell'impianto era provvisoria e approssimata a nord-ovest della città.

### Fase 2 — Verifica coordinate reali dell'impianto (18-11-2026)
- Su richiesta della redazione, verificate le coordinate dell'impianto: la posizione reale corrisponde a **`45°24'21.7"N 20°23'36.7"E`** (`45.4060, 20.3935`), ovvero il complesso della *Fabrika vode* su **Mihajlovački drum 10**, a nord del centro cittadino.

### Fase 3 — Migrazione a D3.js e inquadratura locale (18-11-2026)
- Migrazione iniziale a D3.js v7 con architettura mista Canvas + SVG.

### Fase 4 — Allineamento agli standard de Il Post, Idrografia a poligoni, Selezione mouse e Semplificazione legenda (18-11-2026)
- **Richieste della redazione**:
  1. *Semplificazione della legenda*: pallino nero unificato per "Cities and villages", eliminazione del testo sottotitolo sotto al titolo, associazione della voce "Rivers" alla linea dei fiumi.
  2. *Testo pienamente selezionabile col mouse*: rimozione di `user-select: none`, abilitazione di `pointer-events: auto !important` e `user-select: text !important` con `cursor: text` su tutti i toponimi e scritte toponomastiche, permettendo selezione, doppio clic e copia.
  3. *Miglioramento della basemap (Riferimento Il Post)*: eliminazione delle sgranature e della patina scura/grigia dovuta a hillshade raster e watermark. Passaggio a un'estetica chiara e luminosa con tono carta caldo (`#f6f2ea`, omologo a `--land: #f4f2ec` de *Il Post*).
  4. *Idrografia vettoriale a poligoni con la loro forma reale*: superamento della linea uniforme per il Begej. Integrazione dei poligoni completi OpenStreetMap per l'alveo del Begej, del fiume Tisa a ovest, dei bacini di pesca di Ribnjak Ečka (Belo jezero, ecc.), delle aree umide di Carska Bara, dei laghi urbani di Zrenjanin e del canale DTD.
- **Implementazione tecnica**:
  - `assets/water.geojson` & `source/geo_layers.js`: idrografia poligonale geometricamente accurata, rete viaria primaria/secondaria vettoriale e perimetri del tessuto urbano.
  - Caricamento sincrono istantaneo senza latenza di rete o problemi di CORS.
  - Test automatici di integrità estesi e superati (`ALL CHECKS PASS`).

### Fase 5 — Zoom-in, Inset Map regionale con confini/nomi, pulizia legenda e toponimi (18-11-2026)
- **Richieste della redazione**:
  1. *Zoom-in dell'inquadratura*: inquadratura più ravvicinata e dettagliata della municipalità di Zrenjanin.
  2. *Pulizia legenda*: rimozione del titolo "KEY" e della dicitura "Map: CIJI".
  3. *Ingrandimento Inset Map*: sfruttamento dello spazio sottostante la legenda per integrare un'inset map ingrandita (~264×210 px).
  4. *Ripristino e contesto Inset Map*: l'inset map non è più vuota ed è caricata sincronicamente (anche via `file://`). Mostra l'intera Serbia nel contesto regionale con i confini vettoriali dei paesi circostanti (Hungary, Romania, Bulgaria, North Macedonia, Kosovo, Montenegro, Bosnia & Herz., Croatia), le rispettive etichette toponomastiche con alone ad alta leggibilità, e l'evidenziazione dell'area inquadrata con rettangolo arancione, pin e toponimo Zrenjanin.
  5. *Pulizia mappa*: rimozione dei testi descrittivi secondari "Mihajlovački drum" (sotto Metito Plant) e "67,000 residents" (sotto Zrenjanin).
- **Esito test**: `ALL CHECKS PASS`.

### Fase 6 — Separazione Inset Map, Confini Balcani completi, Legenda a due colonne e Riposizionamento Tisa (18-11-2026)
- **Richieste della redazione**:
  1. *Separazione Inset Map*: l'inset map è ora una card autonoma posizionata sotto il pannello di testata/legenda, perfettamente allineata e strutturalmente distinta dalla legenda.
  2. *Correzione taglio paesi a sinistra*: rigenerati i poligoni vettoriali dei Balcani senza il precedente taglio a 16.0°E (`assets/balkans-countries.geojson` e `source/geo_layers.js`). La proiezione dell'inset map mostra ora per intero Slovenia, Croazia (costa, Istria e isole), Bosnia-Erzegovina e il mar Adriatico, senza interruzioni artificiali dei confini.
  3. *Rimozione dicitura "Zrenjanin in Serbia"*: rimossa la didascalia sotto l'inset map; il riferimento geografico rimane chiaro e pulito grazie al marker e al toponimo Zrenjanin direttamente sulla mappa.
  4. *Legenda su due colonne*: elementi riorganizzati su 2 colonne:
     - Colonna sinistra: `Cities and villages` e `Metito Treatment Plant`.
     - Colonna destra: `Rivers and basins`.
  5. *Voce "Rivers and basins"*: aggiornata la dicitura da "Rivers" a "Rivers and basins", riflettendo con precisione sia i fiumi (Begej, Tisa) che i bacini (laghi urbani, vasche di Ečka e canali DTD).
  6. *Avvicinamento toponimo TISA*: spostata la scritta "TISA" adiacente alla linea di sponda del fiume Tisa (lat 45.38), orientata lungo il corso d'acqua, rendendo immediatamente chiaro che si riferisce al fiume a ovest di Zrenjanin.
- **Esito test**: `ALL CHECKS PASS`.

### Fase 7 — Riposizionamento etichetta Begej e pulizia Inset Map (18-11-2026)
- **Richieste della redazione**:
  1. *Riposizionamento etichetta del fiume Begej al di sopra del corso d'acqua*: l'etichetta toponomastica `BEGEJ` è stata collocata sul lato superiore (nord-est) del fiume lungo il tratto diagonale di fronte a Mužlja (`[20.408, 45.356]` → `[20.418, 45.346]`, `dy: -8`), orientata parallelamente all'alveo. La scritta si trova al di sopra del fiume e non copre la linea d'acqua né tocca la viabilità secondaria, garantendo piena leggibilità sia su desktop che su mobile.
  2. *Pulizia Inset Map*: rimossi il puntino rosso/arancione e la scritta "Zrenjanin" dall'inset map, lasciando unicamente il rettangolo di inquadratura arancione sul territorio della Serbia, ottenendo una minimappa di localizzazione regionale più pulita, elegante ed essenziale.
- **Esito test**: `ALL CHECKS PASS`.

### Fase 8 — Pulizia file obsoleti, hardening iframe, pacchetto di distribuzione per il webmaster e guida WordPress (18-11-2026)
- **Hardening per embedding in iFrame**:
  - Aggiornato `#map-container` in `index.html` da `100vw`/`100vh` a `100%`/`100%`, prevenendo problemi di calcolo scrollbar o jitter su Safari/iOS all'interno di un tag `<iframe>`.
- **Pulizia del repository**:
  - Rimossi 16 screenshot di debug temporanei (`above_*.png`).
  - Rimossi file obsoleti della vecchia implementazione MapLibre Fase 1 (`render/`, `index_static.html`, `scripts/shoot.py`, `vendor/maplibre-gl.js`, `vendor/maplibre-gl.css`, `assets/maps/`).
  - Rimossi metadati di sistema e cache (`.DS_Store`, `scripts/__pycache__`).
  - Preservato e messo al sicuro il documento con il testo originale dell'inchiesta (`‘Safe to Drink’, Hard to Trust_ Zrenjanin’s Water Crisis Is Far from Over.docx`).
- **Preparazione pacchetto Webmaster e documentazione WordPress**:
  - Generato l'archivio compatto e autoconsistente [`zrenjanin-map-webmaster.zip`](zrenjanin-map-webmaster.zip) (~776 KB, 23 file estratti nella cartella autonoma `zrenjanin-map/`) pronto per il caricamento su server web, hosting o CDN.
  - Creata la guida tecnica dettagliata [`ISTRUZIONI_WEBMASTER.md`](ISTRUZIONI_WEBMASTER.md) con gli step completi per l'integrazione su WordPress (FTP, Gutenberg, iframe responsive, CSS per mobile).
  - Aggiornato [`README.md`](README.md) con la nuova struttura del repository e i parametri di incorporamento iframe.
- **Esito test**: `ALL CHECKS PASS`.

---

## Stato Attuale del Repository

- **File principale**: [`index.html`](index.html) ospita la mappa D3 responsiva con layout a stack (`.panel-stack`):
  - Scheda testata e legenda a 2 colonne (`Cities and villages`, `Metito Treatment Plant`, `Rivers and basins`).
  - Scheda autonoma per l'inset map ingrandita (`aspect-ratio: 306/200`), con adattamento responsive a 125 px ancorato in basso a sinistra su dispositivi mobili.
  - Testo SVG vettoriale accessibile e selezionabile con il cursore.
- **Motore D3**: [`map_d3.js`](map_d3.js) gestisce:
  - Basemap Canvas in tono carta luminoso (`#f6f2ea`).
  - Overlay SVG con idrografia a poligoni reali (Begej, Tisa, laghi e peschiere di Ečka).
  - Toponimo TISA aderente alla sponda occidentale lungo il corso fluviale; toponimo BEGEJ collocato al di sopra del fiume parallelamente all'alveo senza sovrapporsi alla linea d'acqua.
  - Inset map completa con proiezione estesa fino a 13.0°E (Slovenia, Croazia, Bosnia, Serbia e Adriatico), confini vettoriali continui, toponimi nazionali con alone protettivo e riquadro di inquadratura arancione pulito ed essenziale (senza puntini né toponimi secondari).
  - Calcolo dinamico della barra di scala in km.
- **Dati geografici**:
  - [`source/places.js`](source/places.js): 10 toponimi verificati con inquadratura zoomata sui confini comunali (`desktop: [[20.238, 45.272], [20.498, 45.482]]`) e toponimi puliti (senza sottotitoli descrittivi secondari).
  - [`source/geo_layers.js`](source/geo_layers.js): bundle vettoriale sincrono compatto con perimetri urbani, rete viaria, idrografia poligonale e confini balcanici per caricamento istantaneo offline e via `file://`.
  - [`assets/water.geojson`](assets/water.geojson): poligoni idrografici completi OpenStreetMap.
  - [`assets/balkans-countries.geojson`](assets/balkans-countries.geojson): confini geopolitici completi per i Balcani e l'Adriatico.
- **Script di test**: `./scripts/check.sh` aggiornato per validare la nuova struttura.
- **Esito test**: `ALL CHECKS PASS`.

---

## Come Eseguire i Controlli

```bash
./scripts/check.sh
```

Verifica:
1. Presenza di tutti i file necessari (HTML, JS, GeoJSON, loghi, font Montserrat).
2. Correttezza delle coordinate geografiche nei bounding box consentiti.
3. Integrità della struttura DOM di `index.html` (presenza di "Cities and villages", "Rivers", assenza del deck).
4. Riferimenti a `d3.tile()`, `d3.geoMercator()` e filtri ombra in `map_d3.js`.
