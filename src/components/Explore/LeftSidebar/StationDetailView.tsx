import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DataActionDispatcherContext, DataStateContext } from '../../../store/contexts';
import { useSpeciesDetails, useStationDetails } from '../../../utils/hooks';
import TabsGroup from '../../TabsGroup';
import StationDetails from '../../Station/Details';
import StationEnvironment from '../../Station/Environment';
import StationSpecies from '../../Station/Species';
import StationText from '../../Station/Text';
import { theme } from '../../../theme';
import { ArrowDropDownOutlined, CloseOutlined, FileDownloadOutlined } from '@mui/icons-material';
import SpeciesDetailView from './SpeciesDetailView';

const StationDetail = () => {
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
    const { selectedStation } = useContext(DataStateContext);

    const selectedStationDetails = useStationDetails(selectedStation?.name);

    const [selectedSpecies, setSelectedSpecies] = useState('');
    const selectedSpeciesDetails = useSpeciesDetails(selectedSpecies);

    return (
        <Stack
            sx={{
                display: selectedStation ? 'flex' : 'none',
                width: 478,
                p: '32px',
                boxSizing: 'border-box',
                zIndex: 1,
                background: theme.palette.explore.selected,
                pointerEvents: 'all'
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

            <Stack sx={{ flex: 'auto', minHeight: 0, position: 'relative' }}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        visibility: selectedSpecies ? 'visible' : 'hidden'
                    }}
                >
                    <SpeciesDetailView species={selectedSpeciesDetails} onClose={() => setSelectedSpecies('')} />
                </Box>

                <Stack
                    sx={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        visibility: selectedSpecies ? 'hidden' : 'visible'
                    }}
                >
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
                        sx={{ flex: 'auto', minHeight: 0 }}
                        initialPanel="Species"
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
                                Panel: (
                                    <StationSpecies
                                        station={selectedStationDetails}
                                        setSelectedSpecies={setSelectedSpecies}
                                    />
                                ),
                                label: 'Species'
                            },
                            {
                                Panel: <StationText station={selectedStationDetails} />,
                                label: 'Text'
                            }
                        ]}
                    />
                </Stack>
            </Stack>
        </Stack>
    );
};

export default StationDetail;
