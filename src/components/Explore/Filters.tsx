import React from 'react';
import AppBar from '@mui/material/AppBar';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { matchSorter } from 'match-sorter';
import throttle from 'lodash/throttle';

import { DataStateContext, DataActionDispatcherContext } from '../../store/contexts';
import { themeOptions } from '../../theme';
import { useFAOAreas } from '../../utils/hooks';

interface Props {
    filterBarHeight: number;
}

const Filters = ({ filterBarHeight }: Props) => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { stationsList, filteredStations, speciesOptions, filteredFAOAreas } = React.useContext(DataStateContext);
    const [options, setOptions] = React.useState<SpeciesOptions[]>(speciesOptions);
    const [inputVal, setInputVal] = React.useState<string>('');
    const faoAreas = useFAOAreas();

    React.useEffect(() => {
        setOptions(speciesOptions);
    }, [speciesOptions]);

    return (
        <AppBar
            sx={{
                'height': filterBarHeight,
                'color': 'primary.light',
                'backgroundColor': `${themeOptions.palette.secondary.light} !important`,
                'justifyContent': 'center',
                'zIndex': 1,
                '& a': {
                    textDecoration: 'none',
                    color: 'primary.light'
                }
            }}
            position="relative"
            elevation={1}
            square
        >
            <Toolbar sx={{ alignItems: 'start' }}>
                <Box sx={{ 'display': 'flex', 'width': '100%', '& > *': { pr: 2 } }}>
                    <Typography variant="h5">Filter by</Typography>
                    <Box>
                        <Autocomplete
                            sx={{ width: 250 }}
                            disableCloseOnSelect
                            size="small"
                            multiple
                            limitTags={0}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    label="Stations"
                                    placeholder="Select Stations"
                                />
                            )}
                            options={stationsList.map((station) => station.name)}
                            getOptionLabel={(option) => `Station ${option}`}
                            renderTags={() => null}
                            value={filteredStations}
                            onChange={(_e, selectedOption) => {
                                dataActionDispatcher({
                                    type: 'updateFilteredStations',
                                    stations: selectedOption
                                });
                            }}
                        />
                        {filteredStations.length ? `Matched ${filteredStations.length} station(s)` : null}
                    </Box>

                    <Box>
                        <Autocomplete
                            sx={{ width: 250 }}
                            disableCloseOnSelect
                            size="small"
                            multiple
                            limitTags={0}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    label="FAO Areas"
                                    placeholder="Select FAO Areas"
                                />
                            )}
                            options={faoAreas}
                            getOptionLabel={(option: FAOArea) => `${option.name} (${option.code})`}
                            renderTags={() => null}
                            value={filteredFAOAreas.reduce((values: FAOArea[], faoAreaCode: string) => {
                                const faoArea = faoAreas.find(({ code }) => code === faoAreaCode);
                                if (faoArea) {
                                    values.push(faoArea);
                                }
                                return values;
                            }, [])}
                            onChange={(_e, selectedOption) => {
                                dataActionDispatcher({
                                    type: 'updateFilteredFAOAreas',
                                    faoAreas: selectedOption.map((faoArea) => faoArea.code)
                                });
                            }}
                        />
                        {filteredFAOAreas.length ? `Matched ${filteredFAOAreas.length} FAO Area(s)` : null}
                    </Box>

                    <Box>
                        <Autocomplete
                            sx={{ width: 250 }}
                            disableCloseOnSelect
                            includeInputInList
                            size="small"
                            autoComplete
                            multiple
                            renderInput={(params) => (
                                <TextField {...params} variant="filled" label="Species" placeholder="Select Species" />
                            )}
                            options={options}
                            getOptionLabel={(option) => {
                                return option.label;
                            }}
                            clearOnBlur
                            filterOptions={(options_inp) => matchSorter(options_inp, inputVal, { keys: ['label'] })}
                            renderTags={() => null}
                            onChange={(_e, selectedOption) => {
                                const ids: string[] = selectedOption.map((sp) => (sp as SpeciesOptions).id);
                                dataActionDispatcher({
                                    type: 'updateFilteredSpecies',
                                    species: ids
                                });
                            }}
                            onInputChange={(_e, newVal) => {
                                throttle(() => setInputVal(newVal), 1000)();
                            }}
                        />
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Filters;
