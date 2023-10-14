import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import InsetMap from './InsetMap';
import DetailView from './DetailView';
import StationsList from './StationList';
import { DataStateContext } from '../../../store/contexts';

const DETAIL_VIEW_WIDTH = 478;
const MARGIN = 10;

const LeftSidebar = () => {
    const { selectedStation } = useContext(DataStateContext);

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
            <Stack
                sx={{
                    position: 'relative',
                    zIndex: -1,
                    transform: `translate(${selectedStation ? 0 : -(DETAIL_VIEW_WIDTH + MARGIN)}px, 0)`,
                    transition: 'all 0.2s ease-in-out'
                }}
                direction="row"
            >
                <Box
                    sx={{
                        boxSizing: 'border-box',
                        width: DETAIL_VIEW_WIDTH,
                        opacity: selectedStation ? 1 : 0,
                        mt: `${MARGIN}px`,
                        ml: `${MARGIN}px`
                    }}
                >
                    <DetailView />
                </Box>
                <Box
                    sx={{
                        mt: `${MARGIN}px`,
                        ml: `${MARGIN}px`
                    }}
                >
                    <InsetMap />
                </Box>
            </Stack>
        </Stack>
    );
};

export default LeftSidebar;
