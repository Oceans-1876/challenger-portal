import React from 'react';
import maplibre from 'maplibre-gl';
import Box from '@mui/material/Box';

import { DataStateContext, DataActionDispatcherContext } from '../../store/contexts';
import { mapStyle } from '../Map/styles';

import Filters from './Filters';
import Sidebar from './Sidebar';

const filterBarHeight = 75;

const Explore = (): JSX.Element => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { stationsList, selectedSpecies } = React.useContext(DataStateContext);

    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const mapRef = React.useRef<maplibre.Map>();
    const [isMapLoaded, updateIsMapLoaded] = React.useState(false);

    React.useEffect(() => {
        if (mapContainerRef.current) {
            const map = new maplibre.Map({
                container: mapContainerRef.current,
                style: mapStyle,
                center: [0, 0],
                zoom: 0
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
                        const stationProperties = e.features[0].properties as StationDetails;
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
                    features: stationsList.map((stationProps) => ({
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
    }, [stationsList, isMapLoaded]);

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
            <Filters filterBarHeight={filterBarHeight} />
            <Box sx={{ display: 'flex', height: `calc(100% - ${filterBarHeight}px)` }}>
                <Sidebar />
                <Box ref={mapContainerRef} sx={{ height: '100%', flexGrow: 1 }} />
            </Box>
        </Box>
    );
};

export default Explore;
