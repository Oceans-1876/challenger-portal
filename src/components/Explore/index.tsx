import React from 'react';
import axios from 'axios';
import maplibre from 'maplibre-gl';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import { MapControl } from '../Map/Control';

import speciesJSON from '../../files/species.json';
import stationsGeoJSON from '../../files/stations.geojson';

import Sidebar from './Sidebar';

maplibre.accessToken = MAPBOX_TOKEN || '';

const filterBarHeight = 65;

const Explore = (): JSX.Element => {
    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const mapRef = React.useRef<maplibre.Map>();

    const sidebarRef = React.useRef<HTMLDivElement>(null);

    const [allSpecies, updateAllSpecies] = React.useState<string[]>([]);
    const [selectedSpecies, updateSelectedSpecies] = React.useState<string[]>([]);

    const [selectedStation, updateSelectedStation] = React.useState<StationProperties | null>(null);

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
                    data: stationsGeoJSON
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
                    filter: ['==', 'station_id', '']
                });

                map.on('click', 'stations', (e) => {
                    if (e.features && e.features[0]) {
                        const stationProperties = e.features[0].properties as StationProperties;
                        updateSelectedStation(stationProperties);
                        map.setFilter('selected-station', ['==', 'station_id', stationProperties.station_id]);
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
            });
            mapRef.current = map;
        }
    }, []);

    React.useEffect(() => {
        axios
            .get(speciesJSON)
            .then(({ data }) => {
                updateAllSpecies(data);
            })
            .catch(console.error);
    }, []);

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
                <Toolbar>[TODO] FILTER BAR</Toolbar>
            </AppBar>
            <Box sx={{ width: '100%', height: `calc(100% - ${filterBarHeight}px)` }} ref={mapContainerRef} />
            {mapRef.current ? (
                <Sidebar
                    sidebarRef={sidebarRef}
                    map={mapRef.current}
                    allSpecies={allSpecies}
                    selectedSpecies={selectedSpecies}
                    selectedStation={selectedStation}
                    updateSelectedSpecies={updateSelectedSpecies}
                    updateSelectedStation={updateSelectedStation}
                />
            ) : null}
        </Box>
    );
};

export default Explore;
