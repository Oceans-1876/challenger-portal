import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loading = (): JSX.Element => (
    <Box className="fillContainer" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
    </Box>
);

export default Loading;
