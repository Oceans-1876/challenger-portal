import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

// import UnitPreferencesDialog from '../UnitPreferencesDialog';

import { theme } from '../../theme';

export const headerHeight = 64;

const menuItems: Array<{ title: string; path: string; newTab?: boolean }> = [
    {
        title: 'Explore Voyage',
        path: '/explore'
    },
    {
        title: 'Data API',
        path: `${window.API_SERVER}/api/v1/docs`,
        newTab: true
    }
];

const Navbar: FC = () => {
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<HTMLElement | null>(null);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const location = useLocation();

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    return (
        <AppBar
            sx={{
                'height': headerHeight,
                'backgroundColor': theme.palette.explore.mainTransparent,
                'backdropFilter': 'blur(4px)',
                'borderBottom': `2px solid ${theme.palette.explore.secondary}`,
                '& a': {
                    textDecoration: 'none',
                    color: 'primary.contrastText'
                }
            }}
            position="relative"
            elevation={0}
            color="transparent"
        >
            <Toolbar>
                <Box
                    component={Link}
                    to="/"
                    sx={{
                        flex: 'none',
                        color: 'white'
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: 'Proza Libre',
                            fontSize: 16,
                            fontStyle: 'italic',
                            fontWeight: 600
                        }}
                    >
                        Challenger Expedition
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: 'Inter',
                            fontSize: 10
                        }}
                    >
                        HMS Challenger Journey
                    </Typography>
                </Box>
                <Box flex="1" />
                <Box
                    sx={{
                        display: {
                            xs: 'none',
                            md: 'flex'
                        },
                        height: '100%'
                    }}
                    component={Stack}
                    direction="row"
                    spacing="32px"
                >
                    {menuItems.map((item) => (
                        <Button
                            key={item.path}
                            variant="text"
                            size="small"
                            component={Link}
                            to={item.path}
                            target={item.newTab ? '_blank' : '_self'}
                            sx={{
                                'ml': '32px',
                                'textTransform': 'none',
                                'fontFamily': 'JetBrains Mono',
                                'fontWeight': 800,
                                'height': '100%',
                                'color': `${
                                    location.pathname.startsWith(item.path)
                                        ? theme.palette.explore.highlight
                                        : theme.palette.explore.secondary
                                } !important`,
                                '::after': {
                                    content: '""',
                                    display: location.pathname.startsWith(item.path) ? 'block' : 'none',
                                    position: 'absolute',
                                    bottom: 0,
                                    height: 17,
                                    width: '100%',
                                    backgroundColor: theme.palette.explore.highlight
                                }
                            }}
                        >
                            {item.title}
                        </Button>
                    ))}
                    {/* <Button variant="text" size="small" onClick={openPreferencesDialog} sx={{ color: 'white' }}>
                            Preferences
                        </Button> */}
                </Box>
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <IconButton onClick={handleMobileMenuOpen}>
                        <Icon baseClassName="icons">more_vert</Icon>
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
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.path}
                                dense
                                component={Link}
                                to={item.path}
                                target={item.newTab ? '_blank' : '_self'}
                            >
                                <p>{item.title}</p>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
