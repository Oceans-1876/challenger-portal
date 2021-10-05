import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export const headerHeight = '75px';

type Props = {
    children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }: Props) => (
    <Grid sx={{ flexGrow: 1 }} container component="main">
        <Grid item xs={12}>
            <AppBar
                sx={{
                    'height': headerHeight,
                    'minHeight': headerHeight,
                    'border': '1px solid #555',
                    'color': 'primary.main',
                    'textDecoration': 'none',
                    'textTransform': 'uppercase',
                    '& a': {
                        textDecoration: 'none',
                        color: 'primary.main'
                    }
                }}
                position="relative"
                elevation={1}
                color="transparent"
            >
                <Toolbar
                    sx={{
                        'minHeight': headerHeight,
                        '& > :first-child': {
                            flexGrow: 1
                        },
                        '& > *': {
                            marginLeft: 2
                        }
                    }}
                >
                    <Typography variant="h4" component={Link} to="/">
                        Oceans 1876 Portal
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Icon>search</Icon>}
                        component={Link}
                        to="/explore"
                    >
                        Explore
                    </Button>
                    <Button variant="contained" startIcon={<Icon>bar_chart</Icon>} disabled>
                        Compare
                    </Button>
                </Toolbar>
            </AppBar>
        </Grid>

        <Grid
            sx={{ position: 'relative', height: `calc(100vh - ${headerHeight})` }}
            container
            item
            xs={12}
            alignItems="center"
        >
            {children}
        </Grid>
    </Grid>
);

Layout.defaultProps = {
    children: undefined
};

export default Layout;
