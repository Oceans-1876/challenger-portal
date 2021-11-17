import React from 'react';
import maplibre from 'maplibre-gl';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';

import { MapControl } from './Control';
import Help from './Help';
import LayersControl from './LayersControl';

interface Props {
    mapOptions: Partial<maplibre.MapboxOptions>;
    initialBounds: maplibre.LngLatBoundsLike;
    attribution?: boolean;
    help?: boolean;
    navigation?: boolean;
    LayersControlProps?: LayersControlProps[];
    onLoad: (map: maplibre.Map) => void;
}

const Map = ({
    mapOptions,
    initialBounds,
    attribution,
    help,
    navigation,
    LayersControlProps,
    onLoad
}: Props): JSX.Element => {
    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const mapRef = React.useRef<maplibre.Map>();

    const resetPitchButtonRef = React.useRef<HTMLButtonElement>(null);
    const resetBoundsButtonRef = React.useRef<HTMLButtonElement>(null);

    const helpButtonRef = React.useRef<HTMLButtonElement>(null);
    const [showHelp, updateShowHelp] = React.useState(false);

    const layersControlRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (maplibre.supported() && mapContainerRef.current) {
            const map = new maplibre.Map({
                container: mapContainerRef.current,
                bounds: initialBounds,
                attributionControl: !attribution,
                ...mapOptions
            });

            if (attribution) {
                map.addControl(new maplibre.AttributionControl({ compact: true }), 'bottom-left');
            }

            if (navigation) {
                map.addControl(new maplibre.NavigationControl());
                if (resetPitchButtonRef.current) {
                    map.addControl(new MapControl(resetPitchButtonRef.current));
                }
                if (resetBoundsButtonRef.current) {
                    map.addControl(new MapControl(resetBoundsButtonRef.current));
                }
            }

            if (help && helpButtonRef.current) {
                map.addControl(new MapControl(helpButtonRef.current), 'bottom-right');
            }

            if (LayersControlProps && layersControlRef.current) {
                map.addControl(new MapControl(layersControlRef.current), 'top-left');
            }

            map.on('load', () => {
                onLoad(map);
            });
            mapRef.current = map;
        }
    }, []);

    return (
        <Box ref={mapContainerRef} sx={{ height: '100%', flexGrow: 1, background: 'white' }}>
            {maplibre.supported() ? null : 'Your browser does not support the map features.'}

            {LayersControlProps ? (
                <Box ref={layersControlRef} className="maplibregl-ctrl-group">
                    <LayersControl map={mapRef.current} layers={LayersControlProps} />
                </Box>
            ) : null}

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
