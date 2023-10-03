import React, { FC, useContext, useEffect, useRef } from 'react';
import maplibre, { LngLatBounds } from 'maplibre-gl';
import { Box } from '@mui/material';
import * as turf from '@turf/turf';
import { IS_WEBGL_SUPPORTED } from '../../../Map/utils';
import { theme } from '../../../../theme';
import { DataActionDispatcherContext, DataStateContext } from '../../../../store/contexts';

type Props = {
    faoArea: FAOArea;
    size?: number;
    opacity?: number;
};

const RegionIcon: FC<Props> = ({ faoArea, size = 64, opacity = 1 }) => {
    const { faoAreaIcons } = useContext(DataStateContext);
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
    const mapRef = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        if (!IS_WEBGL_SUPPORTED) return () => {};
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        if (faoAreaIcons[faoArea.code]) return () => {};

        const feature =
            faoArea.geometry.type === 'MultiPolygon'
                ? turf.multiPolygon(faoArea.geometry.coordinates)
                : turf.polygon(faoArea.geometry.coordinates);
        const bbox = turf.bbox(feature);

        const containerEl = document.createElement('div');
        containerEl.style.width = '64px';
        containerEl.style.height = '64px';
        containerEl.style.position = 'fixed';
        containerEl.style.left = '-1000px';
        document.body.append(containerEl);

        const map = new maplibre.Map({
            container: containerEl,
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
                            'fill-color': theme.palette.explore.secondary
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
            map.remove();
            mapRef.current = null;
            containerEl.remove();
        });

        mapRef.current = map;

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
            containerEl.remove();
        };
    }, []);

    return (
        <Box
            sx={{
                width: size,
                height: size,
                background: faoAreaIcons[faoArea.code] ? `url(${faoAreaIcons[faoArea.code]})` : 'none',
                backgroundSize: '100%, 100%',
                opacity
            }}
        />
    );
};

export default RegionIcon;
