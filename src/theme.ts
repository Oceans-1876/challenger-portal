import { createTheme } from '@material-ui/core';

export const theme = createTheme({
    palette: {
        primary: {
            dark: '#002e2cff',
            main: '#024654ff',
            light: '#035e7bff',
            contrastText: '#fff'
        },
        secondary: {
            dark: '#e3e7afff',
            main: '#a2a77fff',
            light: '#eff1c5ff',
            contrastText: '#fff'
        }
    },
    typography: {
        fontFamily: ['Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(',')
    }
});
