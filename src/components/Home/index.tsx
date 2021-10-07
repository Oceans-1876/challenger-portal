import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';

import mapImage from '../../images/map_sm.png';

const Home = (): JSX.Element => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70%', m: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '75%', mb: 3 }}>
            <Card raised>
                <CardActionArea component={Link} to="/explore">
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            width: 275,
                            height: 200
                        }}
                    >
                        <Icon sx={{ fontSize: '6rem' }} baseClassName="icons">
                            search
                        </Icon>
                        <Typography variant="h6" align="center">
                            Explore HMS Challenger Data and Journey
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Card raised>
                <CardActionArea disabled component={Link} to="/explore">
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            width: 275,
                            height: 200
                        }}
                    >
                        <Icon sx={{ fontSize: '6rem' }} baseClassName="icons">
                            bar_chart
                        </Icon>
                        <Typography variant="h6" align="center">
                            Analysis of HMS Challenger Data
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
        <img src={mapImage} alt="World Map" />
        <Typography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt risus quis vestibulum congue.
            Phasellus auctor a ipsum at sollicitudin. Vivamus cursus fringilla dolor ut pharetra. Aenean Aenean viverra
            rhoncus purus, id accumsan ipsum consectetur nec. In eget commodo eros, et accumsan accumsan tortor.
            Vestibulum sit amet dolor vehicula, luctus mauris ac, semper velit. Maecenas convallis et elit non congue.
            Vivamus vel ligula id nunc cursus tincidunt. Donec a efficitur ante, ante, vitae dictum sapien. Donec
            dignissim neque id eros rhoncus vulputate. Duis id risus et orci orci sagittis molestie. Morbi eget
            tincidunt purus.
        </Typography>
        <Typography variant="body1">
            Etiam mattis nulla quis ex maximus accumsan. Vivamus pretium tempus dui, sed viverra quam ullamcorper in.
            Nullam pharetra ullamcorper lectus sed laoreet. Fusce tempor at lorem ac porttitor. porttitor. Morbi
            pellentesque venenatis quam, et tincidunt mi egestas at. Duis suscipit rhoncus leo leo suscipit efficitur.
            Nulla et mollis sapien.
        </Typography>
    </Box>
);

export default Home;
