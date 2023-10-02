import { PaletteOptions, ThemeOptions, createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    type ExplorePaletteKey =
        | 'main'
        | 'mainTransparent'
        | 'mainDark'
        | 'selected'
        | 'unselectedSecondary'
        | 'selectedSecondary'
        | 'secondary'
        | 'highlight'
        | 'divider'
        | 'mainText'
        | 'secondaryText';
    interface Palette {
        explore: Record<ExplorePaletteKey, string>;
    }
    /* eslint no-shadow: "off" */
    interface PaletteOptions {
        explore: Record<ExplorePaletteKey, string>;
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        'explore-text': true;
        'explore-contained': true;
        'explore-card': true;
        'explore-card-focus': true;
    }
}

const palette: PaletteOptions = {
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
    },
    explore: {
        main: '#1d3346',
        mainTransparent: '#1d3346bf',
        mainDark: '#040F20E5',
        selected: '#243c59f2',
        selectedSecondary: '#89f3e94d',
        unselectedSecondary: '#8af8ed4d',
        secondary: '#90fff3',
        highlight: '#ffff00',
        divider: '#90fff380',
        mainText: '#ffffff',
        secondaryText: '#ffffff99'
    }
};

export const themeOptions = {
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536
        }
    },
    palette,
    typography: {
        fontFamily: ['Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'].join(',')
    },
    components: {
        MuiButton: {
            variants: [
                {
                    props: { variant: 'explore-contained' },
                    style: {
                        'textTransform': 'none',
                        'backgroundColor': '#90fff3',
                        'color': '#243c59f2',
                        '&:active, &:hover': {
                            backgroundColor: '#90fff3'
                        },
                        'height': '36px',
                        'borderRadius': '18px'
                    }
                },
                {
                    props: { variant: 'explore-text' },
                    style: {
                        '&.MuiButton-root:hover': {
                            backgroundColor: 'transparent !important'
                        },
                        'textTransform': 'none',
                        'color': '#90fff3'
                    }
                },
                {
                    props: { variant: 'explore-card' },
                    style: {
                        'textTransform': 'none',
                        'backgroundColor': palette.explore.divider,
                        'color': 'white',
                        '&:active, &:hover': {
                            backgroundColor: palette.explore.secondary,
                            color: palette.explore.mainTransparent
                        },
                        'height': '30px',
                        'borderRadius': '15px'
                    }
                },
                {
                    props: { variant: 'explore-card-focus' },
                    style: {
                        'textTransform': 'none',
                        'backgroundColor': palette.explore.secondary,
                        'color': palette.explore.mainTransparent,
                        '&:active, &:hover': {
                            backgroundColor: palette.explore.secondary,
                            color: palette.explore.mainTransparent
                        },
                        'height': '30px',
                        'borderRadius': '15px'
                    }
                }
            ]
        },
        MuiAutocomplete: {
            styleOverrides: {
                listbox: {
                    'color': 'white',
                    'background': '#1d3346',
                    '.MuiAutocomplete-option': {
                        '&.Mui-focused': {
                            backgroundColor: palette.explore.selectedSecondary
                        },
                        '&[aria-selected="true"]': {
                            backgroundColor: palette.explore.selectedSecondary
                        },
                        '&.Mui-focused[aria-selected="true"]': {
                            backgroundColor: palette.explore.selectedSecondary
                        }
                    }
                }
            }
        },
        MuiSlider: {
            styleOverrides: {
                root: {
                    color: palette.explore.secondary
                }
            }
        },
        MuiFormControlLabel: {
            styleOverrides: {
                root: {
                    '.MuiTypography-root': {
                        color: palette.explore.secondaryText,
                        fontFamily: 'Roboto',
                        fontSize: 14,
                        fontWeight: 500,
                        textTransform: 'capitalize'
                    }
                }
            }
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    'color': palette.explore.secondary,
                    '&.Mui-checked': {
                        color: palette.explore.secondary
                    }
                }
            }
        }
    }
} as ThemeOptions;

export const theme = createTheme(themeOptions);

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
