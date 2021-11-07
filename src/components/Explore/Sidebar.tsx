import React from 'react';
import Box from '@mui/material/Box';

import { DataStateContext } from '../../store/contexts';

import StationDetails from './StationDetails';

const Sidebar = () => {
    const { selectedStation } = React.useContext(DataStateContext);

    return (
        <Box sx={{ background: '#fff', width: { xs: 350, lg: 500 }, p: 1 }}>
            SIDEBAR PLACEHOLDER
            {selectedStation ? <StationDetails station={selectedStation} /> : null}
        </Box>
    );
};

export default Sidebar;
