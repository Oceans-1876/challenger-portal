import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';

import type { SxProps } from '@mui/system';

import mapImage from '../../images/map_sm.png';

const styles: { [k: string]: SxProps } = {
    actionCard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: { xs: 130, md: 225, lg: 250 },
        height: 200
    },
    actionCardIcon: {
        fontSize: { xs: '4rem', md: '6rem' }
    }
};

const Home = (): JSX.Element => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 3, width: '100%' }}>
            <Card raised>
                <CardActionArea component={Link} to="/explore">
                    <CardContent sx={styles.actionCard}>
                        <Icon sx={styles.actionCardIcon} baseClassName="icons">
                            search
                        </Icon>
                        <Typography variant="h6" align="center">
                            Explore HMS Challenger Data and Journey
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Card raised>
                <CardActionArea disabled component={Link} to="/analysis">
                    <CardContent sx={styles.actionCard}>
                        <Icon sx={styles.actionCardIcon} baseClassName="icons">
                            bar_chart
                        </Icon>
                        <Typography variant="h6" align="center">
                            Analysis of HMS Challenger Data
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Card raised>
                <CardActionArea href={`${API_PATH}/docs`} target="_blank">
                    <CardContent sx={styles.actionCard}>
                        <Icon sx={styles.actionCardIcon} baseClassName="icons">
                            data_exploration
                        </Icon>
                        <Typography variant="h6" align="center">
                            HMS Challenger Data API
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
        <Card sx={{ mb: 2 }}>
            <CardMedia component="img" image={mapImage} alt="World Map" />
        </Card>
        <Box sx={{ width: '75%' }}>
            <Typography variant="subtitle1">
                Explore the world&#39;s oceans with <i>HMS Challenger</i> on her monumental four-year odyssey (1872-76)!
                Search for marine species, and compare the ocean temperatures and chemistry of the pre-industrial age
                150 years ago with the warming seas of today. Click on the <i>Oceans 1876</i> map, and zoom in on any of
                the 364 stations from Hawaii to Antarctica for information on <i>Challenger&#39;s</i> amazing
                discoveries…
            </Typography>
            <Typography sx={{ textAlign: 'center', p: 3 }} variant="h4">
                Background
            </Typography>
            <Typography variant="subtitle1">
                In December 1872, <i>HMS Challenger</i>, a small British warship converted into the world&#39;s first
                floating laboratory left Portsmouth on a four-year voyage across the globe. Its pathbreaking mission was
                to chart the ocean floor, measure ocean temperatures and chemistry, and collect marine specimens from
                worldwide coastal shores, reefs, and the unexplored deep sea.
            </Typography>
            <Typography variant="subtitle1">
                By the voyage&#39;s end, <i>Challenger</i> had wildly exceeded even these ambitious expectations.
                Sailing nearly 70,000 miles, and recording data at over 360 individual stations, <i>Challenger</i>{' '}
                identified the world&#39;s major ocean basins and currents as well as 4,700 new species of marine
                creatures and plants.
            </Typography>
            <Typography variant="subtitle1">
                The thousands of bottled specimens, deposited largely in the Natural History Museum in London, plus
                fifty published volumes of <i>Challenger</i> data, inaugurated the modern fields of oceanography and
                marine biology.
            </Typography>
            <Typography variant="subtitle1">
                Here, for the first time, <i>Challenger&#39;s</i> vast trove of groundbreaking data is at everyone&#39;s
                fingertips, with vital lessons for today&#39;s world. How have our oceans, and their creatures, been
                transformed over the last 150 years? And how can we protect the wonderful diversity of marine life into
                an uncertain future?
            </Typography>
        </Box>
    </Box>
);

export default Home;
