import React from 'react';
import axios from 'axios';
import maplibre from 'maplibre-gl';
import makeStyles from '@mui/styles/makeStyles';
import Autocomplete from '@mui/material/Autocomplete';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';

import { MapControl } from '../Map/Control';

import speciesJSON from '../../files/species.json';
import stationsGeoJSON from '../../files/stations.geojson';

maplibre.accessToken = MAPBOX_TOKEN || '';

const useStyle = makeStyles((theme) => ({
    main: {
        height: '100%',
        margin: 0
    },
    mapContainer: {
        width: '100%',
        height: '100%'
    },
    sidebar: {
        background: '#fff',
        width: 350,
        padding: theme.spacing(1)
    },
    searchInput: {
        marginLeft: theme.spacing(1),
        flex: 1
    },
    stationCloseButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10
    }
}));

interface StationProperties {
    station_id: number;
    station: string;
    name: string;
    species: string;
    date: string;
    air_temperature_noon: number;
    air_temperature_daily_mean: number;
    water_temperature_bottom: number;
    water_temperature_surface: number;
    water_density_bottom_60f: number;
    water_density_surface_60f: number;
}

const Explore = (): JSX.Element => {
    const classes = useStyle();

    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const mapRef = React.useRef<maplibre.Map>();

    const sidebarRef = React.useRef<HTMLDivElement>(null);

    const [allSpecies, updateAllSpecies] = React.useState<string[]>([]);
    const [selectedSpecies, updateSelectedSpecies] = React.useState<string[]>([]);

    const [selectedStation, updateSelectedStation] = React.useState<StationProperties>();

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
        <Grid
            className={classes.main}
            container
            item
            xs={12}
            justifyContent="center"
            alignContent="space-around"
            spacing={5}
        >
            <div className={classes.mapContainer} ref={mapContainerRef} />
            <Grid className={`hidden ${classes.sidebar}`} ref={sidebarRef}>
                <Grid item>
                    <Autocomplete
                        multiple
                        disableCloseOnSelect
                        includeInputInList
                        fullWidth
                        limitTags={2}
                        ChipProps={{
                            size: 'small'
                        }}
                        options={allSpecies}
                        value={selectedSpecies}
                        renderInput={(params) => <TextField {...params} placeholder="Select species" />}
                        onChange={(_e, selectedOptions) => {
                            updateSelectedSpecies(selectedOptions);
                        }}
                    />
                </Grid>
                {selectedStation ? (
                    <Grid item>
                        <Fab
                            className={classes.stationCloseButton}
                            color="primary"
                            size="small"
                            onClick={() => {
                                mapRef.current?.setFilter('selected-station', ['==', 'station_id', '']);
                                updateSelectedStation(undefined);
                            }}
                        >
                            <CloseIcon />
                        </Fab>
                        <List>
                            <ListItem>
                                {selectedStation.station} - {selectedStation.name}
                            </ListItem>
                            <ListItem>Air temperature (noon): {selectedStation.air_temperature_noon}&deg;</ListItem>
                            <ListItem>
                                Air temperature (daily mean): {selectedStation.air_temperature_daily_mean}&deg;
                            </ListItem>
                            <ListItem>
                                Water temperature (bottom): {selectedStation.water_temperature_bottom}&deg;
                            </ListItem>
                            <ListItem>
                                Water temperature (surface): {selectedStation.water_temperature_surface}&deg;
                            </ListItem>
                            <ListItem>
                                Water density (bottom - 60F): {selectedStation.water_density_bottom_60f}&deg;
                            </ListItem>
                            <ListItem>
                                Water density (surface - 60F): {selectedStation.water_density_surface_60f}&deg;
                            </ListItem>
                            <ListItem>
                                Species:&nbsp;
                                <List>
                                    {JSON.parse(selectedStation.species).map((sp: string) => (
                                        <ListItem key={sp}>{sp}</ListItem>
                                    ))}
                                </List>
                            </ListItem>
                        </List>
                    </Grid>
                ) : null}
            </Grid>
        </Grid>
    );
};

export default Explore;
