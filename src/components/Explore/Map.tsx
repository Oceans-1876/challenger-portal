import React from 'react';
import maplibre from 'maplibre-gl';
import Box from '@mui/material/Box';

import { DataStateContext, DataActionDispatcherContext } from '../../store/contexts';
import { layerStyles, mapStyle } from '../Map/styles';
import { pulsingDot } from '../Map/utils';

const Map = (): JSX.Element => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { stationsBounds, stationsList, selectedSpecies } = React.useContext(DataStateContext);

    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const mapRef = React.useRef<maplibre.Map>();
    const [isMapLoaded, updateIsMapLoaded] = React.useState(false);

    React.useEffect(() => {
        if (maplibre.supported() && mapContainerRef.current) {
            const map = new maplibre.Map({
                container: mapContainerRef.current,
                style: mapStyle,
                bounds: [-180, -90, 180, 90],
                minZoom: 1
            });
            map.on('load', () => {
                pulsingDot(map, 100);

                // Add stations
                map.addSource('stations', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: []
                    },
                    cluster: true,
                    clusterMinPoints: 5
                });

                map.addLayer({
                    ...layerStyles.stations.default,
                    id: 'stations',
                    source: 'stations'
                } as maplibre.CircleLayer);

                map.addLayer({
                    ...layerStyles.stations.selected,
                    id: 'selected-station',
                    source: 'stations',
                    filter: ['==', 'name', '']
                } as maplibre.CircleLayer);

                map.addLayer({
                    ...layerStyles.stations.clustered,
                    id: 'clustered-stations',
                    source: 'stations'
                } as maplibre.CircleLayer);

                map.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'stations',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['Roboto Regular'],
                        'text-size': 12
                    }
                });

                map.on('click', 'stations', (e) => {
                    if (e.features && e.features[0]) {
                        const feature = e.features[0];
                        const stationProperties = feature.properties as StationDetails;
                        dataActionDispatcher({ type: 'updateSelectedStation', station: stationProperties });
                        map.setFilter('selected-station', ['==', 'name', stationProperties.name]);
                    }
                });

                map.on('click', 'clustered-stations', (e) => {
                    if (e.features && e.features[0]) {
                        const feature = e.features[0];
                        const clusterId = feature.properties.cluster_id;
                        const stationsSource = map.getSource('stations') as maplibre.GeoJSONSource;
                        stationsSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
                            if (err) return;

                            map.easeTo({
                                center: feature.geometry.coordinates,
                                zoom
                            });
                        });
                    }
                });

                ['stations', 'clustered-stations'].forEach((layerName) => {
                    // Change the cursor to a pointer when the mouse is over the layer layer.
                    map.on('mouseenter', layerName, () => {
                        map.getCanvas().style.cursor = 'pointer';
                    });

                    // Change it back to a pointer when it leaves.
                    map.on('mouseleave', layerName, () => {
                        map.getCanvas().style.cursor = '';
                    });
                });

                // Add journey path
                map.addSource('journey', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: []
                    }
                });

                map.addLayer({
                    ...layerStyles.journeyPath.default,
                    id: 'journey',
                    source: 'journey'
                } as maplibre.LineLayer);

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
                map.fitBounds(stationsBounds);
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
        <Box ref={mapContainerRef} sx={{ height: '100%', flexGrow: 1, background: 'white' }}>
            {maplibre.supported() ? null : 'Your browser does not support the map features.'}
        </Box>
    );
};

export default Map;
