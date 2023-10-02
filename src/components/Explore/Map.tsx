import React, { useContext, useEffect, useState } from 'react';

import type { Point } from 'geojson';

import {
    DataStateContext,
    DataActionDispatcherContext,
    MapStateContext,
    MapContext,
    MapActionDispatcherContext
} from '../../store/contexts';
import { layerStyles, mapStyle } from '../Map/styles';
import { getFeatureBounds, pulsingDot, runWhenReady } from '../Map/utils';
import Map from '../Map';

import faoAreasUrl from '../../files/fao_areas.geojson';
import { BASEMAPS, INITIAL_BASEMAP } from './basemapConfig';
import { MapLayerEventType } from 'maplibre-gl';

const MAX_ZOOM = 6;
const BASE_PADDING = 100;
const APPBAR_H = 64;
const LEFT_PANEL_W = 324;
const INSET_MAP_EXTRA_W = 226;
const DETAIL_W = 478;
const RIGHT_TOOLBAR_W = 48;
const MAP_CONTROL_EXTRA = 32;

const ExploreMap = (): JSX.Element => {
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
    const { journeyPath, selectedStation, filteredStations, selectedFaoArea } = useContext(DataStateContext);

    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const mapRef = useContext(MapContext);
    const mapActionDispatch = useContext(MapActionDispatcherContext);
    const { activeBasemap } = useContext(MapStateContext);

    useEffect(() => {
        const map = mapRef.current;
        if (map) {
            runWhenReady(map, () => {
                BASEMAPS.forEach(({ id }) => {
                    map.setLayoutProperty(id, 'visibility', id === activeBasemap ? 'visible' : 'none');
                });
            });
        }
    }, [activeBasemap]);

    const onMapLoad = (map: maplibregl.Map) => {
        // Add a pulsing dot image to the map to be used for selected station
        pulsingDot(map, 40);

        // Add basemaps
        BASEMAPS.forEach(({ id, tiles, sourceExtraParams, layerExtraParams }) => {
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
            clusterMinPoints: 3,
            clusterRadius: 120
        });

        map.addSource('stations', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: []
            }
        });

        // The layer for selected station
        map.addLayer({
            ...layerStyles.stations.selected,
            id: 'stations-selected',
            source: 'stations',
            filter: ['==', 'name', '']
        } as maplibregl.CircleLayerSpecification);

        // The layer for single stations in clustered mode
        map.addLayer({
            ...layerStyles.stations.default,
            id: 'clustered-stations-single',
            source: 'clustered-stations',
            filter: ['!', ['has', 'point_count']]
        } as maplibregl.CircleLayerSpecification);

        // The layer for station names in clustered mode
        map.addLayer({
            ...layerStyles.stations.name,
            id: 'clustered-stations-single-name',
            source: 'clustered-stations'
        } as maplibregl.SymbolLayerSpecification);

        map.addLayer({
            ...layerStyles.stations.nameSuffix,
            id: 'clustered-stations-single-name-suffix',
            source: 'clustered-stations'
        } as maplibregl.SymbolLayerSpecification);

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
        ['clustered-stations-single', 'clustered-stations-multi'].forEach((layerName) => {
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
        const map = mapRef.current;
        if (map && isMapLoaded) {
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
        }
    }, [journeyPath, isMapLoaded]);

    React.useEffect(() => {
        // When map is ready and stationsList change, update the data for `stations` and `clustered-stations`
        const map = mapRef.current;
        if (map && isMapLoaded) {
            const visibleStations = selectedFaoArea
                ? filteredStations.find((g) => g.faoArea.code == selectedFaoArea.code)?.stations ?? []
                : filteredStations.flatMap((g) => g.stations);

            const stationsSource = map.getSource('stations') as maplibregl.GeoJSONSource;
            if (stationsSource) {
                stationsSource.setData({
                    type: 'FeatureCollection',
                    features: visibleStations.map((stationProps) => ({
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
                    features: visibleStations.map((stationProps) => ({
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

            // Update selected station on click on the following layers
            const evenListener = (e: MapLayerEventType['click']) => {
                if (e.features && e.features[0]) {
                    const feature = e.features[0];
                    const stationProperties = feature.properties as StationSummary;
                    let newSelectedStation =
                        stationProperties.name === selectedStation?.name ? null : stationProperties;
                    if (newSelectedStation) {
                        newSelectedStation =
                            visibleStations.find(({ name }) => newSelectedStation?.name === name) ?? null;
                    }
                    dataActionDispatcher({
                        type: 'updateSelectedStation',
                        station: newSelectedStation
                    });
                }
            };
            ['clustered-stations-single'].forEach((layerName) => {
                map.on('click', layerName, evenListener);
            });
            return () => {
                ['clustered-stations-single'].forEach((layerName) => {
                    map.off('click', layerName, evenListener);
                });
            };
        }
    }, [filteredStations, selectedFaoArea, selectedStation, isMapLoaded]);

    React.useEffect(() => {
        // Update the filter on `stations-selected` when selected station changes
        const map = mapRef.current;
        if (map && isMapLoaded) {
            map.setFilter('stations-selected', ['==', 'name', selectedStation?.name ?? '']);
            if (selectedStation) {
                map.easeTo({
                    center: [selectedStation.coordinates[0], selectedStation.coordinates[1]],
                    zoom: 8,
                    duration: 1000,
                    padding: {
                        left: BASE_PADDING + LEFT_PANEL_W + DETAIL_W, // left panel width + detail panel width
                        right: BASE_PADDING + RIGHT_TOOLBAR_W + MAP_CONTROL_EXTRA, // right toolbar width
                        top: BASE_PADDING + APPBAR_H, // appbar height
                        bottom: BASE_PADDING + MAP_CONTROL_EXTRA
                    }
                });
            } else if (selectedFaoArea) {
                const stationGroup = filteredStations.find((g) => g.faoArea.code === selectedFaoArea.code);
                if (!stationGroup) throw '[Invalid State]: FAO Area must be selected from filtered stations!';

                const coordinates = stationGroup.stations.map((s) => s.coordinates);
                const maxLng = Math.max(...coordinates.map((c) => c[0]));
                const minLng = Math.min(...coordinates.map((c) => c[0]));
                const bounds = getFeatureBounds(
                    coordinates.map(([lng, lat]) => [maxLng - minLng > 180 && lng > 180 ? lng - 360 : lng, lat])
                );
                map.setPadding({ left: 0, right: 0, top: 0, bottom: 0 });
                map.fitBounds(bounds, {
                    maxZoom: MAX_ZOOM,
                    padding: {
                        left: BASE_PADDING + LEFT_PANEL_W + INSET_MAP_EXTRA_W, // left panel width
                        right: BASE_PADDING + RIGHT_TOOLBAR_W + MAP_CONTROL_EXTRA, // right toolbar width
                        top: BASE_PADDING + APPBAR_H, // appbar height
                        bottom: BASE_PADDING + MAP_CONTROL_EXTRA
                    }
                });
            } else {
                const coordinates = filteredStations.flatMap((g) => g.stations.map((s) => s.coordinates));
                const maxLng = Math.max(...coordinates.map((c) => c[0]));
                const minLng = Math.min(...coordinates.map((c) => c[0]));
                const bounds = getFeatureBounds(
                    coordinates.map(([lng, lat]) => [maxLng - minLng > 180 && lng > 180 ? lng - 360 : lng, lat])
                );
                map.setPadding({ left: 0, right: 0, top: 0, bottom: 0 });
                map.fitBounds(bounds, {
                    maxZoom: MAX_ZOOM,
                    padding: {
                        left: BASE_PADDING + LEFT_PANEL_W + INSET_MAP_EXTRA_W, // left panel width
                        right: BASE_PADDING + RIGHT_TOOLBAR_W + MAP_CONTROL_EXTRA, // right toolbar width
                        top: BASE_PADDING + APPBAR_H, // appbar height
                        bottom: BASE_PADDING + MAP_CONTROL_EXTRA
                    }
                });
            }
        }
    }, [selectedFaoArea, selectedStation, filteredStations, isMapLoaded]);

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
