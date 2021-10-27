import React from 'react';
import maplibre from 'maplibre-gl';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import { DataStateContext, DataActionDispatcherContext } from '../../store/contexts';
import { MapControl } from '../Map/Control';

import Filters from './Filters';
import Sidebar from './Sidebar';

maplibre.accessToken = MAPBOX_TOKEN || '';

const filterBarHeight = 65;

const Explore = (): JSX.Element => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { stations, selectedSpecies } = React.useContext(DataStateContext);

    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const mapRef = React.useRef<maplibre.Map>();
    const [isMapLoaded, updateIsMapLoaded] = React.useState(false);

    const sidebarRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (mapContainerRef.current && maplibre.accessToken) {
            const map = new maplibre.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [0, 0],
                zoom: 1
            });
            map.on('load', () => {
                map.addSource('stations', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: []
                    }
                });
                map.addLayer({
                    id: 'stations',
                    type: 'circle',
                    source: 'stations',
                    paint: {
                        'circle-color': '#088'
                    }
                });

                map.addLayer({
                    id: 'selected-station',
                    type: 'circle',
                    source: 'stations',
                    paint: {
                        'circle-radius': 10,
                        'circle-color': 'red',
                        'circle-opacity': 0.5
                    },
                    filter: ['==', 'name', '']
                });

                map.on('click', 'stations', (e) => {
                    if (e.features && e.features[0]) {
                        const stationProperties = e.features[0].properties as StationProperties;
                        dataActionDispatcher({ type: 'updateSelectedStation', station: stationProperties });
                        map.setFilter('selected-station', ['==', 'name', stationProperties.name]);
                    }
                });

                // Change the cursor to a pointer when the mouse is over the states layer.
                map.on('mouseenter', 'stations', () => {
                    map.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to a pointer when it leaves.
                map.on('mouseleave', 'stations', () => {
                    map.getCanvas().style.cursor = '';
                });

                if (sidebarRef.current) {
                    map.addControl(new MapControl(sidebarRef.current), 'top-left');
                }

                updateIsMapLoaded(true);
            });
            mapRef.current = map;
        }
    }, []);

    React.useEffect(() => {
        const map = mapRef.current;
        if (map && isMapLoaded) {
            const stationsSource = map.getSource('stations') as maplibre.GeoJSONSource;
            if (stationsSource) {
                stationsSource.setData({
                    type: 'FeatureCollection',
                    features: stations.map((stationProps) => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: stationProps.coordinates
                        },
                        properties: stationProps
                    }))
                });
            }
        }
    }, [stations, isMapLoaded]);

    React.useEffect(() => {
        const map = mapRef.current;
        if (map && map.loaded()) {
            map.setFilter('stations', ['any', ...selectedSpecies.map((sp) => ['in', sp, ['get', 'species']])]);
        }
    }, [selectedSpecies]);

    return (
        <Box
            sx={{
                height: '100%',
                m: 0,
                justifyContent: 'center',
                alignContent: 'space-around'
            }}
        >
            <AppBar
                sx={{
                    'height': filterBarHeight,
                    'color': 'primary.main',
                    'justifyContent': 'center',
                    '& a': {
                        textDecoration: 'none',
                        color: 'primary.main'
                    }
                }}
                position="relative"
                elevation={0}
                color="transparent"
            >
                <Toolbar>
                    <Filters />
                </Toolbar>
            </AppBar>
            <Box sx={{ width: '100%', height: `calc(100% - ${filterBarHeight}px)` }} ref={mapContainerRef} />
            {mapRef.current ? <Sidebar sidebarRef={sidebarRef} map={mapRef.current} /> : null}
        </Box>
    );
};

export default Explore;
