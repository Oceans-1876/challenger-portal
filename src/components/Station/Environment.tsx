import React from 'react';
import Collapse from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import Icon from '@mui/material/Icon';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { decimalFormat } from '../../utils/format';
import RenderUnit from '../RenderUnit';
import { Temperature, Distance } from 'convert-units';

interface Props {
    station: StationDetails;
    tempFromUnit: string;
    setTempFromUnit: Function;
    tempToUnit: string;
    setTempToUnit: Function;
    depthFromUnit: string;
    setDepthFromUnit: Function;
    depthToUnit: string;
    setDepthToUnit: Function;
}

interface Map {
    [key: string]: string;
}

const possibleTempUnits = [
    { value: 'F', unit: 'Fahrenheit' },
    { value: 'C', unit: 'Celcius' }
];

const tempUnitMap: Map = {
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

const depthUnitMap: Map = {
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

const Environment = ({
    station,
    tempFromUnit,
    setTempFromUnit,
    tempToUnit,
    setTempToUnit,
    depthFromUnit,
    setDepthFromUnit,
    depthToUnit,
    setDepthToUnit
}: Props) => {
    const [showWaterTempArDepths, setShowWaterTempArDepths] = React.useState(true);

    // const [tempFromUnit, setTempFromUnit] = React.useState<string>('F');
    // const [tempToUnit, setTempToUnit] = React.useState<string>('C');
    // const [depthFromUnit, setDepthFromUnit] = React.useState<string>('fathom');
    // const [depthToUnit, setDepthToUnit] = React.useState<string>('ft');

    const handleToUnitChange = (e: SelectChangeEvent, unit: string) => {
        if (unit === 'temp') {
            setTempToUnit(e.target.value as string);
        } else if (unit === 'depth') {
            setDepthToUnit(e.target.value as string);
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
        <Stack direction="column">
            <Stack direction="row" spacing={4}>
                <FormControl fullWidth>
                    <InputLabel id="temp-select-label">Temperature Unit</InputLabel>
                    <Select
                        labelId="temp-select-label"
                        value={tempToUnit}
                        label="Temperature Unit"
                        onChange={(event) => handleToUnitChange(event, 'temp')}
                    >
                        {TempUnitMenuItems.map((item) => item)}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="depth-select-label">Depth Unit</InputLabel>
                    <Select
                        labelId="depth-select-label"
                        value={depthToUnit}
                        label="Depth Unit"
                        onChange={(event) => handleToUnitChange(event, 'depth')}
                    >
                        {DepthUnitMenuItems.map((item) => item)}
                    </Select>
                </FormControl>
            </Stack>
            <Stack direction="column">
                <List>
                    <ListItem>
                        <ListItemText primary={<Typography variant="h6">Temperature</Typography>} />
                    </ListItem>
                    <List disablePadding dense>
                        <ListItem sx={{ pl: 4 }}>
                            <b>Surface ({tempToUnit === 'C' ? 'C' : 'F'}):&nbsp;</b>
                            {station.surface_temp_c ? (
                                <>
                                    <RenderUnit
                                        from={tempFromUnit as Temperature}
                                        to={tempToUnit as Temperature}
                                        value={station.surface_temp_c}
                                        precision={3}
                                    />
                                    {`\u00b0`}
                                </>
                            ) : (
                                '-'
                            )}
                        </ListItem>
                        <ListItem sx={{ pl: 4 }}>
                            <b>Bottom Water ({tempToUnit === 'C' ? 'C' : 'F'}):&nbsp;</b>
                            {station.bottom_water_temp_c ? (
                                <>
                                    <RenderUnit
                                        from={tempFromUnit as Temperature}
                                        to={tempToUnit as Temperature}
                                        value={station.bottom_water_temp_c}
                                        precision={3}
                                    />
                                    {`\u00b0`}
                                </>
                            ) : (
                                '-'
                            )}
                        </ListItem>
                    </List>
                    <ListItem>
                        <Typography variant="h6">Depth:&nbsp;</Typography>
                        {station.depth_fathoms ? (
                            <>
                                <RenderUnit
                                    from={depthFromUnit as Distance}
                                    to={depthToUnit as Distance}
                                    value={station.depth_fathoms}
                                    precision={1}
                                />
                                {` ${depthUnitMap[depthToUnit]}`}
                            </>
                        ) : (
                            '-'
                        )}
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={<Typography variant="h6">Specific gravity</Typography>} />
                    </ListItem>
                    <List disablePadding dense>
                        <ListItem sx={{ pl: 4 }}>
                            <b>Surface:&nbsp;</b>
                            {station.specific_gravity_at_surface
                                ? decimalFormat(station.specific_gravity_at_surface, 3)
                                : '-'}
                        </ListItem>
                        <ListItem sx={{ pl: 4 }}>
                            <b>Bottom:&nbsp;</b>
                            {station.specific_gravity_at_bottom
                                ? decimalFormat(station.specific_gravity_at_bottom, 3)
                                : '-'}
                        </ListItem>
                    </List>
                    <ListItemButton onClick={() => setShowWaterTempArDepths(!showWaterTempArDepths)}>
                        <ListItemText primary={<Typography variant="h6">Water temperature at depths</Typography>} />
                        {showWaterTempArDepths ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
                    </ListItemButton>
                    <Collapse in={showWaterTempArDepths} timeout="auto" unmountOnExit>
                        <List disablePadding dense>
                            <TableContainer component={ListItem}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Depth ({depthUnitMap[depthToUnit]})</TableCell>
                                            <TableCell align="center">
                                                Temperature ({tempUnitMap[tempToUnit]})
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.entries(station.water_temp_c_at_depth_fathoms).map(([depth, temp]) => {
                                            if (!temp) {
                                                return null;
                                            }
                                            return (
                                                <TableRow
                                                    key={depth}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="center" component="th" scope="row">
                                                        <RenderUnit
                                                            from={depthFromUnit as Distance}
                                                            to={depthToUnit as Distance}
                                                            value={Number(depth)}
                                                            precision={1}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center" component="th" scope="row">
                                                        <RenderUnit
                                                            from={tempFromUnit as Temperature}
                                                            to={tempToUnit as Temperature}
                                                            value={temp}
                                                            precision={3}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </List>
                    </Collapse>
                </List>
            </Stack>
        </Stack>
    );
};

export default Environment;
