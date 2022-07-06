import React from 'react';

import type { Point, FeatureCollection } from 'geojson';

import { searchStations } from '../../store/api';
import {
    DataStateContext,
    DataActionDispatcherContext,
    FilterStateContext,
    FilterActionDispatcherContext
} from '../../store/contexts';
import { layerStyles, mapStyle } from '../Map/styles';
import { directionArrow, getFeatureBounds, pulsingDot } from '../Map/utils';
import Map from '../Map';

import faoAreasUrl from '../../files/fao_areas.geojson';

const ExploreMap = (): JSX.Element => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { journeyPath, stationsBounds, stationsList, selectedStation } = React.useContext(DataStateContext);
    const filterActionDispatcher = React.useContext(FilterActionDispatcherContext);
    const { filteredSpecies, filteredStations, filteredFAOAreas, filterDates } = React.useContext(FilterStateContext);
    const selectedStationRef = React.useRef<StationSummary | null>(null);

    const mapRef = React.useRef<maplibregl.Map>();
    const [isMapLoaded, setIsMapLoaded] = React.useState(false);

    const onMapLoad = (map: maplibregl.Map) => {
        // Add a pulsing dot image to the map to be used for selected station
        pulsingDot(map, 100);

        // Add direction arrow to the map to be used for journey path
        directionArrow(map);

        // Add FAO Areas
        map.addSource('faoAreas', {
            type: 'geojson',
            data: faoAreasUrl
        });

        map.addLayer({
            ...layerStyles.faoAreas.default,
            id: 'faoAreas',
            source: 'faoAreas'
        } as maplibregl.FillLayerSpecification);

        // Add journey path
        map.addSource('journey', {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: []
                }
            }
        });

        map.addLayer({
            ...layerStyles.journeyPath.default,
            id: 'journey',
            source: 'journey'
        } as maplibregl.LineLayerSpecification);

        map.addLayer({
            ...layerStyles.journeyPath.direction,
            id: 'journey-direction',
            source: 'journey'
        } as maplibregl.SymbolLayerSpecification);

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
        } as maplibregl.CircleLayerSpecification);

        // The layer for clustered stations in clustered mode
        map.addLayer({
            ...layerStyles.stations.clustered,
            id: 'clustered-stations-multi',
            source: 'clustered-stations'
        } as maplibregl.CircleLayerSpecification);

        // The layer for clusters count in clustered mode
        map.addLayer({
            ...layerStyles.stations.clusterCount,
            id: 'clustered-stations-count',
            source: 'clustered-stations'
        } as maplibregl.SymbolLayerSpecification);

        // The default stations layer in unclustered mode
        map.addLayer({
            ...layerStyles.stations.default,
            id: 'stations',
            source: 'stations',
            layout: {
                visibility: 'none'
            }
        } as maplibregl.CircleLayerSpecification);

        // The layer for selected station
        map.addLayer({
            ...layerStyles.stations.selected,
            id: 'stations-selected',
            source: 'stations',
            filter: ['==', 'name', '']
        } as maplibregl.CircleLayerSpecification);

        // Zoom to and expand the clicked cluster
        map.on('click', 'clustered-stations-multi', (e) => {
            const feature = e.features?.[0];
            if (feature) {
                const clusterId = feature.properties?.cluster_id;
                const stationsSource = map.getSource('clustered-stations') as maplibregl.GeoJSONSource;
                stationsSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
                    if (err) return;

                    if (zoom) {
                        map.easeTo({
                            center: (feature.geometry as Point).coordinates as [number, number],
                            zoom
                        });
                    }
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

        mapRef.current = map;
        setIsMapLoaded(true);
    };

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
            } as FeatureCollection;
            ['stations', 'clustered-stations'].forEach((sourceName) => {
                const source = map.getSource(sourceName) as maplibregl.GeoJSONSource;
                if (source) {
                    source.setData(stationsGeoJSON);
                }
            });
            map.fitBounds(stationsBounds);

            const journeySource = map.getSource('journey') as maplibregl.GeoJSONSource;
            if (journeySource) {
                journeySource.setData({
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: journeyPath
                    }
                });
            }
            // Update selected station on click on the following layers
            ['stations', 'clustered-stations-single'].forEach((layerName) => {
                map.on('click', layerName, (e) => {
                    if (e.features && e.features[0]) {
                        const feature = e.features[0];
                        const stationProperties = feature.properties as StationSummary;
                        let newSelectedStation =
                            stationProperties.name === selectedStationRef.current?.name ? null : stationProperties;
                        if (newSelectedStation) {
                            const index: number = stationsList.findIndex(
                                ({ name }) => newSelectedStation?.name === name
                            );
                            newSelectedStation = stationsList[index];
                        }
                        dataActionDispatcher({
                            type: 'updateSelectedStation',
                            station: newSelectedStation
                        });
                        selectedStationRef.current = newSelectedStation;
                    }
                });
            });
        }
    }, [stationsList, isMapLoaded]);

    React.useEffect(() => {
        // Update the filter on `stations-selected` when selected station changes
        const map = mapRef.current;
        if (map && isMapLoaded) {
            map.setFilter('stations-selected', ['==', 'name', selectedStation ? selectedStation.name : '']);
            if (selectedStation) {
                map.flyTo({ center: [selectedStation.coordinates[0], selectedStation.coordinates[1]], zoom: 6 });
            }
        }
    }, [selectedStation, isMapLoaded]);

    React.useEffect(() => {
        // Update visible stations when the given dependencies change
        const map = mapRef.current;
        if (map && isMapLoaded) {
            if (
                filteredStations.length ||
                filteredFAOAreas.length ||
                filteredSpecies.length ||
                filterDates[0] !== null ||
                filterDates[1] !== null
            ) {
                searchStations(
                    {
                        stationNames: filteredStations,
                        faoAreas: filteredFAOAreas,
                        species: filteredSpecies,
                        dates: filterDates
                    },
                    (stations) => {
                        map.setFilter('stations', ['in', 'name', ...stations.map((station) => station.name)]);
                        // Move the map to filtered stations
                        if (stations.length === 1) {
                            map.flyTo({
                                center: stations[0].coordinates,
                                zoom: 6
                            });
                        } else {
                            const bounds = getFeatureBounds(
                                stations.map(({ coordinates }) => coordinates) as LineCoordinates
                            );
                            if (!bounds.isEmpty()) {
                                map.fitBounds(bounds, { padding: 50 });
                            }
                        }

                        if (selectedStation && !stations.find(({ name }) => name === selectedStation.name)) {
                            dataActionDispatcher({ type: 'updateSelectedStation', station: null });
                        }
                        filterActionDispatcher({ type: 'updateFilterCount', count: stations.length });
                    }
                );

                ['clustered-stations-single', 'clustered-stations-multi', 'clustered-stations-count'].forEach(
                    (layerName) => {
                        map.setLayoutProperty(layerName, 'visibility', 'none');
                    }
                );
                map.setLayoutProperty('stations', 'visibility', 'visible');
            } else {
                ['clustered-stations-single', 'clustered-stations-multi', 'clustered-stations-count'].forEach(
                    (layerName) => {
                        map.setLayoutProperty(layerName, 'visibility', 'visible');
                    }
                );
                map.setLayoutProperty('stations', 'visibility', 'none');
                filterActionDispatcher({ type: 'updateFilterCount', count: null });
            }
        }
    }, [filteredStations, filteredFAOAreas, filteredSpecies, isMapLoaded, filterDates]);

    return (
        <Map
            mapOptions={{
                style: mapStyle,
                minZoom: 1
            }}
            initialBounds={[-180, -90, 180, 90]}
            attribution
            help
            navigation
            basemaps={{
                basemaps: [
                    {
                        id: 'OSM',
                        tiles: [
                            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        ],
                        sourceExtraParams: {
                            attribution:
                                '&#169; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.'
                        }
                    },
                    {
                        id: 'Carto',
                        tiles: [
                            'https://a.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
                            'https://b.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
                            'https://c.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
                            'https://d.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png'
                        ],
                        sourceExtraParams: {
                            attribution: '&#169; <a href="https://www.carto.com">Carto</a>'
                        }
                    },
                    {
                        id: 'World_Imagery',
                        tiles: [
                            'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                        ],
                        sourceExtraParams: {
                            attribution: 'Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
                        }
                    }
                ],
                initialBasemap: 'World_Imagery',
                expandDirection: 'top'
            }}
            LayersControlProps={[
                {
                    id: 'faoAreas',
                    label: 'FAO Areas',
                    initialOpacity: 0.25,
                    attribution: {
                        text: 'FAO, 2020. FAO Statistical Areas for Fishery Purposes. In: FAO Fisheries and Aquaculture Department [online]. Rome. [Cited 2021]',
                        url: 'https://data.apps.fao.org/map/catalog/srv/eng/catalog.search#/metadata/ac02a460-da52-11dc-9d70-0017f293bd28'
                    },
                    style: layerStyles.faoAreas.default
                }
            ]}
            onLoad={onMapLoad}
        />
    );
};

export default ExploreMap;
