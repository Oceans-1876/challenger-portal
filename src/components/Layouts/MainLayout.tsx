import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import BarChartIcon from '@material-ui/icons/BarChart';

export const headerHeight = '75px';

const useStyles = makeStyles((theme) => ({
    container: {
        flexGrow: 1
    },
    header: {
        'height': headerHeight,
        'minHeight': headerHeight,
        'border': '1px solid #555',
        'color': theme.palette.primary.main,
        'textDecoration': 'none',
        'textTransform': 'uppercase',
        '& a': {
            textDecoration: 'none',
            color: theme.palette.primary.main
        }
    },
    headerToolbar: {
        'minHeight': headerHeight,
        '& > :first-child': {
            flexGrow: 1
        },
        '& > *': {
            marginLeft: theme.spacing(2)
        }
    },
    main: {
        position: 'relative',
        height: `calc(100vh - ${headerHeight})`
    }
}));

type Props = {
    children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }: Props) => {
    const classes = useStyles();

    return (
        <Grid className={classes.container} container component="main">
            <Grid item xs={12}>
                <AppBar className={classes.header} position="relative" elevation={1} color="transparent">
                    <Toolbar className={classes.headerToolbar}>
                        <Typography variant="h4" component={Link} to="/">
                            Oceans 1876 Portal
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<SearchIcon />}
                            component={Link}
                            to="/explore"
                        >
                            Explore
                        </Button>
                        <Button variant="contained" startIcon={<BarChartIcon />} disabled>
                            Compare
                        </Button>
                    </Toolbar>
                </AppBar>
            </Grid>

            <Grid className={classes.main} container item xs={12} alignItems="center">
                {children}
            </Grid>
        </Grid>
    );
};

Layout.defaultProps = {
    children: undefined
};

export default Layout;
