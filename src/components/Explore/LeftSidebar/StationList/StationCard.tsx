import { Box, Button, Card, Chip, Divider, Stack, Typography } from '@mui/material';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { LocationOnOutlined, ScienceOutlined, SettingsOutlined } from '@mui/icons-material';
import { DataActionDispatcherContext, DataStateContext } from '../../../../store/contexts';
import { theme } from '../../../../theme';
import { requestScrollIntoView } from '../../../../utils/scrollIntoView';

type Props = {
    station: StationSummary;
};

const StationCard: FC<Props> = ({ station }) => {
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
    const { focusedStation, selectedStation } = useContext(DataStateContext);
    const [isHovered, setIsHovered] = useState(false);
    const isFocused = focusedStation?.name === station.name;
    const isSelected = selectedStation?.name === station.name;
    const elementRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let timer = -1;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        let abort = () => {};
        if (isFocused || isSelected) {
            if (elementRef.current && elementRef.current.parentElement) {
                const el = elementRef.current;
                // wait until CSS transition has completed
                timer = window.setTimeout(() => {
                    abort = requestScrollIntoView(el, {
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center'
                    });
                }, 100);
            }
        }
        return () => {
            abort(); // If the timer has expired, the scroll action has been requested
            window.clearTimeout(timer); // Otherwise, we just need to cancel the timer
        };
    }, [isSelected, isFocused]);

    return (
        <Box ref={elementRef}>
            <Card
                sx={{
                    mb: '16px',
                    borderRadius: '12px',
                    background:
                        isFocused || isSelected ? theme.palette.explore.selected : theme.palette.explore.mainDark,
                    border: isFocused || isSelected ? `2px solid ${theme.palette.explore.secondary}` : 'none',
                    padding: '16px'
                }}
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={() => setIsHovered(false)}
            >
                <Typography
                    sx={{
                        color: '#FFFFFF99',
                        fontFamily: 'Roboto',
                        fontSize: 12
                    }}
                >
                    Station
                </Typography>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                        sx={{
                            fontFamily: 'Roboto',
                            fontSize: '20px',
                            fontWeight: 500,
                            color: 'white'
                        }}
                    >
                        {station.name}
                    </Typography>
                    <Chip
                        size="small"
                        variant="filled"
                        sx={{ background: theme.palette.explore.unselectedSecondary, color: 'white' }}
                        label={station.date}
                    />
                </Stack>

                <Divider sx={{ height: 2, my: '16px', background: theme.palette.explore.divider }} />

                <Stack direction="row">
                    <LocationOnOutlined
                        sx={{ height: 18, verticalAlign: 'middle', fontSize: 14, color: '#FFFFFF99' }}
                    />
                    <Box sx={{ ml: '4px' }}>
                        <Typography
                            sx={{
                                color: '#FFFFFF99',
                                fontFamily: 'Roboto',
                                fontSize: 12
                            }}
                        >
                            Location
                        </Typography>
                        <Typography
                            sx={{
                                ml: '4px',
                                color: 'white',
                                fontFamily: 'Roboto',
                                fontSize: 14
                            }}
                        >
                            {station.location ?? '-'}
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" sx={{ mt: '10px' }}>
                    <SettingsOutlined sx={{ height: 18, verticalAlign: 'middle', fontSize: 14, color: '#FFFFFF99' }} />
                    <Box sx={{ ml: '4px' }}>
                        <Typography
                            sx={{
                                color: '#FFFFFF99',
                                fontFamily: 'Roboto',
                                fontSize: 12
                            }}
                        >
                            Gear
                        </Typography>
                        <Typography
                            sx={{
                                ml: '4px',
                                color: 'white',
                                fontFamily: 'Roboto',
                                fontSize: 14
                            }}
                        >
                            {station.gear ?? '-'}
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" sx={{ mt: '10px' }}>
                    <ScienceOutlined sx={{ height: 18, verticalAlign: 'middle', fontSize: 14, color: '#FFFFFF99' }} />
                    <Box sx={{ ml: '4px' }}>
                        <Typography
                            sx={{
                                color: '#FFFFFF99',
                                fontFamily: 'Roboto',
                                fontSize: 12
                            }}
                        >
                            Sediment Sample
                        </Typography>
                        <Typography
                            sx={{
                                ml: '4px',
                                color: 'white',
                                fontFamily: 'Roboto',
                                fontSize: 14
                            }}
                        >
                            {station.sediment_sample ?? '-'}
                        </Typography>
                    </Box>
                </Stack>

                <Box
                    sx={{
                        textAlign: 'center',
                        transition: '0.2s all ease-out',
                        overflow: 'hidden',
                        ...(isHovered || isFocused || isSelected
                            ? {
                                  mt: '12px',
                                  p: '12px'
                              }
                            : {
                                  height: 0
                              })
                    }}
                >
                    <Button
                        size="small"
                        variant="explore-card"
                        sx={{
                            opacity: isHovered || isFocused || isSelected ? 1 : 0.1,
                            transition: '0.2s all ease-out'
                        }}
                        onClick={() => {
                            dataActionDispatcher({
                                type: 'updateSelectedStation',
                                station
                            });
                        }}
                    >
                        View More
                    </Button>
                </Box>
            </Card>
        </Box>
    );
};

export default StationCard;
