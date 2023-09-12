import React from 'react';

import { Box, Stack } from '@mui/material';
import Map from './Map';
import RightSideBar from './RightSideBar';
import LeftSideBar from './LeftSidebar';
import NavBar from './NavBar';

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
                    <NavBar />
                </Box>
                <Box sx={{ flex: 'auto', position: 'relative' }}>
                    <Box sx={{ pointerEvents: 'auto' }}>
                        <LeftSideBar />
                    </Box>
                    <Box flex="1" />
                    <Box sx={{ pointerEvents: 'auto' }}>
                        <RightSideBar />
                    </Box>
                </Box>
            </Stack>
        </>
    );
};

export default Explore;
