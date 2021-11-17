import React from 'react';
import AppBar from '@mui/material/AppBar';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import throttle from "lodash/throttle";

import { DataStateContext, DataActionDispatcherContext } from '../../store/contexts';
import { getData } from '../../store/api';
import { themeOptions } from '../../theme';

interface Props {
    filterBarHeight: number;
}

const Filters = ({ filterBarHeight }: Props) => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { stationsList, allSpeciesList, filteredSpecies, filteredStations, speciesOptions } = React.useContext(DataStateContext);
    const [inputVal, setInputVal] = React.useState<string>("")
    const [options, setOptions] = React.useState<string[]>([])
    const [updateOptions, setUpdateOptions] = React.useState<boolean>(true)

    React.useEffect(() => {
        if (inputVal !== ""){
            throttle(() => {
                console.log(`Hitting the search endpoint with ${inputVal}`)
                getData<SpeciesSummary[]>(`species/search/?search_term=${inputVal}&search_column=matched_canonical_full_name&limit=0`, (species) => {
                    let newOptions = species.filter(sp => sp.matched_canonical_full_name !== null).map(sp => sp.matched_canonical_full_name)
                    // dataActionDispatcher({ type: 'updateAllSpecies', species });
                    dataActionDispatcher({type: 'updateSpeciesOptions', species: newOptions })
                    setOptions(newOptions)
                })
            }, 300)()
        }
        if ((inputVal === "")){
            if (speciesOptions.length !== allSpeciesList.length - 1){ // because of the null value present in one of the species
                console.log("Resetting Species Options in Datastore and Updating Options")
                let newOptions = allSpeciesList.filter(sp => sp.matched_canonical_full_name !== null).map(sp => sp.matched_canonical_full_name)
                dataActionDispatcher({type: 'updateSpeciesOptions', species: newOptions })
                setOptions(newOptions)
            }
        }
        if (updateOptions && speciesOptions.length !== 0){
            setOptions(speciesOptions)
            setUpdateOptions(false)
            
        }
    }, [inputVal])
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
                            renderInput={(params) => <TextField 
                                {...params} 
                                variant="filled"
                                label="Stations"
                                placeholder="Select Stations" />}
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
                    {/* {console.log(allSpeciesList)} */}
                    {/* {console.log(options.length)}
                    {console.log(filteredSpecies.length)} */}
                    <Box>
                        <Autocomplete
                            sx={{ width: 250 }}
                            disableCloseOnSelect
                            includeInputInList
                            size="small"
                            autoComplete
                            multiple
                            renderInput={
                                (params) => 
                                <TextField 
                                    {...params} 
                                    variant="filled"
                                    label="Species"
                                    placeholder="Select Species" />
                            }
                            options={options}
                            getOptionLabel={(option) => {
                                return option;
                            }}
                            freeSolo
                            selectOnFocus
                            clearOnBlur
                            filterOptions={(x) => x}
                            renderTags={() => null}
                            value={filteredSpecies}
                            onChange={(_e, selectedOption) => {
                                dataActionDispatcher({
                                    type: 'updateFilteredSpecies',
                                    species: selectedOption
                                });
                            }}
                            onInputChange={(_e, entered_value) => {
                                setInputVal(entered_value)
                            }}
                        />
                        {console.log(filteredSpecies)}
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Filters;
