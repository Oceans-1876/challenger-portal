import React, { FC, ReactNode, useContext, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';

import { Button, Stack, Typography } from '@mui/material';
import { DataActionDispatcherContext, DataStateContext } from '@app/store/contexts';
import { theme } from '@app/theme';
import RegionCard from './RegionCard';
import RegionIcon from './RegionIcon';
import StationCard from './StationCard';
import { requestScrollIntoView } from '@app/utils/scrollIntoView';
import { ArrowBackOutlined } from '@mui/icons-material';

const Scroll: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <Box
            sx={{
                'scrollBehavior': 'smooth',
                'flex': 'auto',
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

    const activeFaoAreaMenuItemRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (activeFaoAreaMenuItemRef.current) {
            requestScrollIntoView(
                activeFaoAreaMenuItemRef.current,
                {
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                },
                1
            );
        }
    }, [selectedGroup]);

    return (
        <Box
            sx={{
                width: 324,
                p: '32px',
                pb: '40px',
                pointerEvents: 'auto',
                background: theme.palette.explore.mainTransparent,
                backdropFilter: 'blur(4px)'
            }}
        >
            {selectedGroup ? (
                <Stack sx={{ height: '100%' }}>
                    <Box
                        sx={{
                            'width': '100%',
                            'flex': 'none',
                            'scrollBehavior': 'smooth',
                            'overflow': 'scroll',
                            '&::-webkit-scrollbar': {
                                display: 'none' // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge, etc.)
                            },
                            '&-ms-overflow-style:': {
                                display: 'none' // Hide the scrollbar for IE
                            }
                        }}
                    >
                        <Stack direction="row" sx={{}}>
                            {filteredStations.map((group) => {
                                const isActive = group === selectedGroup;
                                return (
                                    <Box
                                        sx={{
                                            'color': theme.palette.explore.secondary,
                                            'opacity': isActive ? 1 : 0.3,
                                            '&:hover': {
                                                opacity: 1
                                            }
                                        }}
                                    >
                                        <Box
                                            ref={isActive ? activeFaoAreaMenuItemRef : null}
                                            key={group.faoArea.code}
                                            sx={{
                                                flex: 'none',
                                                height: 82,
                                                width: 82,
                                                mr: '8px',
                                                borderRadius: '12px',
                                                border: `2px solid ${theme.palette.explore.secondary}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                                dataActionDispatcher({
                                                    type: 'updateSelectedFaoArea',
                                                    faoArea: group.faoArea
                                                });
                                            }}
                                        >
                                            <RegionIcon size={62} faoArea={group.faoArea} />
                                        </Box>
                                        <Box sx={{ mt: '4px' }}>
                                            {group.faoArea.name.split(',').map((s) => (
                                                <Typography
                                                    key={s}
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontSize: '10px',
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    {s}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Box>

                    <Typography sx={{ my: '16px', fontSize: '12px', color: theme.palette.explore.secondaryText }}>
                        {selectedGroup.stations.length} station matches
                    </Typography>

                    <Scroll key={selectedGroup.faoArea.code}>
                        {selectedGroup.stations.map((station) => (
                            <StationCard key={station.name} station={station} />
                        ))}
                    </Scroll>

                    <Button
                        variant="explore-text"
                        sx={{
                            margin: '4px',
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            color: theme.palette.explore.secondary
                        }}
                        onClick={() => {
                            dataActionDispatcher({
                                type: 'updateSelectedFaoArea',
                                faoArea: null
                            });
                        }}
                        startIcon={<ArrowBackOutlined />}
                    >
                        Back
                    </Button>
                </Stack>
            ) : (
                <Stack sx={{ height: '100%' }}>
                    <Typography sx={{ mb: '16px', fontSize: '12px', color: theme.palette.explore.secondaryText }}>
                        {filteredStations.length} ocean regions found
                    </Typography>
                    <Scroll key="ocean-regions">
                        {filteredStations.map((group) => (
                            <RegionCard key={group.faoArea.code} stationGroup={group} />
                        ))}
                    </Scroll>
                </Stack>
            )}
        </Box>
    );
};

export default StationsList;
