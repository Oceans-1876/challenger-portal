import { Box, Card, Stack, Typography } from '@mui/material';
import React, { FC, useContext } from 'react';
import { DataActionDispatcherContext } from '../../../../store/contexts';
import { theme } from '../../../../theme';
import RegionIcon from './RegionIcon';

type Props = {
    stationGroup: StationGroup;
};

const RegionSummary: FC<Props> = ({ stationGroup }) => {
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
    return (
        <Card
            sx={{
                marginY: '16px',
                borderRadius: '12px',
                background: theme.palette.explore.mainDark,
                padding: '16px'
            }}
            onClick={() => {
                dataActionDispatcher({
                    type: 'updateSelectedFaoArea',
                    faoArea: stationGroup.faoArea
                });
            }}
        >
            <Stack
                direction="row"
                sx={{
                    justifyContent: 'space-between',
                    gap: '12px'
                }}
            >
                <RegionIcon faoArea={stationGroup.faoArea} />
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
            {stationGroup.faoArea.name}
        </Card>
    );
};

export default RegionSummary;
