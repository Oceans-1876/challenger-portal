import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DataActionDispatcherContext, DataStateContext } from '../../store/contexts';
import { useStationDetails } from '../../utils/hooks';
import About from '../About';
import DownloadButton from '../DownloadButton';
import Loading from '../Loading';
import TabsGroup from '../TabsGroup';
import StationDetails from '../Station/Details';
import StationEnvironment from '../Station/Environment';
import StationSpecies from '../Station/Species';
import StationText from '../Station/Text';
import Filters from './Filters';

const Sidebar = () => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { selectedStation } = React.useContext(DataStateContext);
    const selectedStationDetails = useStationDetails(selectedStation?.name);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                width: { xs: 500, lg: 550 },
                p: 1,
                zIndex: 1,
                boxShadow: '1px 0 5px gray'
            }}
        >
            {selectedStation ? (
                <>
                    <Typography variant="h5" align="center">
                        Station {selectedStation.name}
                    </Typography>
                    {selectedStationDetails ? (
                        <>
                            <TabsGroup
                                sx={{ flexGrow: 1 }}
                                initialPanel="Station"
                                panels={[
                                    {
                                        Panel: () => <StationDetails station={selectedStationDetails} />,
                                        label: 'Station'
                                    },
                                    {
                                        Panel: () => <StationEnvironment station={selectedStationDetails} />,
                                        label: 'Environment'
                                    },
                                    {
                                        Panel: () => <StationSpecies station={selectedStationDetails} />,
                                        label: 'Species'
                                    },
                                    { Panel: () => <StationText station={selectedStationDetails} />, label: 'Text' }
                                ]}
                            />
                            <Stack direction="row" spacing={1} justifyContent="space-between">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() =>
                                        dataActionDispatcher({ type: 'updateSelectedStation', station: null })
                                    }
                                >
                                    Go Back
                                </Button>
                                <DownloadButton
                                    data={selectedStationDetails}
                                    filename={`Station-${selectedStation.name}-details`}
                                    message="Download Data"
                                />
                                <DownloadButton
                                    data={selectedStationDetails.species}
                                    filename={`Station-${selectedStation.name}-Species`}
                                    message="Download All Species"
                                />
                            </Stack>
                        </>
                    ) : (
                        <Loading />
                    )}
                </>
            ) : (
                <TabsGroup
                    initialPanel="Filters"
                    panels={[
                        {
                            Panel: Filters,
                            label: 'Filters'
                        },
                        {
                            Panel: About,
                            label: 'About'
                        }
                    ]}
                />
            )}
        </Box>
    );
};

export default Sidebar;
