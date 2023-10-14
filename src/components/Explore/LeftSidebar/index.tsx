import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import InsetMap from './InsetMap';
import DetailView from './DetailView';
import StationsList from './StationList';

const LeftSidebar = () => {
    return (
        <Stack
            direction="row"
            sx={{
                position: 'absolute',
                left: 0,
                height: '100%'
            }}
        >
            <StationsList />
            <DetailView />
            <Box sx={{ mt: '10px', ml: '10px' }}>
                <InsetMap />
            </Box>
        </Stack>
    );
};

export default LeftSidebar;
