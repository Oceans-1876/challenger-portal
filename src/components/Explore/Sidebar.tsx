import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
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
    const { selectedStation, stationsList } = React.useContext(DataStateContext);
    const selectedStationDetails = useStationDetails(selectedStation?.name);

    const StationPanel = React.useCallback(
        () => (selectedStationDetails ? <StationDetails station={selectedStationDetails} /> : null),
        [selectedStationDetails]
    );
    const EnvironmentPanel = React.useCallback(
        () => (selectedStationDetails ? <StationEnvironment station={selectedStationDetails} /> : null),
        [selectedStationDetails]
    );
    const SpeciesPanel = React.useCallback(
        () => (selectedStationDetails ? <StationSpecies station={selectedStationDetails} /> : null),
        [selectedStationDetails]
    );
    const TextPanel = React.useCallback(
        () => (selectedStationDetails ? <StationText station={selectedStationDetails} /> : null),
        [selectedStationDetails]
    );

    const onNavigate = (selectedStationName: string, navigate_to: string) => {
        const index: number = stationsList.findIndex(({ name }) => selectedStationName === name);
        let new_station: StationSummary | null = null;
        if (navigate_to === 'forward') {
            new_station = stationsList[(index + 1 + stationsList.length) % stationsList.length];
        } else {
            new_station = stationsList[(index - 1 + stationsList.length) % stationsList.length];
        }
        dataActionDispatcher({ type: 'updateSelectedStation', station: new_station });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                width: { xs: 510, lg: 560 },
                p: 1,
                zIndex: 1,
                boxShadow: '1px 0 5px gray'
            }}
        >
            {selectedStation ? (
                <>
                    <Stack direction="row">
                        <IconButton
                            size="medium"
                            sx={{ mx: 'auto' }}
                            onClick={() => onNavigate(selectedStation.name, 'backward')}
                        >
                            <Icon baseClassName="icons">arrow_back</Icon>
                        </IconButton>
                        <Typography variant="h5" align="center" sx={{ mx: 'auto' }}>
                            Station {selectedStation.name}
                        </Typography>
                        <IconButton
                            size="medium"
                            sx={{ mx: 'auto' }}
                            onClick={() => onNavigate(selectedStation.name, 'forward')}
                        >
                            <Icon baseClassName="icons">arrow_forward</Icon>
                        </IconButton>
                    </Stack>
                    {selectedStationDetails ? (
                        <>
                            <TabsGroup
                                sx={{ flexGrow: 1 }}
                                initialPanel="Station"
                                panels={[
                                    {
                                        Panel: StationPanel,
                                        label: 'Station'
                                    },
                                    {
                                        Panel: EnvironmentPanel,
                                        label: 'Environment'
                                    },
                                    {
                                        Panel: SpeciesPanel,
                                        label: 'Species'
                                    },
                                    {
                                        Panel: TextPanel,
                                        label: 'Text'
                                    }
                                ]}
                            />
                            <Stack direction="column" spacing={2} sx={{ padding: 1 }}>
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
