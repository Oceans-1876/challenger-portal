import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            dark: '#002e2c',
            main: '#024654',
            light: '#035e7b',
            contrastText: '#fff'
        },
        secondary: {
            dark: '#e3e7af',
            main: '#a2a77f',
            light: '#eff1c5',
            contrastText: '#fff'
        }
    },
    typography: {
        fontFamily: ['Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'].join(',')
    }
});

theme.typography.h1 = {
    fontSize: '6rem',
    [theme.breakpoints.down('md')]: {
        fontSize: '5.5rem'
    }
};

theme.typography.h2 = {
    fontSize: '3.75rem',
    [theme.breakpoints.down('md')]: {
        fontSize: '3rem'
    }
};

theme.typography.h3 = {
    fontSize: '3rem',
    [theme.breakpoints.down('md')]: {
        fontSize: '2.75rem'
    }
};

theme.typography.h4 = {
    fontSize: '2.125rem',
    [theme.breakpoints.down('md')]: {
        fontSize: '2rem'
    }
};

theme.typography.h5 = {
    fontSize: '1.5rem',
    [theme.breakpoints.down('md')]: {
        fontSize: '1.25rem'
    }
};

theme.typography.h6 = {
    fontSize: '1.25rem',
    [theme.breakpoints.down('md')]: {
        fontSize: '1rem'
    }
};
