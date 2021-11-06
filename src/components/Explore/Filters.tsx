import React from 'react';
import AppBar from '@mui/material/AppBar';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { DataStateContext, DataActionDispatcherContext } from '../../store/contexts';
import { themeOptions } from '../../theme';

interface Props {
    filterBarHeight: number;
}

const Filters = ({ filterBarHeight }: Props) => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { allSpeciesList, selectedSpecies } = React.useContext(DataStateContext);

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
            <Toolbar>
                <Box sx={{ 'display': 'flex', 'width': '100%', '& > *': { pr: 2 } }}>
                    <Typography variant="h5">Filter by</Typography>
                    <Box>
                        <Autocomplete
                            sx={{ width: 250 }}
                            disableCloseOnSelect
                            includeInputInList
                            size="small"
                            autoComplete
                            options={allSpeciesList.map((species) => species.matched_canonical_full_name)}
                            getOptionLabel={(option) => {
                                return option;
                            }}
                            filterOptions={(options: string[]) =>
                                options.filter((name) => !selectedSpecies.includes(name))
                            }
                            value={null}
                            renderInput={(params) => <TextField {...params} placeholder="Species // TODO broken" />}
                            onChange={(_e, selectedOption) => {
                                dataActionDispatcher({
                                    type: 'updateSelectedSpecies',
                                    species: selectedOption ? [selectedOption] : []
                                });
                            }}
                        />
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Filters;