import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DataActionDispatcherContext, DataStateContext } from '@app/store/contexts';
import { theme } from '@app/theme';
import { CloseOutlined } from '@mui/icons-material';
import { useSpeciesDetails } from '@app/utils/hooks';
import SpeciesDetailView from './SpeciesDetailView';
import StationDetailView from './StationDetailView';

export const DETAIL_VIEW_WIDTH = 478;

const DetailView = () => {
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
    const { selectedStation, selectedSpecies } = useContext(DataStateContext);
    const selectedSpeciesDetails = useSpeciesDetails(selectedSpecies?.id);

    return (
        <Stack
            sx={{
                height: '100%',
                p: '32px',
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

            {selectedStation ? (
                <Box sx={{ flex: 'auto', position: 'relative', minHeight: 0 }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            opacity: selectedSpeciesDetails ? 0 : 1
                        }}
                    >
                        <StationDetailView />
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            overflow: 'hidden',
                            pointerEvents: 'none'
                        }}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                transform: `translateX(${selectedSpeciesDetails ? 0 : DETAIL_VIEW_WIDTH}px)`,
                                opacity: selectedSpeciesDetails ? 1 : 0,
                                transition: 'all 0.2s ease-in-out, opacity 0s',
                                pointerEvents: 'all'
                            }}
                        >
                            <SpeciesDetailView />
                        </Box>
                    </Box>
                </Box>
            ) : null}
        </Stack>
    );
};

export default DetailView;
