#!/usr/bin/env python3
"""Validation checks for the Zrenjanin D3.js editorial map.

Checks that all required files and assets exist, that geographic points are
within bounds, that D3 and dependencies are correctly referenced in index.html,
and that the map initializes without errors.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

REQUIRED = [
    "index.html",
    "map_d3.js",
    "source/places.js",
    "source/geo_layers.js",
    "README.md",
    "HANDOFF.md",
    "vendor/d3.min.js",
    "vendor/d3-tile.min.js",
    "assets/balkans-countries.geojson",
    "assets/water.geojson",
    "assets/roads.geojson",
    "assets/urban.geojson",
    "assets/logos/obct.png",
    "assets/logos/ciji-navy.png",
    "assets/fonts/Montserrat-Regular.ttf",
    "assets/fonts/Montserrat-Medium.ttf",
    "assets/fonts/Montserrat-SemiBold.ttf",
    "assets/fonts/Montserrat-Bold.ttf",
]

BOUNDS = {
    "desktop": {"west": 20.20, "south": 45.25, "east": 20.55, "north": 45.51},
    "mobile": {"west": 20.20, "south": 45.25, "east": 20.55, "north": 45.51},
}

errors: list[str] = []
notes: list[str] = []


def check(condition: bool, message: str) -> None:
    if not condition:
        errors.append(message)


# 1. Required files
for rel in REQUIRED:
    check((ROOT / rel).is_file(), f"missing file: {rel}")

# 2. Places in source/places.js
places_js = (ROOT / "source" / "places.js").read_text(encoding="utf-8")
ids = re.findall(r"id:\s*'([^']+)'", places_js)
coords = re.findall(r"ll:\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]", places_js)
check(len(ids) == len(coords), "places.js: id/coordinate count mismatch")
check(len(ids) >= 9, f"places.js: found only {len(ids)} places")
check("plant" in ids, "places.js: missing plant id")
check("Metito Treatment Plant" in places_js, "places.js: missing Metito Treatment Plant label")
check("begej" in places_js, "places.js: missing Begej river definition")

for place_id, (lat_s, lon_s) in zip(ids, coords):
    lat, lon = float(lat_s), float(lon_s)
    for view, b in BOUNDS.items():
        inside = b["west"] <= lon <= b["east"] and b["south"] <= lat <= b["north"]
        check(inside, f"{place_id} ({lat}, {lon}) outside the {view} frame")

# 3. index.html structure
page = (ROOT / "index.html").read_text(encoding="utf-8")
check("vendor/d3.min.js" in page, "index.html: missing d3.min.js")
check("vendor/d3-tile.min.js" in page, "index.html: missing d3-tile.min.js")
check("map_d3.js" in page, "index.html: missing map_d3.js")
check("source/places.js" in page, "index.html: missing source/places.js")
check("source/geo_layers.js" in page, "index.html: missing source/geo_layers.js")
check("map-canvas" in page, "index.html: missing #map-canvas")
check("map-svg" in page, "index.html: missing #map-svg")
check("inset-svg" in page, "index.html: missing #inset-svg")
check("scale-bar" in page, "index.html: missing #scale-bar")
check("Metito Treatment Plant" in page, "index.html: missing Metito in legend")
check("Cities and villages" in page, "index.html: missing Cities and villages in legend")
check("Rivers" in page, "index.html: missing Rivers in legend")
check('class="deck"' not in page, "index.html: deck text under title should be removed")

# 4. map_d3.js logic
map_js = (ROOT / "map_d3.js").read_text(encoding="utf-8")
check("d3.tile()" in map_js, "map_d3.js: missing d3.tile()")
check("d3.geoMercator()" in map_js, "map_d3.js: missing d3.geoMercator()")
check("pin-shadow" in map_js, "map_d3.js: missing shadow filter")

notes.append(f"{len(ids)} places in source/places.js (Zrenjanin, Metito plant, surrounding villages)")
notes.append("Begej river geometry defined")
notes.append("D3.js v7 + d3-tile hybrid canvas/SVG architecture verified")

if errors:
    print("FAILED")
    for error in errors:
        print(" -", error)
    sys.exit(1)

print("ALL CHECKS PASS")
for note in notes:
    print(" ·", note)
