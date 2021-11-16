import React from 'react';
import maplibre from 'maplibre-gl';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';

import { DataStateContext, DataActionDispatcherContext } from '../../store/contexts';
import { layerStyles, mapStyle } from '../Map/styles';
import { getFeatureBounds, pulsingDot } from '../Map/utils';
import { MapControl } from '../Map/Control';
import Help from '../Map/Help';

const Map = (): JSX.Element => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { stationsBounds, stationsList, filteredSpecies, selectedStation, filteredStations } =
        React.useContext(DataStateContext);
    const selectedStationRef = React.useRef<StationSummary | null>(null);

    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const mapRef = React.useRef<maplibre.Map>();
    const [isMapLoaded, updateIsMapLoaded] = React.useState(false);

    const resetPitchButtonRef = React.useRef<HTMLButtonElement>(null);
    const resetBoundsButtonRef = React.useRef<HTMLButtonElement>(null);

    const helpButtonRef = React.useRef<HTMLButtonElement>(null);
    const [showAbout, updateShowAbout] = React.useState(false);

    React.useEffect(() => {
        if (maplibre.supported() && mapContainerRef.current) {
            const map = new maplibre.Map({
                container: mapContainerRef.current,
                style: mapStyle,
                bounds: [-180, -90, 180, 90],
                minZoom: 1,
                attributionControl: false
            });

            map.addControl(new maplibre.AttributionControl({ compact: true }), 'bottom-left');
            map.addControl(new maplibre.NavigationControl());
            if (resetPitchButtonRef.current) {
                map.addControl(new MapControl(resetPitchButtonRef.current));
            }
            if (resetBoundsButtonRef.current) {
                map.addControl(new MapControl(resetBoundsButtonRef.current));
            }
            if (helpButtonRef.current) {
                map.addControl(new MapControl(helpButtonRef.current), 'top-left');
            }

            map.on('load', () => {
                // Add a pulsing dot image to the map to be used for selected station
                pulsingDot(map, 100);

                // Both `stations` and `clustered-stations` sources hold the same data.
                // For performance reasons, it is better to use separate sources and hide or show
                // their layers depending on the status of filtered stations.
                map.addSource('clustered-stations', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: []
                    },
                    cluster: true,
                    clusterMinPoints: 5
                });

                map.addSource('stations', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: []
                    }
                });

                // The layer for single stations in clustered mode
                map.addLayer({
                    ...layerStyles.stations.default,
                    id: 'clustered-stations-single',
                    source: 'clustered-stations',
                    filter: ['!', ['has', 'point_count']]
                } as maplibre.CircleLayer);

                // The layer for clustered stations in clustered mode
                map.addLayer({
                    ...layerStyles.stations.clustered,
                    id: 'clustered-stations-multi',
                    source: 'clustered-stations'
                } as maplibre.CircleLayer);

                // The layer for clusters count in clustered mode
                map.addLayer({
                    ...layerStyles.stations.clusterCount,
                    id: 'clustered-stations-count',
                    source: 'clustered-stations'
                } as maplibre.SymbolLayer);

                // The default stations layer in unclustered mode
                map.addLayer({
                    ...layerStyles.stations.default,
                    id: 'stations',
                    source: 'stations',
                    layout: {
                        visibility: 'none'
                    }
                } as maplibre.CircleLayer);

                // The layer for selected station
                map.addLayer({
                    ...layerStyles.stations.selected,
                    id: 'stations-selected',
                    source: 'stations',
                    filter: ['==', 'name', '']
                } as maplibre.CircleLayer);

                // Update selected station on click on the following layers
                ['stations', 'clustered-stations-single'].forEach((layerName) => {
                    map.on('click', layerName, (e) => {
                        if (e.features && e.features[0]) {
                            const feature = e.features[0];
                            const stationProperties = feature.properties as StationSummary;
                            const newSelectedStation =
                                stationProperties.name === selectedStationRef.current?.name ? null : stationProperties;
                            dataActionDispatcher({
                                type: 'updateSelectedStation',
                                station: newSelectedStation
                            });
                            selectedStationRef.current = newSelectedStation;
                            if (map.getZoom() < 6 && newSelectedStation) {
                                const { lat, lng } = e.lngLat;
                                map.flyTo({ center: [lng, lat], zoom: 6 });
                            }
                        }
                    });
                });

                // Zoom to and expand the clicked cluster
                map.on('click', 'clustered-stations-multi', (e) => {
                    if (e.features && e.features[0]) {
                        const feature = e.features[0];
                        const clusterId = feature.properties.cluster_id;
                        const stationsSource = map.getSource('clustered-stations') as maplibre.GeoJSONSource;
                        stationsSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
                            if (err) return;

                            map.easeTo({
                                center: feature.geometry.coordinates,
                                zoom
                            });
                        });
                    }
                });

                // Use pointer cursor on hover for the following layers
                ['stations', 'clustered-stations-single', 'clustered-stations-multi'].forEach((layerName) => {
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
        // When map is ready and stationsList change, update the data for `stations` and `clustered-stations`
        const map = mapRef.current;
        if (map && isMapLoaded) {
            const stationsGeoJSON = {
                type: 'FeatureCollection',
                features: stationsList.map((stationProps) => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: stationProps.coordinates
                    },
                    properties: stationProps
                }))
            };
            ['stations', 'clustered-stations'].forEach((sourceName) => {
                const source = map.getSource(sourceName) as maplibre.GeoJSONSource;
                if (source) {
                    source.setData(stationsGeoJSON);
                }
            });
            map.fitBounds(stationsBounds);
        }
    }, [stationsList, isMapLoaded]);

    React.useEffect(() => {
        // Update the filter on `stations-selected` when selected station changes
        const map = mapRef.current;
        if (map && isMapLoaded) {
            map.setFilter('stations-selected', ['==', 'name', selectedStation ? selectedStation.name : '']);
        }
    }, [selectedStation]);

    React.useEffect(() => {
        // Update the filter on all relevant layers when filtered species change
        const map = mapRef.current;
        if (map && map.loaded()) {
            // TODO
        }
    }, [filteredSpecies]);

    React.useEffect(() => {
        const map = mapRef.current;
        if (map && map.loaded()) {
            if (filteredStations.length) {
                if (selectedStation && !filteredStations.includes(selectedStation.name)) {
                    dataActionDispatcher({ type: 'updateSelectedStation', station: null });
                }

                ['clustered-stations-single', 'clustered-stations-multi', 'clustered-stations-count'].forEach(
                    (layerName) => {
                        map.setLayoutProperty(layerName, 'visibility', 'none');
                    }
                );
                map.setFilter('stations', ['in', 'name', ...filteredStations]);
                map.setLayoutProperty('stations', 'visibility', 'visible');

                // Move the map to filtered stations
                if (filteredStations.length === 1) {
                    map.flyTo({
                        center: stationsList.find(({ name }) => name === filteredStations[0])?.coordinates,
                        zoom: 6
                    });
                } else {
                    const bounds = getFeatureBounds(
                        filteredStations.map(
                            (stationName) => stationsList.find(({ name }) => name === stationName)?.coordinates
                        ) as LineCoordinates
                    );
                    if (!bounds.isEmpty()) {
                        map.fitBounds(bounds, { padding: 50 });
                    }
                }
            } else {
                ['clustered-stations-single', 'clustered-stations-multi', 'clustered-stations-count'].forEach(
                    (layerName) => {
                        map.setLayoutProperty(layerName, 'visibility', 'visible');
                    }
                );
                map.setLayoutProperty('stations', 'visibility', 'none');
            }
        }
    }, [filteredStations]);

    return (
        <Box ref={mapContainerRef} sx={{ height: '100%', flexGrow: 1, background: 'white' }}>
            {maplibre.supported() ? null : 'Your browser does not support the map features.'}

            <Box ref={helpButtonRef} className="maplibregl-ctrl-group">
                <button type="button" title="How to navigate the map" onClick={() => updateShowAbout(true)}>
                    <Icon>question_mark</Icon>
                </button>
                <Help open={showAbout} onClose={() => updateShowAbout(false)} />
            </Box>

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
                    <Icon>360</Icon>
                </button>
            </Box>

            <Box ref={resetBoundsButtonRef} className="maplibregl-ctrl-group">
                <button
                    type="button"
                    title="Reset map bounds"
                    onClick={() => {
                        if (mapRef.current) {
                            mapRef.current?.fitBounds(stationsBounds);
                        }
                    }}
                >
                    <Icon>zoom_out_map</Icon>
                </button>
            </Box>
        </Box>
    );
};

export default Map;
