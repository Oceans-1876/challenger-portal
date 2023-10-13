import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DataActionDispatcherContext, DataStateContext } from '../../../store/contexts';
import { useStationDetails } from '../../../utils/hooks';
import Loading from '../../Loading';
import TabsGroup from '../../TabsGroup';
import StationDetails from '../../Station/Details';
import StationEnvironment from '../../Station/Environment';
import StationSpecies from '../../Station/Species';
import StationText from '../../Station/Text';
import { theme } from '../../../theme';
import { ArrowDropDownOutlined, CloseOutlined, FileDownloadOutlined } from '@mui/icons-material';

const StationDetail = () => {
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
    const { selectedStation } = useContext(DataStateContext);

    const selectedStationDetails = useStationDetails(selectedStation?.name);

    return (
        <Box
            sx={{
                width: selectedStation ? 478 : 0,
                background: theme.palette.explore.selected,
                pointerEvents: 'all'
            }}
        >
            <Stack
                sx={{
                    height: '100%',
                    p: '32px',
                    boxSizing: 'border-box',
                    zIndex: 1
                }}
            >
                <Stack direction="row" justifyContent="space-between" sx={{ height: 24 }}>
                    <Typography>{/* Specifications */}</Typography>
                    <CloseOutlined
                        sx={{ cursor: 'pointer', color: theme.palette.explore.secondaryText }}
                        onClick={() => {
                            dataActionDispatcher({ type: 'updateSelectedStation', station: null });
                        }}
                    />
                </Stack>
                <Stack
                    direction="row"
                    sx={{
                        my: '8px',
                        height: 28,
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '16px'
                    }}
                >
                    <Typography
                        align="center"
                        sx={{
                            lineHeight: 1.15,
                            color: 'white',
                            fontSize: '20px',
                            fontWeight: 500
                        }}
                    >
                        Station {selectedStation?.name}
                    </Typography>
                    <Button
                        disabled={!selectedStationDetails}
                        size="small"
                        variant="explore-card-focus"
                        href={`data:text/json;charset=utf-8,${encodeURIComponent(
                            JSON.stringify(selectedStationDetails, null, 4)
                        )}`}
                        download={`Station-${selectedStationDetails?.name}-details.json`}
                        sx={{ px: 0 }}
                    >
                        <FileDownloadOutlined />
                        <ArrowDropDownOutlined />
                    </Button>
                </Stack>
                <TabsGroup
                    sx={{ flex: '1' }}
                    initialPanel="Station"
                    panels={[
                        {
                            Panel: <StationDetails station={selectedStationDetails} />,
                            label: 'Station'
                        },
                        {
                            Panel: <StationEnvironment station={selectedStationDetails} />,
                            label: 'Environment'
                        },
                        {
                            Panel: <StationSpecies station={selectedStationDetails} />,
                            label: 'Species'
                        },
                        {
                            Panel: <StationText station={selectedStationDetails} />,
                            label: 'Text'
                        }
                    ]}
                />
            </Stack>
        </Box>
    );
};

export default StationDetail;
