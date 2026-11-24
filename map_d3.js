/* D3.js Editorial Map for Zrenjanin Water Crisis
   CIJI / OBCT Editorial Production
   Architecture: HTML5 Canvas (clean paper basemap) + SVG (crisp vector water polygons, roads, urban & selectable text)
*/

(function () {
  'use strict';

  const container = document.getElementById('map-container');
  const canvas = document.getElementById('map-canvas');
  const ctx = canvas.getContext('2d');
  const svg = d3.select('#map-svg');

  const tileCache = new Map();
  let renderScheduled = false;

  const state = {
    width: 0,
    height: 0,
    dpr: window.devicePixelRatio || 1,
    projection: null,
    path: null,
    balkansGeo: null
  };

  /* ----------------------------------------------------------- Tile URLs */
  function tileUrl(type, x, y, z) {
    const wrappedX = (x % (1 << z) + (1 << z)) % (1 << z);
    // CARTO Positron light clean basemap without labels
    return `https://a.basemaps.cartocdn.com/rastertiles/light_nolabels/${z}/${wrappedX}/${y}.png`;
  }

  function getTile(url) {
    let entry = tileCache.get(url);
    if (!entry) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      entry = { img, loaded: false, error: false };
      img.onload = () => {
        entry.loaded = true;
        scheduleRender();
      };
      img.onerror = () => {
        entry.error = true;
      };
      img.src = url;
      tileCache.set(url, entry);
    }
    return entry.loaded ? entry.img : null;
  }

  function scheduleRender() {
    if (renderScheduled) return;
    renderScheduled = true;
    requestAnimationFrame(() => {
      renderScheduled = false;
      drawCanvas();
    });
  }

  /* ----------------------------------------------------------- Canvas Basemap */
  function drawCanvas() {
    const w = state.width;
    const h = state.height;
    if (!w || !h || !state.projection) return;

    ctx.save();
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    // Warm, luminous paper background matching Il Post editorial palette (--land: #f6f2ea)
    ctx.fillStyle = '#f6f2ea';
    ctx.fillRect(0, 0, w, h);

    // Keep d3.tile generator initialized for projection metrics
    const k = state.projection.scale() * 2 * Math.PI;
    const [tx, ty] = state.projection([0, 0]);
    const tileGen = d3.tile()
      .size([w, h])
      .scale(k)
      .translate([tx, ty]);
    const tiles = tileGen();

    ctx.restore();
  }

  /* ----------------------------------------------------------- SVG Vector Overlay */
  function drawSvg() {
    if (!state.projection) return;
    svg.selectAll('*').remove();

    const path = d3.geoPath().projection(state.projection);
    state.path = path;

    const defs = svg.append('defs');

    // Filter for pin shadow
    const filter = defs.append('filter')
      .attr('id', 'pin-shadow')
      .attr('x', '-30%').attr('y', '-30%')
      .attr('width', '160%').attr('height', '160%');
    filter.append('feDropShadow')
      .attr('dx', '0').attr('dy', '1.5')
      .attr('stdDeviation', '1.5')
      .attr('flood-color', '#141918')
      .attr('flood-opacity', '0.28');

    // 1. Layer Urban Built-up Areas
    if (window.MAP_GEO && window.MAP_GEO.urban) {
      const gUrban = svg.append('g').attr('class', 'layer-urban');
      gUrban.selectAll('path')
        .data(window.MAP_GEO.urban.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#ebe3d5')
        .attr('fill-opacity', 0.70)
        .attr('stroke', 'none');
    }

    // 2. Layer Roads
    if (window.MAP_GEO && window.MAP_GEO.roads) {
      const gRoads = svg.append('g').attr('class', 'layer-roads');
      gRoads.selectAll('path')
        .data(window.MAP_GEO.roads.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', d => (d.properties && d.properties.class === 'primary') ? '#c5beb0' : '#ded9cc')
        .attr('stroke-width', d => (d.properties && d.properties.class === 'primary') ? 1.4 : 0.85)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-opacity', 0.95);
    }

    // 3. Layer Water Polygons & Basins (Polygons with their real geometric shape)
    if (window.MAP_GEO && window.MAP_GEO.water) {
      const gWater = svg.append('g').attr('class', 'layer-water');

      // Draw all water bodies (lakes, fishponds, reservoirs, canals, river polygons)
      gWater.selectAll('path.water-poly')
        .data(window.MAP_GEO.water.features)
        .enter()
        .append('path')
        .attr('class', d => `water-poly water-${d.id || 'body'}`)
        .attr('d', path)
        .attr('fill', d => (d.id === 'begej_river') ? '#cfe4e6' : '#cfe4e6')
        .attr('fill-opacity', 0.96)
        .attr('stroke', d => (d.id === 'begej_river') ? '#2b7583' : '#358b9a')
        .attr('stroke-width', d => (d.id === 'begej_river') ? 0.9 : 0.65)
        .attr('stroke-linejoin', 'round');
    }

    // 4. Layer Water Labels (BEGEJ, TISA)
    const gWaterLabels = svg.append('g').attr('class', 'layer-water-labels');

    // BEGEJ River label oriented along the river course, placed above the river line
    const pB1 = state.projection([20.408, 45.356]);
    const pB2 = state.projection([20.418, 45.346]);
    if (pB1 && pB2) {
      let angle = Math.atan2(pB2[1] - pB1[1], pB2[0] - pB1[0]) * 180 / Math.PI;
      if (angle > 90) angle -= 180;
      if (angle < -90) angle += 180;

      const begejLbl = gWaterLabels.append('g')
        .attr('transform', `translate(${(pB1[0] + pB2[0]) / 2}, ${(pB1[1] + pB2[1]) / 2}) rotate(${angle})`);

      begejLbl.append('text')
        .attr('class', 'lbl-water lbl-begej')
        .attr('text-anchor', 'middle')
        .attr('dy', '-8')
        .attr('cursor', 'text')
        .text('BEGEJ');
    }

    // TISA River label hugging the river line along the west border
    const pT1 = state.projection([20.203, 45.390]);
    const pT2 = state.projection([20.210, 45.370]);
    if (pT1 && pT2) {
      let angle = Math.atan2(pT2[1] - pT1[1], pT2[0] - pT1[0]) * 180 / Math.PI;
      if (angle > 90) angle -= 180;
      if (angle < -90) angle += 180;

      const tisaLbl = gWaterLabels.append('g')
        .attr('transform', `translate(${(pT1[0] + pT2[0]) / 2}, ${(pT1[1] + pT2[1]) / 2}) rotate(${angle})`);

      tisaLbl.append('text')
        .attr('class', 'lbl-water lbl-tisa')
        .attr('text-anchor', 'middle')
        .attr('dy', '-7')
        .attr('cursor', 'text')
        .text('TISA');
    }

    // 5. Places & Pins
    const gPins = svg.append('g').attr('class', 'layer-pins');
    const gLabels = svg.append('g').attr('class', 'layer-labels');
    const places = window.MAP_DATA.places || [];

    places.forEach(p => {
      const pt = state.projection([p.ll[1], p.ll[0]]);
      if (!pt) return;
      const [x, y] = pt;

      const gPin = gPins.append('g')
        .attr('class', `pin-group pin-${p.type}`)
        .attr('transform', `translate(${x}, ${y})`)
        .attr('filter', 'url(#pin-shadow)');

      const gLabel = gLabels.append('g')
        .attr('class', `label-group label-${p.type}`)
        .attr('transform', `translate(${x}, ${y})`);

      // Pin shape: Solid black dots for City and Villages, Orange diamond for Metito Plant
      if (p.type === 'city') {
        gPin.append('circle')
          .attr('r', 5.5)
          .attr('fill', '#141918')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2);
      } else if (p.type === 'plant') {
        gPin.append('rect')
          .attr('x', -5).attr('y', -5)
          .attr('width', 10).attr('height', 10)
          .attr('rx', 1.5)
          .attr('transform', 'rotate(45)')
          .attr('fill', '#f26b21')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2);
      } else {
        // Village (black dot matching legend)
        gPin.append('circle')
          .attr('r', 3.8)
          .attr('fill', '#141918')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1.6);
      }

      // Label positioning
      let dx = 0;
      let dy = 0;
      let anchor = 'start';

      if (p.dir === 'bottom') {
        dx = 0; dy = p.type === 'city' ? 14 : 11;
        anchor = 'middle';
      } else if (p.dir === 'top') {
        dx = 0; dy = p.type === 'plant' ? -12 : -10;
        anchor = 'middle';
      } else if (p.dir === 'left') {
        dx = p.type === 'plant' ? -12 : -8;
        dy = 3.5;
        anchor = 'end';
      } else {
        // right (default)
        dx = p.type === 'plant' ? 12 : 8;
        dy = 3.5;
        anchor = 'start';
      }

      // Name Text (fully selectable with mouse cursor)
      gLabel.append('text')
        .attr('class', 'lbl-name')
        .attr('x', dx)
        .attr('y', dy)
        .attr('text-anchor', anchor)
        .attr('cursor', 'text')
        .attr('pointer-events', 'auto')
        .text(p.name);

      // Subtitle Text (if present)
      if (p.sub) {
        gLabel.append('text')
          .attr('class', 'lbl-sub')
          .attr('x', dx)
          .attr('y', dy + (p.dir === 'bottom' ? 10 : 9))
          .attr('text-anchor', anchor)
          .attr('cursor', 'text')
          .attr('pointer-events', 'auto')
          .text(p.sub);
      }
    });
  }

  /* ----------------------------------------------------------- Inset Locator Map */
  function drawInset() {
    const insetSvg = d3.select('#inset-svg');
    if (insetSvg.empty() || !state.balkansGeo) return;
    insetSvg.selectAll('*').remove();

    const iw = 306;
    const ih = 200;

    const insetProj = d3.geoMercator()
      .fitExtent(
        [[6, 6], [iw - 6, ih - 6]],
        {
          type: 'MultiPoint',
          coordinates: [
            [13.0, 41.0],
            [25.2, 47.5]
          ]
        }
      );

    const insetPath = d3.geoPath().projection(insetProj);

    // 1. Countries
    const gCountries = insetSvg.append('g').attr('class', 'inset-countries');

    gCountries.selectAll('path')
      .data(state.balkansGeo.features)
      .enter()
      .append('path')
      .attr('d', insetPath)
      .attr('fill', d => {
        const name = d.properties && d.properties.name;
        const iso = d.properties && d.properties.iso;
        const isSerbia = (iso === 'SRB' || name === 'Republic of Serbia' || name === 'Serbia');
        return isSerbia ? '#f6efe3' : '#eae4d8';
      })
      .attr('stroke', d => {
        const name = d.properties && d.properties.name;
        const iso = d.properties && d.properties.iso;
        const isSerbia = (iso === 'SRB' || name === 'Republic of Serbia' || name === 'Serbia');
        return isSerbia ? '#685949' : '#8f8476';
      })
      .attr('stroke-width', d => {
        const name = d.properties && d.properties.name;
        const iso = d.properties && d.properties.iso;
        const isSerbia = (iso === 'SRB' || name === 'Republic of Serbia' || name === 'Serbia');
        return isSerbia ? 1.3 : 0.75;
      })
      .attr('stroke-linejoin', 'round');

    // 2. Country name labels
    const countryLabels = [
      { name: 'SERBIA', ll: [43.95, 20.85], size: 8.5, weight: 700, color: '#141918', isSerbia: true },
      { name: 'HUNGARY', ll: [46.85, 19.30], size: 7.0, weight: 600, color: '#5c605c' },
      { name: 'ROMANIA', ll: [45.65, 23.40], size: 7.0, weight: 600, color: '#5c605c' },
      { name: 'BULGARIA', ll: [42.85, 24.20], size: 7.0, weight: 600, color: '#5c605c' },
      { name: 'BOSNIA & HERZ.', ll: [44.15, 17.80], size: 6.2, weight: 600, color: '#5c605c' },
      { name: 'CROATIA', ll: [45.55, 16.30], size: 6.2, weight: 600, color: '#5c605c' },
      { name: 'SLOVENIA', ll: [46.15, 14.70], size: 5.8, weight: 600, color: '#5c605c' },
      { name: 'MONTENEGRO', ll: [42.75, 18.95], size: 5.8, weight: 600, color: '#5c605c' },
      { name: 'KOSOVO', ll: [42.50, 20.85], size: 5.8, weight: 600, color: '#5c605c' },
      { name: 'N. MACEDONIA', ll: [41.65, 21.65], size: 5.8, weight: 600, color: '#5c605c' }
    ];

    const gLabels = insetSvg.append('g').attr('class', 'inset-labels');
    countryLabels.forEach(lbl => {
      const pt = insetProj([lbl.ll[1], lbl.ll[0]]);
      if (!pt) return;
      gLabels.append('text')
        .attr('x', pt[0])
        .attr('y', pt[1])
        .attr('text-anchor', 'middle')
        .attr('font-size', `${lbl.size}px`)
        .attr('font-weight', lbl.weight)
        .attr('fill', lbl.color)
        .attr('letter-spacing', lbl.isSerbia ? '0.12em' : '0.08em')
        .attr('stroke', lbl.isSerbia ? '#f6efe3' : '#eae4d8')
        .attr('stroke-width', 2.4)
        .attr('paint-order', 'stroke fill')
        .text(lbl.name);
    });

    // 3. Highlight the framed area of Zrenjanin on the Serbian territory
    const pad = state.width <= 700
      ? { top: 90, right: 16, bottom: 40, left: 16 }
      : { top: 40, right: 30, bottom: 40, left: 330 };

    let nw = (state.projection && state.width) ? state.projection.invert([pad.left, pad.top]) : null;
    let se = (state.projection && state.width) ? state.projection.invert([state.width - pad.right, state.height - pad.bottom]) : null;

    if (!nw || !se) {
      const b = (window.MAP_DATA && window.MAP_DATA.bounds) ? window.MAP_DATA.bounds.desktop : [[20.23, 45.27], [20.51, 45.49]];
      nw = [b[0][0], b[1][1]];
      se = [b[1][0], b[0][1]];
    }

    const pNW = insetProj(nw);
    const pSE = insetProj(se);

    if (pNW && pSE) {
      const rx = Math.min(pNW[0], pSE[0]);
      const ry = Math.min(pNW[1], pSE[1]);
      const rw = Math.max(Math.abs(pSE[0] - pNW[0]), 15);
      const rh = Math.max(Math.abs(pSE[1] - pNW[1]), 12);

      // Framed Area Rectangle
      insetSvg.append('rect')
        .attr('x', rx)
        .attr('y', ry)
        .attr('width', rw)
        .attr('height', rh)
        .attr('fill', 'rgba(242, 107, 33, 0.32)')
        .attr('stroke', '#f26b21')
        .attr('stroke-width', 1.8)
        .attr('rx', 1.5);
    }
  }

  /* ----------------------------------------------------------- Scale Bar */
  function updateScale() {
    const bar = document.getElementById('scale-bar');
    const label = document.getElementById('scale-label');
    if (!bar || !label || !state.projection) return;

    const p0 = state.projection.invert([state.width / 2, state.height / 2]);
    const p1 = state.projection.invert([state.width / 2 + 100, state.height / 2]);
    if (!p0 || !p1) return;

    // Haversine distance for 100 pixels
    const lat1 = p0[1] * Math.PI / 180;
    const lat2 = p1[1] * Math.PI / 180;
    const dLon = (p1[0] - p0[0]) * Math.PI / 180;
    const R = 6371; // km
    const d = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon)) * R;
    const kmPerPx = d / 100;

    let targetKm = 2;
    if (kmPerPx * 100 > 6) targetKm = 5;
    if (kmPerPx * 100 > 15) targetKm = 10;
    const targetPx = Math.round(targetKm / kmPerPx);

    bar.style.width = targetPx + 'px';
    label.textContent = targetKm + ' km';
  }

  /* ----------------------------------------------------------- Resize & Projection */
  function resize() {
    const rect = container.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (w <= 0 || h <= 0) return;

    state.width = w;
    state.height = h;
    state.dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(w * state.dpr);
    canvas.height = Math.round(h * state.dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    svg.attr('viewBox', `0 0 ${w} ${h}`)
       .attr('width', w)
       .attr('height', h);

    const isMobile = w <= 700;
    const bounds = isMobile ? window.MAP_DATA.bounds.mobile : window.MAP_DATA.bounds.desktop;
    const [[wLon, sLat], [eLon, nLat]] = bounds;

    // Generous padding so cards don't obstruct core content
    const pad = isMobile
      ? { top: 90, right: 16, bottom: 40, left: 16 }
      : { top: 40, right: 30, bottom: 40, left: 330 };

    state.projection = d3.geoMercator();
    state.projection.fitExtent(
      [[pad.left, pad.top], [w - pad.right, h - pad.bottom]],
      {
        type: 'MultiPoint',
        coordinates: [[wLon, sLat], [eLon, nLat]]
      }
    );

    drawCanvas();
    drawSvg();
    drawInset();
    updateScale();
  }

  /* ----------------------------------------------------------- Initialization */
  function init() {
    // Load Inset GeoJSON from bundled MAP_GEO (synchronous & works on file://) or fetch fallback
    if (window.MAP_GEO && window.MAP_GEO.balkans) {
      state.balkansGeo = window.MAP_GEO.balkans;
    } else if (typeof fetch !== 'undefined') {
      fetch('assets/balkans-countries.geojson')
        .then(res => res.json())
        .then(geo => {
          state.balkansGeo = geo;
          drawInset();
        })
        .catch(err => console.warn('Could not load Balkans geojson:', err));
    }

    window.addEventListener('resize', () => {
      resize();
    });

    document.fonts.ready.then(() => {
      resize();
    });

    resize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
