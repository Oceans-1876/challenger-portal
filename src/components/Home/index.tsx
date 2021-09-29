import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import BarChartIcon from '@mui/icons-material/BarChart';
import SearchIcon from '@mui/icons-material/Search';

import mapImage from '../../images/map_sm.png';

const Home = (): JSX.Element => (
    <Container>
        <Grid container direction="column">
            <Grid container item justifyContent="center">
                <img src={mapImage} alt="World Map" />
            </Grid>
            <Grid container item>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt risus quis vestibulum
                    congue. Phasellus auctor a ipsum at sollicitudin. Vivamus cursus fringilla dolor ut pharetra. Aenean
                    Aenean viverra rhoncus purus, id accumsan ipsum consectetur nec. In eget commodo eros, et accumsan
                    accumsan tortor. Vestibulum sit amet dolor vehicula, luctus mauris ac, semper velit. Maecenas
                    convallis et elit non congue. Vivamus vel ligula id nunc cursus tincidunt. Donec a efficitur ante,
                    ante, vitae dictum sapien. Donec dignissim neque id eros rhoncus vulputate. Duis id risus et orci
                    orci sagittis molestie. Morbi eget tincidunt purus.
                </p>
                <p>
                    Etiam mattis nulla quis ex maximus accumsan. Vivamus pretium tempus dui, sed viverra quam
                    ullamcorper in. Nullam pharetra ullamcorper lectus sed laoreet. Fusce tempor at lorem ac porttitor.
                    porttitor. Morbi pellentesque venenatis quam, et tincidunt mi egestas at. Duis suscipit rhoncus leo
                    leo suscipit efficitur. Nulla et mollis sapien.
                </p>
            </Grid>
            <Grid container item justifyContent="center" spacing={2}>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<SearchIcon />}
                        component={Link}
                        to="/explore"
                    >
                        Explore
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" startIcon={<BarChartIcon />} disabled>
                        Compare
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    </Container>
);

export default Home;
