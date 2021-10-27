import React from 'react';
import maplibre from 'maplibre-gl';
import Autocomplete from '@mui/material/Autocomplete';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

import { DataActionDispatcherContext, DataStateContext } from '../../store/contexts';

interface Props {
    sidebarRef: React.RefObject<HTMLDivElement>;
    map: maplibre.Map;
}

const Sidebar = ({ sidebarRef, map }: Props) => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { selectedStation, allSpecies, selectedSpecies } = React.useContext(DataStateContext);

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
                    getOptionLabel={(option) => option.matched_canonical_full_name}
                    value={allSpecies.filter(({ id }) => selectedSpecies.includes(id))}
                    renderInput={(params) => <TextField {...params} placeholder="Select species" />}
                    onChange={(_e, selectedOptions) => {
                        dataActionDispatcher({
                            type: 'updateSelectedSpecies',
                            species: selectedOptions.map(({ id }) => id)
                        });
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
                            dataActionDispatcher({ type: 'updateSelectedStation', station: null });
                        }}
                    >
                        <Icon>close</Icon>
                    </Fab>
                    <List>
                        <ListItem>
                            Station {selectedStation.name} - {selectedStation.location}
                        </ListItem>
                        <ListItem>Surface temperature: {selectedStation.surface_temp_c}&deg;</ListItem>
                        <ListItem>Water temperature (bottom): {selectedStation.bottom_water_temp_c}&deg;</ListItem>
                        <ListItem>
                            Species:&nbsp;
                            <List>
                                {selectedStation.species.map(({ id: speciesId }) => (
                                    <ListItem key={speciesId}>{allSpecies.find(({ id }) => id === speciesId)}</ListItem>
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
