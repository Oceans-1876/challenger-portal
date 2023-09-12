import { SxProps } from '@mui/material';
import { theme } from '../../../theme';

export const chipStyleOverride: SxProps = {
    ml: '8px',
    color: theme.palette.explore.mainText,
    borderColor: theme.palette.explore.secondary
};

export const selectStyleOverride: SxProps = {
    '.MuiFormLabel-root': {
        'color': `${theme.palette.explore.secondaryText} !important`,
        '&.Mui-focused': {
            color: `${theme.palette.explore.secondary} !important`
        }
    },
    '.MuiSvgIcon-root': {
        color: `${theme.palette.explore.secondary} !important`
    },
    '.MuiOutlinedInput-notchedOutline': {
        borderColor: `${theme.palette.explore.secondary} !important`,
        color: theme.palette.explore.secondaryText
    },
    'input': {
        color: theme.palette.explore.mainText,
        border: theme.palette.explore.secondary
    }
};
