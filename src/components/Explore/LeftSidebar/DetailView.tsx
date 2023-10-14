import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DataActionDispatcherContext, DataStateContext } from '../../../store/contexts';
import { theme } from '../../../theme';
import { CloseOutlined } from '@mui/icons-material';
import SpeciesDetailView from './SpeciesDetailView';
import StationDetailView from './StationDetailView';

const DetailView = () => {
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
    const { selectedStation, selectedSpecies } = useContext(DataStateContext);

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
                <Box sx={{ flex: 'auto', position: 'relative' }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            visibility: selectedSpecies ? 'visible' : 'hidden',
                            zIndex: 1
                        }}
                    >
                        <SpeciesDetailView />
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            visibility: selectedSpecies ? 'hidden' : 'visible',
                            zIndex: 0
                        }}
                    >
                        <StationDetailView />
                    </Box>
                </Box>
            ) : null}
        </Stack>
    );
};

export default DetailView;
