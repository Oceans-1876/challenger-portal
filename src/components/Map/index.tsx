import React from 'react';
import maplibre from 'maplibre-gl';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';

import { MapControl } from './Control';
import Help from './Help';
import { IS_WEBGL_SUPPORTED } from './utils';

interface Props {
    mapOptions: Partial<maplibregl.MapOptions>;
    initialBounds: maplibregl.LngLatBoundsLike;
    attribution?: boolean;
    help?: boolean;
    navigation?: boolean;
    onLoad: (map: maplibregl.Map) => void;
}

const Map = ({ mapOptions, initialBounds, attribution, help, navigation, onLoad }: Props): JSX.Element => {
    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const mapRef = React.useRef<maplibregl.Map>();

    const resetPitchButtonRef = React.useRef<HTMLButtonElement>(null);
    const resetBoundsButtonRef = React.useRef<HTMLButtonElement>(null);

    const helpButtonRef = React.useRef<HTMLButtonElement>(null);
    const [showHelp, updateShowHelp] = React.useState(false);

    React.useEffect(() => {
        if (IS_WEBGL_SUPPORTED && mapContainerRef.current) {
            const map = new maplibre.Map({
                container: mapContainerRef.current,
                bounds: initialBounds,
                attributionControl: !attribution,
                ...mapOptions
            } as maplibregl.MapOptions);

            if (attribution) {
                map.addControl(new maplibre.AttributionControl({ compact: true }), 'bottom-right');
            }

            if (navigation) {
                if (resetPitchButtonRef.current) {
                    map.addControl(new MapControl(resetPitchButtonRef.current), 'bottom-right');
                }
                if (resetBoundsButtonRef.current) {
                    map.addControl(new MapControl(resetBoundsButtonRef.current), 'bottom-right');
                }
                map.addControl(new maplibre.NavigationControl({}), 'bottom-right');
            }

            if (help && helpButtonRef.current) {
                map.addControl(new MapControl(helpButtonRef.current), 'bottom-right');
            }

            map.on('load', () => {
                onLoad(map);
            });

            mapRef.current = map;
        }
        return () => {
            mapRef.current?.remove();
        };
    }, []);

    return (
        <Box
            ref={mapContainerRef}
            sx={{
                'height': '100%',
                '& .maplibregl-ctrl-bottom-right': {
                    right: 64
                }
            }}
        >
            {IS_WEBGL_SUPPORTED ? null : 'Your browser does not support the map features.'}

            {navigation ? (
                <>
                    <Box ref={resetPitchButtonRef} className="maplibregl-ctrl-group">
                        <button
                            type="button"
                            title="Reset map pitch"
                            onClick={() => {
                                if (mapRef.current) {
                                    mapRef.current.easeTo({ pitch: 0 });
                                }
                            }}
                        >
                            <Icon baseClassName="icons">360</Icon>
                        </button>
                    </Box>

                    <Box ref={resetBoundsButtonRef} className="maplibregl-ctrl-group">
                        <button
                            type="button"
                            title="Reset map bounds"
                            onClick={() => {
                                if (mapRef.current) {
                                    mapRef.current?.fitBounds(initialBounds);
                                }
                            }}
                        >
                            <Icon baseClassName="icons">zoom_out_map</Icon>
                        </button>
                    </Box>
                </>
            ) : null}

            {help ? (
                <Box ref={helpButtonRef} className="maplibregl-ctrl-group">
                    <button type="button" title="How to navigate the map" onClick={() => updateShowHelp(true)}>
                        <Icon baseClassName="icons">question_mark</Icon>
                    </button>
                    <Help open={showHelp} onClose={() => updateShowHelp(false)} />
                </Box>
            ) : null}
        </Box>
    );
};

export default Map;
