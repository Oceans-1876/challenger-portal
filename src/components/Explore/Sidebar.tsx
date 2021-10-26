import React from 'react';
import maplibre from 'maplibre-gl';
import Autocomplete from '@mui/material/Autocomplete';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

interface Props {
    sidebarRef: React.RefObject<HTMLDivElement>;
    map: maplibre.Map;
    allSpecies: string[];
    selectedSpecies: string[];
    selectedStation: StationProperties | null;
    updateSelectedSpecies: (value: string[]) => void;
    updateSelectedStation: (station: StationProperties | null) => void;
}

const Sidebar = ({
    sidebarRef,
    map,
    allSpecies,
    selectedSpecies,
    selectedStation,
    updateSelectedSpecies,
    updateSelectedStation
}: Props) => {
    return (
        <Grid sx={{ background: '#fff', width: 350, p: 1 }} ref={sidebarRef}>
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
                        sx={{ position: 'absolute', top: 50, right: 20, zIndex: 10 }}
                        color="primary"
                        size="small"
                        onClick={() => {
                            map.setFilter('selected-station', ['==', 'station_id', '']);
                            updateSelectedStation(null);
                        }}
                    >
                        <Icon>close</Icon>
                    </Fab>
                    <List>
                        <ListItem>
                            {selectedStation.station} - {selectedStation.name}
                        </ListItem>
                        <ListItem>Air temperature (noon): {selectedStation.air_temperature_noon}&deg;</ListItem>
                        <ListItem>
                            Air temperature (daily mean): {selectedStation.air_temperature_daily_mean}&deg;
                        </ListItem>
                        <ListItem>Water temperature (bottom): {selectedStation.water_temperature_bottom}&deg;</ListItem>
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
    );
};

export default Sidebar;
