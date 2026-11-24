/* Places and geographic features for the Zrenjanin local water crisis map.
   Cartography: Federico Caruso, caruso@balcanicaucaso.org
   Centered on the municipality of Zrenjanin, the Metito water treatment plant,
   the Begej river course, and surrounding villages.
   Coordinates: WGS84 [lat, lon]. */

window.MAP_DATA = {
  bounds: {
    desktop: [[20.238, 45.272], [20.498, 45.482]],
    mobile: [[20.240, 45.275], [20.495, 45.482]]
  },
  center: [20.385, 45.385],

  places: [
    {
      id: 'zrenjanin',
      type: 'city',
      name: 'Zrenjanin',
      ll: [45.3836, 20.3819],
      dir: 'bottom'
    },
    {
      id: 'plant',
      type: 'plant',
      name: 'Metito Treatment Plant',
      name_it: 'Impianto di trattamento Metito',
      ll: [45.4060, 20.3935],
      dir: 'top'
    },
    {
      id: 'mihajlovo',
      type: 'village',
      name: 'Mihajlovo',
      ll: [45.4719, 20.4164],
      dir: 'top'
    },
    {
      id: 'elemir',
      type: 'village',
      name: 'Elemir',
      ll: [45.4428, 20.2984],
      dir: 'left'
    },
    {
      id: 'aradac',
      type: 'village',
      name: 'Aradac',
      ll: [45.3797, 20.3014],
      dir: 'left'
    },
    {
      id: 'klek',
      type: 'village',
      name: 'Klek',
      ll: [45.4214, 20.4797],
      dir: 'right'
    },
    {
      id: 'muzlja',
      type: 'village',
      name: 'Mužlja',
      ll: [45.3484, 20.4041],
      dir: 'left'
    },
    {
      id: 'ecka',
      type: 'village',
      name: 'Ečka',
      ll: [45.3176, 20.4394],
      dir: 'right'
    },
    {
      id: 'lukinoselo',
      type: 'village',
      name: 'Lukino Selo',
      ll: [45.3069, 20.4266],
      dir: 'left'
    },
    {
      id: 'stajicevo',
      type: 'village',
      name: 'Stajićevo',
      ll: [45.2944, 20.4569],
      dir: 'bottom'
    }
  ],

  begej: {
    name: 'Begej',
    line: [
      [20.525, 45.438],
      [20.485, 45.423],
      [20.440, 45.408],
      [20.412, 45.397],
      [20.395, 45.385],
      [20.382, 45.375],
      [20.402, 45.352],
      [20.428, 45.332],
      [20.440, 45.318],
      [20.458, 45.294],
      [20.435, 45.272]
    ]
  }
};
