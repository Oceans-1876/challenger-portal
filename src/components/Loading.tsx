import React, { FC } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';
import { theme } from '../theme';

const Loading: FC<{ sx?: SxProps }> = ({ sx }) => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: theme.palette.explore.secondary
        }}
    >
        <CircularProgress sx={sx} />
    </Box>
);

export default Loading;
