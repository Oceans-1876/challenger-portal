import React, { FC, ReactNode, useContext } from 'react';
import Box from '@mui/material/Box';

import { DataActionDispatcherContext, DataStateContext } from '../../../../store/contexts';
import { theme } from '../../../../theme';
import { ArrowBack } from '@mui/icons-material';
import { Typography } from '@mui/material';
import RegionCard from './RegionCard';

const Scroll: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <Box
            sx={{
                'width': '100%',
                'height': '100%',
                'overflow': 'scroll',
                '&::-webkit-scrollbar': {
                    display: 'none' // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge, etc.)
                },
                '&-ms-overflow-style:': {
                    display: 'none' // Hide the scrollbar for IE
                }
            }}
        >
            {children}
        </Box>
    );
};

const StationsList = () => {
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
    const { filteredStations, selectedFaoArea } = useContext(DataStateContext);

    const selectedGroup = filteredStations.find((g) => g.faoArea.code === selectedFaoArea?.code) ?? null;

    return (
        <Box
            sx={{
                width: 324,
                p: '32px',
                pointerEvents: 'auto',
                background: theme.palette.explore.mainTransparent,
                backdropFilter: 'blur(4px)'
            }}
        >
            {selectedGroup ? (
                <Scroll key={1}>
                    <ArrowBack
                        onClick={() => {
                            dataActionDispatcher({
                                type: 'updateSelectedFaoArea',
                                faoArea: null
                            });
                        }}
                    />
                    <Box>areas select</Box>
                    <Box>
                        {selectedGroup.stations.map((s) => (
                            <Box
                                key={s.name}
                                onClick={() => {
                                    dataActionDispatcher({
                                        type: 'updateSelectedStation',
                                        station: s
                                    });
                                }}
                            >
                                {s.name}
                            </Box>
                        ))}
                    </Box>
                </Scroll>
            ) : (
                <>
                    <Typography sx={{ mb: '16px', fontSize: '12px', color: theme.palette.explore.secondaryText }}>
                        {filteredStations.length} ocean regions found
                    </Typography>
                    <Scroll key={2}>
                        {filteredStations.map((group) => (
                            <RegionCard key={group.faoArea.code} stationGroup={group} />
                        ))}
                    </Scroll>
                </>
            )}
        </Box>
    );
};

export default StationsList;
