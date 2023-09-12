import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DataActionDispatcherContext, DataStateContext, FilterStateContext } from '../../../store/contexts';
import { useStationDetails } from '../../../utils/hooks';
import DownloadButton from '../../DownloadButton';
import Loading from '../../Loading';
import TabsGroup from '../../TabsGroup';
import StationDetails from '../../Station/Details';
import StationEnvironment from '../../Station/Environment';
import StationSpecies from '../../Station/Species';
import StationText from '../../Station/Text';
import { searchStations } from '../../../store/api';

const Sidebar = () => {
    const dataActionDispatcher = useContext(DataActionDispatcherContext);

    const [stationsList, setStationList] = useState<StationSummary[]>([]);
    const { filteredStations, filteredSpecies, filteredFAOAreas } = useContext(FilterStateContext);

    useEffect(() => {
        searchStations(
            {
                stationNames: filteredStations,
                faoAreas: filteredFAOAreas,
                species: filteredSpecies,
                dates: []
            },
            (stations) => {
                setStationList(stations);
            }
        );
    }, [filteredFAOAreas, filteredSpecies, filteredStations]);

    useEffect(() => {
        dataActionDispatcher({
            type: 'updateSelectedStation',
            station: stationsList[0]
        });
    }, [stationsList]);

    const { selectedStation } = useContext(DataStateContext);
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
        const index = stationsList.findIndex((station) => station.name === selectedStation?.name);
        const newIndex =
            navigate_to === 'forward'
                ? (index + 1 + stationsList.length) % stationsList.length
                : (index - 1 + stationsList.length) % stationsList.length;
        dataActionDispatcher({
            type: 'updateSelectedStation',
            station: stationsList[newIndex]
        });
    };

    return selectedStationDetails ? (
        <Box
            sx={{
                position: 'absolute',
                left: 0,
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                background: '#fff',
                width: 500,
                p: 1,
                zIndex: 1,
                boxShadow: '1px 0 5px gray'
            }}
        >
            <Stack direction="row">
                <IconButton
                    size="medium"
                    sx={{ mx: 'auto' }}
                    onClick={() => onNavigate(selectedStationDetails.name, 'backward')}
                >
                    <Icon baseClassName="icons">arrow_back</Icon>
                </IconButton>
                <Typography variant="h5" align="center" sx={{ mx: 'auto' }}>
                    Station {selectedStationDetails?.name}
                </Typography>
                <IconButton
                    size="medium"
                    sx={{ mx: 'auto' }}
                    onClick={() => onNavigate(selectedStationDetails.name, 'forward')}
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
                                onClick={() => dataActionDispatcher({ type: 'updateSelectedStation', station: null })}
                            >
                                Go Back
                            </Button>
                            <DownloadButton
                                data={selectedStationDetails}
                                filename={`Station-${selectedStationDetails.name}-details`}
                                message="Download Data"
                            />
                            <DownloadButton
                                data={selectedStationDetails.species}
                                filename={`Station-${selectedStationDetails.name}-Species`}
                                message="Download All Species"
                            />
                        </Stack>
                    </Stack>
                </>
            ) : (
                <Loading />
            )}
        </Box>
    ) : null;
};

export default Sidebar;
