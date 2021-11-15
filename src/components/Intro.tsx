import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

const Intro = () => (
    <Box>
        <Skeleton height={200} />
        <Typography variant="body1">Start by selecting a station from the map to see its details.</Typography>
        <Typography variant="body1">You can filter out the stations from the filter bar above.</Typography>
        <Box color="red">TODO ACTUAL TEXT</Box>
    </Box>
);

export default Intro;
