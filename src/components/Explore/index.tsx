import React from 'react';
import Box from '@mui/material/Box';

import Map from './Map';
import Sidebar from './Sidebar';
import { FilterStateContext, FilterActionDispatcherContext } from '../../store/contexts';
import { filterReducers } from '../../store/reducers';
import { filtersStateInitialValue } from '../../store/states';

const Explore = (): JSX.Element => {
    const [filterState, filterActionDispatcher] = React.useReducer(filterReducers, filtersStateInitialValue);

    return (
        <FilterActionDispatcherContext.Provider value={filterActionDispatcher}>
            <FilterStateContext.Provider value={filterState}>
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
            </FilterStateContext.Provider>
        </FilterActionDispatcherContext.Provider>
    );
};

export default Explore;
