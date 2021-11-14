import React from 'react';
import Box from '@mui/material/Box';

import Filters from './Filters';
import Map from './Map';
import Sidebar from './Sidebar';

const filterBarHeight = 100;

const Explore = (): JSX.Element => (
    <Box
        sx={{
            height: '100%',
            m: 0,
            justifyContent: 'center',
            alignContent: 'space-around'
        }}
    >
        <Filters filterBarHeight={filterBarHeight} />
        <Box sx={{ display: 'flex', height: `calc(100% - ${filterBarHeight}px)` }}>
            <Sidebar />
            <Map />
        </Box>
    </Box>
);

export default Explore;
