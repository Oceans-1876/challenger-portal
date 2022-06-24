import React from 'react';
import Box from '@mui/material/Box';

import SpeciesList from './SpeciesList';
import { DataStateContext } from '../../store/contexts';
// import { DataActionDispatcherContext, DataStateContext } from '../../store/contexts';

const Species = (): JSX.Element => {
    // const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { allSpeciesList } = React.useContext(DataStateContext);

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100%',
                m: 0,
                justifyContent: 'left',
                alignContent: 'space-around'
            }}
        >
            <SpeciesList species_list={allSpeciesList} />
        </Box>
    );
};

export default Species;
