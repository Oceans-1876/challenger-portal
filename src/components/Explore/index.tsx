import React from 'react';
import Box from '@mui/material/Box';

import Map from './Map';
import Sidebar from './Sidebar';

const Explore = (): JSX.Element => (
    <Box
        sx={{
            display: 'flex',
            height: '100%',
            m: 0,
            justifyContent: 'center',
            alignContent: 'space-around'
        }}
    >
        <Sidebar />
        <Map />
    </Box>
);

export default Explore;
