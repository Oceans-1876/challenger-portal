import React, { FC, useContext, useEffect, useRef } from 'react';
import maplibre from 'maplibre-gl';
import { Box } from '@mui/material';
import * as turf from '@turf/turf';
import { IS_WEBGL_SUPPORTED, runWhenReady } from '@app/components/Map/utils';
import { theme } from '@app/theme';
import { MapContext, MapStateContext } from '@app/store/contexts';
import { BASEMAPS, INITIAL_BASEMAP } from '@app/components/Explore/basemapConfig';

const InsetMap: FC = () => {
    const insetMapContainerRef = useRef<HTMLDivElement>(null);
    const insetMapRef = useRef<maplibregl.Map | null>(null);
    const mainMapRef = useContext(MapContext);
    const { activeBasemap } = useContext(MapStateContext);

    useEffect(() => {
        if (IS_WEBGL_SUPPORTED && insetMapContainerRef.current) {
            const insetMap = new maplibre.Map({
                container: insetMapContainerRef.current,
                style: { version: 8, sources: {}, layers: [] },
                bounds: [-180, -90, 180, 90],
                interactive: false
            });

            insetMap.on('load', () => {
                BASEMAPS.forEach(({ id, tiles, sourceExtraParams, layerExtraParams }) => {
                    insetMap.addSource(id, {
                        ...sourceExtraParams,
                        attribution: '',
                        type: 'raster',
                        tiles
                    });
                    insetMap.addLayer({
                        ...layerExtraParams,
                        id,
                        source: id,
                        type: 'raster'
                    });
                    insetMap.setLayoutProperty(id, 'visibility', id === INITIAL_BASEMAP ? 'visible' : 'none');
                });

                insetMap.addSource('extent', {
                    type: 'geojson',
                    data: turf.polygon([])
                });

                insetMap.addSource('shadow', {
                    type: 'geojson',
                    data: turf.polygon([])
                });

                insetMap.addLayer({
                    id: 'shadow',
                    source: 'shadow',
                    type: 'fill',
                    paint: {
                        'fill-color': 'black',
                        'fill-opacity': 0.4
                    }
                } as maplibregl.FillLayerSpecification);

                insetMap.addLayer({
                    id: 'extent-indicator',
                    source: 'extent',
                    type: 'line',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': theme.palette.explore.secondary,
                        'line-width': 4
                    }
                } as maplibregl.LineLayerSpecification);

                insetMapRef.current = insetMap;
            });
        }

        return () => {
            insetMapRef.current?.remove();
        };
    }, []);

    const mainMap = mainMapRef.current;
    const insetMap = insetMapRef.current;

    useEffect(() => {
        if (insetMap) {
            runWhenReady(insetMap, () => {
                BASEMAPS.forEach(({ id }) => {
                    insetMap.setLayoutProperty(id, 'visibility', id === activeBasemap ? 'visible' : 'none');
                });
            });
        }
    }, [activeBasemap, insetMap]);

    useEffect(() => {
        if (mainMap && insetMap) {
            const syncInsetMap = () => {
                const bounds = mainMap.getBounds();

                const extentCoords =
                    bounds.getEast() - bounds.getWest() >= 360
                        ? [
                              [-180, bounds.getNorth()],
                              [180, bounds.getNorth()],
                              [180, bounds.getSouth()],
                              [-180, bounds.getSouth()],
                              [-180, bounds.getNorth()]
                          ]
                        : [
                              bounds.getNorthWest().toArray(),
                              bounds.getNorthEast().toArray(),
                              bounds.getSouthEast().toArray(),
                              bounds.getSouthWest().toArray(),
                              bounds.getNorthWest().toArray()
                          ];

                const extent =
                    turf.union(
                        turf.union(
                            turf.polygon([extentCoords.map(([lng, lat]) => [lng - 360, lat])]),
                            turf.polygon([extentCoords.map(([lng, lat]) => [lng + 360, lat])])
                        ) ?? turf.polygon([]),
                        turf.polygon([extentCoords])
                    ) ?? turf.polygon([]);

                const shadow =
                    turf.difference(
                        turf.polygon([
                            [
                                [-180, 90],
                                [180, 90],
                                [180, -90],
                                [-180, -90],
                                [-180, 90]
                            ]
                        ]),
                        extent
                    ) ?? turf.polygon([]);

                const extentSource = insetMap.getSource('extent');
                if (extentSource) {
                    (extentSource as maplibregl.GeoJSONSource).setData(extent);
                }

                const shadowSource = insetMap.getSource('shadow');
                if (shadowSource) {
                    (shadowSource as maplibregl.GeoJSONSource).setData(shadow);
                }
            };

            mainMap.on('move', syncInsetMap);
            mainMap.on('zoom', syncInsetMap);
        }
    }, [mainMap, insetMap]);

    return (
        <Box
            sx={{
                width: 200,
                height: 200,
                border: '1px solid white',
                pointerEvents: 'all'
            }}
            ref={insetMapContainerRef}
        />
    );
};

export default InsetMap;
