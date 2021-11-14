import maplibre from 'maplibre-gl';

const basemapSource: maplibre.RasterSource = {
    type: 'raster',
    tiles: ['//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'],
    tileSize: 256,
    attribution:
        'Sources: Esri, HERE, Garmin, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), (c) OpenStreetMap contributors, and the GIS User Community'
};

const basemapLayer: maplibre.RasterLayer = {
    id: 'basemap',
    type: 'raster',
    source: 'basemap',
    minzoom: 0,
    maxzoom: 22
};

export const mapStyle: maplibre.Style = {
    version: 8,
    sources: {
        basemap: basemapSource
    },
    layers: [basemapLayer]
};
