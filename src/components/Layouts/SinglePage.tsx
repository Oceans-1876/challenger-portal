import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export const headerHeight = 60;

type Props = {
    children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }: Props) => {
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<HTMLElement | null>(null);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <AppBar
                sx={{
                    'height': headerHeight,
                    'color': 'primary.main',
                    'backgroundColor': 'secondary.light',
                    'justifyContent': 'center',
                    '& a': {
                        textDecoration: 'none',
                        color: 'primary.main'
                    }
                }}
                position="relative"
                elevation={0}
                color="transparent"
            >
                <Toolbar>
                    <Typography sx={{ marginRight: 2 }} variant="h4" component={Link} to="/">
                        Oceans 1876
                    </Typography>
                    <Typography variant="h5">HMS Challenger Journey</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }} component={Stack} direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Icon>search</Icon>}
                            component={Link}
                            to="/explore"
                        >
                            Explore
                        </Button>
                        <Button
                            disabled
                            variant="outlined"
                            startIcon={<Icon>bar_chart</Icon>}
                            size="small"
                            component={Link}
                            to="/analysis"
                        >
                            Analysis
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Icon>data_exploration</Icon>}
                            size="small"
                            href={`${API_PATH}/docs`}
                            target="_blank"
                        >
                            API
                        </Button>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton onClick={handleMobileMenuOpen}>
                            <Icon>more_vert</Icon>
                        </IconButton>

                        <Menu
                            anchorEl={mobileMoreAnchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={isMobileMenuOpen}
                            onClose={handleMobileMenuClose}
                        >
                            <MenuItem dense component={Link} to="/explore">
                                <IconButton size="small">
                                    <Icon>search</Icon>
                                </IconButton>
                                <p>Explore</p>
                            </MenuItem>
                            <MenuItem dense disabled component={Link} to="/analysis">
                                <IconButton size="small">
                                    <Icon>bar_chart</Icon>
                                </IconButton>
                                <p>Analysis</p>
                            </MenuItem>
                            <MenuItem dense component="a" href={`${API_PATH}/docs`} target="_blank">
                                <IconButton size="small">
                                    <Icon>data_exploration</Icon>
                                </IconButton>
                                <p>API</p>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box sx={{ border: 30, borderColor: 'secondary.light', height: `calc( 100% - ${headerHeight}px)` }}>
                {children}
            </Box>
        </Box>
    );
};

Layout.defaultProps = {
    children: undefined
};

export default Layout;
