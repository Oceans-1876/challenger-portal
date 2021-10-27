import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DataStateContext, DataActionDispatcherContext } from '../../store/contexts';

const Filters = () => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { allSpecies, selectedSpecies } = React.useContext(DataStateContext);

    return (
        <Box>
            <Typography variant="h5">Filter by</Typography>
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
        </Box>
    );
};

export default Filters;
