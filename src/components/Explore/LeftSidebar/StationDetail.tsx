import React, { useCallback, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DataActionDispatcherContext, DataStateContext } from '../../../store/contexts';
import { useStationDetails } from '../../../utils/hooks';
import DownloadButton from '../../DownloadButton';
import Loading from '../../Loading';
import TabsGroup from '../../TabsGroup';
import StationDetails from '../../Station/Details';
import StationEnvironment from '../../Station/Environment';
import StationSpecies from '../../Station/Species';
import StationText from '../../Station/Text';

const StationDetail = () => {
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
    const { filteredStations, selectedFaoArea, selectedStation } = useContext(DataStateContext);

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

    const onNavigate = useCallback(
        (navigate_to: string) => {
            if (!selectedStation) return;
            if (!selectedFaoArea || selectedFaoArea?.code != selectedStation.fao_area) {
                throw '[Invalid State]: A station can only be selected after a FAO area is selected!';
            }
            const group = filteredStations.find((g) => g.faoArea.code === selectedFaoArea.code);
            if (!group) {
                throw '[Invalid State]: FAO area can only be selected from filtered results!';
            }
            const stations = group.stations;
            const index = stations.findIndex((station) => station.name === selectedStation?.name);
            const newIndex =
                navigate_to === 'forward'
                    ? (index + 1 + stations.length) % stations.length
                    : (index - 1 + stations.length) % stations.length;
            dataActionDispatcher({
                type: 'updateSelectedStation',
                station: stations[newIndex]
            });
        },
        [selectedStation, selectedFaoArea, filteredStations]
    );

    return selectedStationDetails ? (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                width: 478,
                p: 1,
                zIndex: 1,
                boxShadow: '1px 0 5px gray',
                pointerEvents: 'all'
            }}
        >
            <Stack direction="row">
                <IconButton size="medium" sx={{ mx: 'auto' }} onClick={() => onNavigate('backward')}>
                    <Icon baseClassName="icons">arrow_back</Icon>
                </IconButton>
                <Typography variant="h5" align="center" sx={{ mx: 'auto' }}>
                    Station {selectedStationDetails?.name}
                </Typography>
                <IconButton size="medium" sx={{ mx: 'auto' }} onClick={() => onNavigate('forward')}>
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

export default StationDetail;
