import { theme } from '../../theme';

export const layerStyles: { [group: string]: { [state: string]: Partial<maplibregl.LayerSpecification> } } = {
    stations: {
        // `default` and `selected` depend on `loadStationIcons` in `components/Map/utils.ts`
        default: {
            type: 'symbol',
            layout: {
                'icon-image': 'station-icon',
                'icon-anchor': 'bottom',
                'icon-offset': [0, 17],
                'icon-allow-overlap': true
            }
        },
        selected: {
            type: 'symbol',
            layout: {
                'icon-image': 'pulsing-icon',
                'icon-anchor': 'bottom',
                'icon-offset': [0, 17],
                'icon-allow-overlap': true
            }
        },
        name: {
            type: 'symbol',
            layout: {
                'text-field': ['get', 'name'],
                'text-font': ['Roboto Bold'],
                'text-size': 12,
                'text-anchor': 'bottom',
                'text-offset': [0, -2]
                // 'text-allow-overlap': true
            },
            paint: {
                'text-color': theme.palette.explore.main
            }
        },
        clustered: {
            type: 'circle',
            filter: ['has', 'point_count'],
            paint: {
                'circle-radius': 40,
                'circle-color': 'rgba(184, 255, 247, 0.4)',
                'circle-opacity': 0.4,
                'circle-stroke-color': theme.palette.explore.secondary,
                'circle-stroke-opacity': 1,
                'circle-stroke-width': 1
            }
        },
        clusterCount: {
            type: 'symbol',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': ['concat', ['get', 'point_count_abbreviated'], '\nStations'],
                'text-font': ['Roboto Bold'],
                'text-size': 14
            },
            paint: {
                'text-color': theme.palette.explore.secondary
            }
        }
    },
    journeyPath: {
        default: {
            type: 'line',
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': theme.palette.explore.highlight,
                'line-width': 2,
                'line-dasharray': [4, 4]
            }
        }
    },
    faoAreas: {
        default: {
            type: 'line',
            paint: {
                'line-color': '#794c5a',
                'line-opacity': 0.5
            }
        }
    }
};

export const mapStyle: maplibregl.StyleSpecification = {
    version: 8,
    glyphs: `${window.API_FONTS}/{fontstack}/{range}.pbf`,
    sources: {},
    layers: []
};
