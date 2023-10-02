import { Box, Button, Card, Divider, Stack, Typography } from '@mui/material';
import React, { FC, useContext } from 'react';
import { DataActionDispatcherContext } from '../../../../store/contexts';
import { theme } from '../../../../theme';
import RegionIcon from './RegionIcon';
import { LocationOnOutlined } from '@mui/icons-material';
import * as turf from '@turf/turf';
import { formatLatitude, formatLongitude } from '../../../../utils/format';

type Props = {
    stationGroup: StationGroup;
};

const RegionCard: FC<Props> = ({ stationGroup }) => {
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
    const geometry = stationGroup.faoArea.geometry;
    const bbox = turf.bbox(
        geometry.type == 'MultiPolygon' ? turf.multiPolygon(geometry.coordinates) : turf.polygon(geometry.coordinates)
    );
    return (
        <Card
            sx={{
                mb: '16px',
                borderRadius: '12px',
                background: theme.palette.explore.mainDark,
                padding: '16px'
            }}
        >
            <Stack
                direction="row"
                sx={{
                    justifyContent: 'space-between',
                    gap: '12px'
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <RegionIcon faoArea={stationGroup.faoArea} opacity={0.4} />
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: 4,
                            height: 4,
                            borderRadius: 2,
                            background: '#FF0BF5'
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            width: 4,
                            height: 4,
                            borderRadius: 2,
                            background: '#47FF70'
                        }}
                    />
                </Box>
                <Box flex="auto">
                    {stationGroup.faoArea.name.split(',').map((s) => (
                        <Typography
                            key={s}
                            sx={{
                                fontFamily: 'Roboto',
                                fontSize: '20px',
                                fontWeight: 500,
                                color: 'white'
                            }}
                        >
                            {s}
                        </Typography>
                    ))}
                </Box>
            </Stack>
            <Divider sx={{ height: 2, my: '16px', background: theme.palette.explore.divider }} />
            <Stack direction="row">
                <LocationOnOutlined sx={{ height: 18, verticalAlign: 'middle', fontSize: 14, color: '#FFFFFF99' }} />
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
                    <Stack direction="row" alignItems="center">
                        <Box
                            sx={{
                                width: 4,
                                height: 4,
                                borderRadius: 2,
                                background: '#FF0BF5'
                            }}
                        />

                        <Typography
                            sx={{
                                ml: '4px',
                                color: 'white',
                                fontFamily: 'Roboto',
                                fontSize: 14
                            }}
                        >
                            SW = {formatLatitude(bbox[1])}, {formatLongitude(bbox[0])}
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                        <Box
                            sx={{
                                width: 4,
                                height: 4,
                                borderRadius: 2,
                                background: '#47FF70'
                            }}
                        />
                        <Typography
                            sx={{
                                ml: '4px',
                                color: 'white',
                                fontFamily: 'Roboto',
                                fontSize: 14
                            }}
                        >
                            NE = {formatLatitude(bbox[3])}, {formatLongitude(bbox[2])}
                        </Typography>
                    </Stack>
                </Box>
            </Stack>
            <Box sx={{ textAlign: 'center', mt: '12px', p: '12px' }}>
                <Button
                    size="small"
                    variant="explore-card"
                    onClick={() => {
                        dataActionDispatcher({
                            type: 'updateSelectedFaoArea',
                            faoArea: stationGroup.faoArea
                        });
                    }}
                >
                    View {stationGroup.stations.length} Stations
                </Button>
            </Box>
        </Card>
    );
};

export default RegionCard;
