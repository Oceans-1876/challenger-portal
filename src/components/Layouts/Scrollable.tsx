import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export const headerHeight = 100;

type Props = {
    children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }: Props) => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            border: 40,
            borderColor: 'primary.light'
        }}
    >
        <AppBar
            sx={{
                'height': headerHeight,
                'color': 'primary.main',
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
                <Typography sx={{ flexGrow: 1 }} variant="h4" component={Link} to="/">
                    Oceans 1876
                </Typography>
                <Typography variant="h5">HMS Challenger Journey</Typography>
            </Toolbar>
        </AppBar>

        <Divider />

        <Box sx={{ p: 5 }}>{children}</Box>
    </Box>
);

Layout.defaultProps = {
    children: undefined
};

export default Layout;
