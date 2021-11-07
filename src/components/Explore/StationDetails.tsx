import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { getData } from '../../store/api';
import { DataActionDispatcherContext, DataStateContext } from '../../store/contexts';
import { decimalFormat } from '../../utils/format';

interface Props {
    station: StationSummary;
}

const StationDetails = ({ station }: Props) => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { stationsObject } = React.useContext(DataStateContext);
    const [stationDetails, setStationDetails] = React.useState<StationDetails>();

    React.useEffect(() => {
        if (stationsObject[station.name]) {
            setStationDetails(stationsObject[station.name]);
        } else {
            getData<StationDetails>(`stations/${station.name}`, (data) => {
                setStationDetails(data);
                dataActionDispatcher({ type: 'updateStationDetails', station: data });
            });
        }
    }, [station.name]);

    return (
        <List>
            {stationDetails ? (
                <>
                    <ListItem>
                        <Typography variant="subtitle1">Station {station.name}</Typography> - {stationDetails.location}
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
                </>
            ) : (
                <ListItem>Station {station.name}</ListItem>
            )}
        </List>
    );
};

export default StationDetails;
