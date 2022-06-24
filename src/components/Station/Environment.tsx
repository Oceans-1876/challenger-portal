import React from 'react';
import Collapse from '@mui/material/Collapse';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { TemperatureUnits, LengthUnits } from 'convert-units';
import { DataStateContext } from '../../store/contexts';
import { decimalFormat } from '../../utils/format';
import RenderUnit from '../RenderUnit';
import { depthUnitMap, tempUnitMap } from '../UnitPreferencesDialog';

interface Props {
    station: StationDetails;
}

const Environment = ({ station }: Props) => {
    const [showWaterTempArDepths, setShowWaterTempArDepths] = React.useState(true);
    const { tempToUnit, depthToUnit } = React.useContext(DataStateContext);
    const tempFromUnit = 'F';
    const depthFromUnit = 'fathom';

    return (
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
                                from={tempFromUnit as TemperatureUnits}
                                to={tempToUnit as TemperatureUnits}
                                value={station.surface_temp_c}
                                precision={3}
                            />
                            {'\u00b0'}
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
                                from={tempFromUnit as TemperatureUnits}
                                to={tempToUnit as TemperatureUnits}
                                value={station.bottom_water_temp_c}
                                precision={3}
                            />
                            {'\u00b0'}
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
                            from={depthFromUnit as LengthUnits}
                            to={depthToUnit as LengthUnits}
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
                    {station.specific_gravity_at_surface ? decimalFormat(station.specific_gravity_at_surface, 3) : '-'}
                </ListItem>
                <ListItem sx={{ pl: 4 }}>
                    <b>Bottom:&nbsp;</b>
                    {station.specific_gravity_at_bottom ? decimalFormat(station.specific_gravity_at_bottom, 3) : '-'}
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
                                    <TableCell align="center">Temperature ({tempUnitMap[tempToUnit]})</TableCell>
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
                                                    from={depthFromUnit as LengthUnits}
                                                    to={depthToUnit as LengthUnits}
                                                    value={Number(depth)}
                                                    precision={1}
                                                />
                                            </TableCell>
                                            <TableCell align="center" component="th" scope="row">
                                                <RenderUnit
                                                    from={tempFromUnit as TemperatureUnits}
                                                    to={tempToUnit as TemperatureUnits}
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
    );
};

export default Environment;
