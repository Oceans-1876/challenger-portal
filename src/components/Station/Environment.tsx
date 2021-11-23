import React from 'react';
import Box from '@mui/material/Box';
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

import { decimalFormat } from '../../utils/format';
import { useStationDetails } from '../../utils/hooks';
import Loading from '../Loading';
import DownloadButton from './DownloadButton';

interface Props {
    station: StationSummary;
}

const Environment = ({ station }: Props) => {
    const stationDetails = useStationDetails(station.name);
    const [showWaterTempArDepths, setShowWaterTempArDepths] = React.useState(true);

    return stationDetails ? (
        <Box>
            <List>
                <ListItem>
                    <ListItemText primary={<Typography variant="h6">Temperature</Typography>} />
                </ListItem>
                <List disablePadding dense>
                    <ListItem sx={{ pl: 4 }}>
                        <b>Surface (C):&nbsp;</b>
                        {stationDetails.surface_temp_c ? `${decimalFormat(stationDetails.surface_temp_c)}\u00b0` : '-'}
                    </ListItem>
                    <ListItem sx={{ pl: 4 }}>
                        <b>Bottom Water (C):&nbsp;</b>
                        {stationDetails.bottom_water_temp_c
                            ? `${decimalFormat(stationDetails.bottom_water_temp_c)}\u00b0`
                            : '-'}
                    </ListItem>
                </List>
                <ListItem>
                    <Typography variant="h6">Depth:&nbsp;</Typography>
                    {stationDetails.depth_fathoms ? `${stationDetails.depth_fathoms} fathoms` : '-'}
                </ListItem>
                <ListItem>
                    <ListItemText primary={<Typography variant="h6">Specific gravity</Typography>} />
                </ListItem>
                <List disablePadding dense>
                    <ListItem sx={{ pl: 4 }}>
                        <b>Surface:&nbsp;</b>
                        {stationDetails.specific_gravity_at_surface
                            ? decimalFormat(stationDetails.specific_gravity_at_surface, 3)
                            : '-'}
                    </ListItem>
                    <ListItem sx={{ pl: 4 }}>
                        <b>Bottom:&nbsp;</b>
                        {stationDetails.specific_gravity_at_bottom
                            ? decimalFormat(stationDetails.specific_gravity_at_bottom, 3)
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
                                        <TableCell align="center">Depth (fathom)</TableCell>
                                        <TableCell align="center">Temperature (C)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(stationDetails.water_temp_c_at_depth_fathoms).map(
                                        ([depth, temp]) => {
                                            if (!temp) {
                                                return null;
                                            }
                                            return (
                                                <TableRow
                                                    key={depth}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="center" component="th" scope="row">
                                                        {depth}
                                                    </TableCell>
                                                    <TableCell align="center" component="th" scope="row">
                                                        {`${temp}\u00b0`}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </List>
                </Collapse>
            </List>
            <DownloadButton
                data={stationDetails}
                filename={`Station-${stationDetails.name}-details`}
                message="Download Station Details"
            />
        </Box>
    ) : (
        <Loading />
    );
};

export default Environment;
