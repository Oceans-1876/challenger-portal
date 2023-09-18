import React, { useReducer, useRef } from 'react';

import { Box, Stack } from '@mui/material';
import Map from './Map';
import RightSidebar from './RightSidebar';
import LeftSidebar from './LeftSidebar';
import Navbar from './Navbar';
import { MapActionDispatcherContext, MapContext, MapStateContext } from '../../store/contexts';
import { mapReducers } from '../../store/reducers';

const Explore = (): JSX.Element => {
    const [mapState, mapStateDispatcher] = useReducer(mapReducers, { activeBasemap: '' });
    const mapRef = useRef<maplibregl.Map | null>(null);

    return (
        <MapStateContext.Provider value={mapState}>
            <MapActionDispatcherContext.Provider value={mapStateDispatcher}>
                <MapContext.Provider value={mapRef}>
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
                            <Box>
                                <LeftSidebar />
                            </Box>
                            <Box flex="1" />
                            <Box sx={{ pointerEvents: 'auto' }}>
                                <RightSidebar />
                            </Box>
                        </Box>
                    </Stack>
                </MapContext.Provider>
            </MapActionDispatcherContext.Provider>
        </MapStateContext.Provider>
    );
};

export default Explore;
