import { createTheme, Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

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
        fontFamily: ['Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(',')
    }
});
