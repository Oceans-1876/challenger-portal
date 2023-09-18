import React, { useContext, useEffect, useRef, useState } from 'react';

import type { Point } from 'geojson';

import {
    DataStateContext,
    DataActionDispatcherContext,
    MapStateContext,
    MapContext,
    MapActionDispatcherContext
} from '../../store/contexts';
import { layerStyles, mapStyle } from '../Map/styles';
import { directionArrow, pulsingDot, runWhenReady } from '../Map/utils';
import Map from '../Map';

import faoAreasUrl from '../../files/fao_areas.geojson';

interface BasemapControlOption {
    id: string;
    tiles: string[];
    sourceExtraParams?: Partial<maplibregl.RasterSourceSpecification>;
    layerExtraParams?: Partial<maplibregl.RasterLayerSpecification>;
}

const INITIAL_BASEMAP = 'World_Ocean_Base';

const basemaps: Array<BasemapControlOption> = [
    {
        id: 'World_Ocean_Base',
        tiles: [
            'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}'
        ],
        sourceExtraParams: {
            tileSize: 256,
            attribution:
                '&#169; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.'
        }
    },
    {
        id: 'World_Imagery',
        tiles: ['https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        sourceExtraParams: {
            tileSize: 256,
            attribution: 'Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
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
            tileSize: 256,
            attribution: '&#169; <a href="https://www.carto.com">Carto</a>'
        }
    }
];

const ExploreMap = (): JSX.Element => {
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
    const { journeyPath, stationsBounds, stationsList, selectedStation, filteredStations } =
        useContext(DataStateContext);
    const selectedStationRef = useRef<StationSummary | null>(null);

    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const mapRef = useContext(MapContext);
    const mapActionDispatch = useContext(MapActionDispatcherContext);
    const { activeBasemap } = useContext(MapStateContext);

    useEffect(() => {
        const map = mapRef.current;
        if (map) {
            runWhenReady(map, () => {
                basemaps.forEach(({ id }) => {
                    map.setLayoutProperty(id, 'visibility', id === activeBasemap ? 'visible' : 'none');
                });
            });
        }
    }, [activeBasemap]);

    const onMapLoad = (map: maplibregl.Map) => {
        // Add a pulsing dot image to the map to be used for selected station
        pulsingDot(map, 100);

        // Add direction arrow to the map to be used for journey path
        directionArrow(map);

        // Add basemaps
        basemaps.forEach(({ id, tiles, sourceExtraParams, layerExtraParams }) => {
            map.addSource(id, {
                ...sourceExtraParams,
                type: 'raster',
                tiles
            });
            map.addLayer({ ...layerExtraParams, id, source: id, type: 'raster' });
            map.setLayoutProperty(id, 'visibility', id === INITIAL_BASEMAP ? 'visible' : 'none');
        });

        mapActionDispatch({ type: 'updateBaseMap', id: INITIAL_BASEMAP });

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
            cluster: false, // FIXME - Temporarily disable clustering because it is broken with some server configurations.
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
            const stationsSource = map.getSource('stations') as maplibregl.GeoJSONSource;
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
            const clusteredStationsSource = map.getSource('clustered-stations') as maplibregl.GeoJSONSource;
            if (clusteredStationsSource) {
                clusteredStationsSource.setData({
                    type: 'FeatureCollection',
                    features: stationsList.map((stationProps) => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [
                                stationProps.coordinates[0] > 180
                                    ? stationProps.coordinates[0] - 360
                                    : stationProps.coordinates[0],
                                stationProps.coordinates[1]
                            ]
                        },
                        properties: stationProps
                    }))
                });
            }
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
            } else {
                map.fitBounds([-180, -90, 180, 90]);
            }
        }
    }, [selectedStation, isMapLoaded]);

    React.useEffect(() => {
        // Update visible stations when the given dependencies change
        const map = mapRef.current;
        if (map && isMapLoaded) {
            if (filteredStations) {
                map.setFilter('stations', ['in', 'name', ...filteredStations.map((station) => station.name)]);
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
            }
        }
    }, [filteredStations, isMapLoaded]);

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
            onLoad={onMapLoad}
        />
    );
};

export default ExploreMap;
