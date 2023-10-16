import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';

import { DataActionDispatcherContext, DataStateContext } from '@app/store/contexts';

interface Props {
    open: boolean;
    onClose: () => void;
}

interface Map {
    [key: string]: string;
}

const possibleTempUnits = [
    { value: 'F', unit: 'Fahrenheit' },
    { value: 'C', unit: 'Celcius' }
];

export const tempUnitMap: Map = {
    F: 'Fahrenheit',
    C: 'Celcius'
};

const possibleDepthUnits = [
    { value: 'mm', unit: 'Milimeters' },
    { value: 'cm', unit: 'Centimeters' },
    { value: 'm', unit: 'Meters' },
    { value: 'km', unit: 'Kilometers' },
    { value: 'in', unit: 'Inches' },
    { value: 'ft', unit: 'Feets' },
    { value: 'yd', unit: 'Yards' },
    { value: 'mi', unit: 'Miles' },
    { value: 'fathom', unit: 'Fathom' }
];

export const depthUnitMap: Map = {
    fathom: 'Fathom',
    mm: 'Milimeters',
    cm: 'Centimeters',
    m: 'Meters',
    km: 'Kilometers',
    in: 'Inches',
    ft: 'Feets',
    yd: 'Yards',
    mi: 'Miles'
};

const UnitPreferencesDialog = ({ open, onClose }: Props) => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { tempToUnit, depthToUnit } = React.useContext(DataStateContext);

    const handleToUnitChange = (e: SelectChangeEvent, unit: string) => {
        if (unit === 'temp') {
            dataActionDispatcher({ type: 'updateTempToUnit', unit: e.target.value as string });
        } else if (unit === 'depth') {
            dataActionDispatcher({ type: 'updateDepthToUnit', unit: e.target.value as string });
        }
    };

    const TempUnitMenuItems = possibleTempUnits.map(({ value, unit }) => {
        return (
            <MenuItem value={value} key={value}>
                {unit}
            </MenuItem>
        );
    });

    const DepthUnitMenuItems = possibleDepthUnits.map(({ value, unit }) => {
        return (
            <MenuItem value={value} key={value}>
                {unit}
            </MenuItem>
        );
    });

    return (
        <Dialog open={open} onClose={onClose} fullWidth scroll="paper">
            <DialogTitle>Set Metric Preferences</DialogTitle>
            <DialogContent>
                <Stack direction="row" spacing={4} sx={{ padding: 2 }}>
                    <FormControl fullWidth sx={{ height: '50px' }}>
                        <InputLabel id="temp-select-label">Temperature Unit</InputLabel>
                        <Select
                            size="medium"
                            labelId="temp-select-label"
                            value={tempToUnit}
                            label="Temperature Unit"
                            onChange={(event) => handleToUnitChange(event, 'temp')}
                        >
                            {TempUnitMenuItems.map((item) => item)}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mt: '5px' }}>
                        <InputLabel id="depth-select-label">Depth Unit</InputLabel>
                        <Select
                            size="medium"
                            labelId="depth-select-label"
                            value={depthToUnit}
                            label="Depth Unit"
                            onChange={(event) => handleToUnitChange(event, 'depth')}
                        >
                            {DepthUnitMenuItems.map((item) => item)}
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Done</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UnitPreferencesDialog;
