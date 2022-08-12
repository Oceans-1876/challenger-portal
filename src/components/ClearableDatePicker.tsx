import React from 'react';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { InputProps } from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { Dayjs } from 'dayjs';

export interface DatePickerClearableInputProps extends Partial<InputProps> {
    endAdornment?: React.ReactElement;
}

interface Props {
    inputProps: DatePickerClearableInputProps;
    textFieldProps: TextFieldProps;
    value: Dayjs | null;
    onClear: () => void;
}

const DatePickerClearableTextField = ({
    inputProps: { endAdornment, ...otherInputProps },
    textFieldProps,
    value,
    onClear
}: Props) => {
    const getAdornment = () => {
        if (endAdornment) {
            const clearIcon = (
                <IconButton key="clearButton" onClick={onClear}>
                    <Icon baseClassName="icons">close</Icon>
                </IconButton>
            );
            return React.cloneElement(
                endAdornment,
                {},
                value
                    ? [clearIcon, ...React.Children.toArray(endAdornment.props.children)]
                    : endAdornment.props.children
            );
        }
        return null;
    };
    return (
        <TextField
            {...textFieldProps}
            InputProps={{
                ...otherInputProps,
                endAdornment: <InputAdornment position="end">{getAdornment()}</InputAdornment>
            }}
        />
    );
};

export default DatePickerClearableTextField;
