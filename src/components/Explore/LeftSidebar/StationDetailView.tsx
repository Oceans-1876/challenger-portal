import React, { FC, useContext } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DataStateContext } from '../../../store/contexts';
import { useStationDetails } from '../../../utils/hooks';
import TabsGroup from '../../TabsGroup';
import StationDetails from '../../Station/Details';
import StationEnvironment from '../../Station/Environment';
import StationSpecies from '../../Station/Species';
import StationText from '../../Station/Text';
import { theme } from '../../../theme';
import { ArrowDropDownOutlined, FileDownloadOutlined } from '@mui/icons-material';

const StationDetailView: FC = () => {
    const { selectedStation } = useContext(DataStateContext);
    const selectedStationDetails = useStationDetails(selectedStation?.name);

    return (
        <Stack sx={{ height: '100%' }}>
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
                sx={{
                    flex: 'auto',
                    minHeight: 0 // allow the box to shrink past its content height
                }}
                TabIndicatorProps={{
                    sx: {
                        background: theme.palette.explore.secondary,
                        // make sure the indicator doesn't linger when the species detail view is open.
                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1), visibility 0ms'
                    }
                }}
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
    );
};

export default StationDetailView;
