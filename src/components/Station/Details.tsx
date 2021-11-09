import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { decimalFormat } from '../../utils/format';
import { useStationDetails } from '../../utils/hooks';
import Loading from '../Loading';

interface Props {
    station: StationSummary;
}

const Details = ({ station }: Props) => {
    const stationDetails = useStationDetails(station.name);

    return stationDetails ? (
        <List>
            <ListItem>
                <Typography variant="subtitle1">Station {station.name}</Typography>&nbsp;-&nbsp;
                {stationDetails.location}
            </ListItem>
            <ListItem>
                Surface Temperature (C):&nbsp;
                {stationDetails.surface_temp_c ? `${decimalFormat(stationDetails.surface_temp_c)}\u00b0` : '-'}
            </ListItem>
            <ListItem>
                Bottom Water Temperature (C):&nbsp;
                {stationDetails.bottom_water_temp_c
                    ? `${decimalFormat(stationDetails.bottom_water_temp_c)}\u00b0`
                    : '-'}
            </ListItem>
        </List>
    ) : (
        <Loading />
    );
};

export default Details;
