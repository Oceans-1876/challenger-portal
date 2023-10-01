import React, { FC, useContext, useEffect, useRef } from 'react';
import maplibre, { LngLatBounds } from 'maplibre-gl';
import { Box } from '@mui/material';
import * as turf from '@turf/turf';
import { IS_WEBGL_SUPPORTED } from '../../../Map/utils';
import { theme } from '../../../../theme';
import { DataActionDispatcherContext, DataStateContext } from '../../../../store/contexts';

type Props = {
    faoArea: FAOArea;
};

const RegionIcon: FC<Props> = ({ faoArea }) => {
    const { faoAreaIcons } = useContext(DataStateContext);
    return faoAreaIcons[faoArea.code] ? (
        <RegionIconCached base64Encoded={faoAreaIcons[faoArea.code]} />
    ) : (
        <RegionIconMap faoArea={faoArea} />
    );
};

const RegionIconCached: FC<{ base64Encoded: string }> = ({ base64Encoded }) => {
    return (
        <Box
            sx={{
                background: `url(${base64Encoded})`,
                backgroundSize: '100%, 100%',
                width: 64,
                height: 64
            }}
        />
    );
};

const RegionIconMap: FC<{ faoArea: FAOArea }> = ({ faoArea }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);

    const feature =
        faoArea.geometry.type == 'MultiPolygon'
            ? turf.multiPolygon(faoArea.geometry.coordinates)
            : turf.polygon(faoArea.geometry.coordinates);
    const bbox = turf.bbox(feature);

    const dataActionDispatcher = useContext(DataActionDispatcherContext);

    useEffect(() => {
        if (IS_WEBGL_SUPPORTED && mapContainerRef.current) {
            const map = new maplibre.Map({
                container: mapContainerRef.current,
                style: {
                    version: 8,
                    sources: {
                        faoArea: {
                            type: 'geojson',
                            data: {
                                type: 'FeatureCollection',
                                features: [feature]
                            }
                        }
                    },
                    layers: [
                        {
                            id: 'icon',
                            source: 'faoArea',
                            type: 'fill',
                            paint: {
                                'fill-color': theme.palette.explore.secondary,
                                'fill-opacity': 0.4
                            }
                        }
                    ]
                },
                bounds: new LngLatBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]),
                // bounds: [180, -90, -180, 90],
                interactive: false
            });
            map.on('load', () => {
                dataActionDispatcher({
                    type: 'cacheFAOAreaIcons',
                    faoArea: faoArea.code,
                    base64Encoded: map.getCanvas().toDataURL()
                });
            });
            mapRef.current = map;
        }
        return () => {
            mapRef.current?.remove();
        };
    }, []);

    return (
        <Box
            sx={{
                width: 64,
                height: 64
            }}
            ref={mapContainerRef}
        />
    );
};

export default RegionIcon;
