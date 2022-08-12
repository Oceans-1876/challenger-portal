import React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const About = () => (
    <Box>
        <Typography variant="body1">
            See the code on&nbsp;
            <Link href="https://github.com/oceans-1876" target="_blank">
                Github
            </Link>
            .
        </Typography>
        <Box color="red">TODO ACTUAL TEXT</Box>
    </Box>
);

export default About;
