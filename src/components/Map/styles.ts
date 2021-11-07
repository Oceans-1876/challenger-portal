import maplibre from 'maplibre-gl';

import { themeOptions } from '../../theme';

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

export const layerStyles: { [group: string]: { [state: string]: Partial<maplibregl.AnyLayer> } } = {
    stations: {
        default: {
            type: 'circle',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': themeOptions.palette.primary.dark,
                'circle-opacity': 0.7
            }
        },
        selected: {
            // This style depends on `pulsingDot` in `components/Map/utils.ts`
            type: 'symbol',
            layout: {
                'icon-image': 'pulsing-dot'
            }
        },
        clustered: {
            type: 'circle',
            filter: ['has', 'point_count'],
            paint: {
                // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                // with three steps to implement three types of circles:
                //   * #14807c, 15px circles when point count is less than 20
                //   * #32bb39, 20px circles when point count is between 20 and 40
                //   * #98d320, 25px circles when point count is greater than or equal to 40
                'circle-color': ['step', ['get', 'point_count'], '#14807c', 20, '#32bb39', 40, '#98d320'],
                'circle-radius': ['step', ['get', 'point_count'], 15, 20, 20, 40, 25]
            }
        }
    },
    journeyPath: {
        default: {
            type: 'line',
            paint: {
                'line-color': '#5b6969',
                'line-width': 2
            }
        }
    }
};

export const mapStyle: maplibre.Style = {
    version: 8,
    glyphs: `${API_FONTS}/{fontstack}/{range}.pbf`,
    sources: {
        basemap: basemapSource
    },
    layers: [basemapLayer]
};
