import React from 'react';

import { Box, Stack } from '@mui/material';
import Map from './Map';
import RightSidebar from './RightSidebar';
import LeftSidebar from './LeftSidebar';
import Navbar from './Navbar';

const Explore = (): JSX.Element => {
    return (
        <>
            <Box sx={{ position: 'fixed', width: '100vw', height: '100vh' }}>
                <Map />
            </Box>
            <Stack
                direction="column"
                sx={{
                    position: 'fixed',
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none'
                }}
            >
                <Box sx={{ pointerEvents: 'auto' }}>
                    <Navbar />
                </Box>
                <Box sx={{ flex: 'auto', position: 'relative' }}>
                    <Box sx={{ pointerEvents: 'auto' }}>
                        <LeftSidebar />
                    </Box>
                    <Box flex="1" />
                    <Box sx={{ pointerEvents: 'auto' }}>
                        <RightSidebar />
                    </Box>
                </Box>
            </Stack>
        </>
    );
};

export default Explore;
