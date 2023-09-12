import React from 'react';

import Map from './Map';
import { FilterStateContext, FilterActionDispatcherContext } from '../../store/contexts';
import { filterReducers } from '../../store/reducers';
import { filtersStateInitialValue } from '../../store/states';
import RightSideBar from './RightSideBar';
import { Box, Stack } from '@mui/material';
import LeftSideBar from './LeftSidebar';
import NavBar from './NavBar';

const Explore = (): JSX.Element => {
    const [filterState, filterActionDispatcher] = React.useReducer(filterReducers, filtersStateInitialValue);

    return (
        <FilterActionDispatcherContext.Provider value={filterActionDispatcher}>
            <FilterStateContext.Provider value={filterState}>
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
            </FilterStateContext.Provider>
        </FilterActionDispatcherContext.Provider>
    );
};

export default Explore;
