import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { useStationDetails } from '../../utils/hooks';
import Loading from '../Loading';
import DownloadButton from './DownloadButton';

interface Props {
    station: StationSummary;
}

const Details = ({ station }: Props) => {
    const stationDetails = useStationDetails(station.name);

    return stationDetails ? (
        <Box>
            <List>
                <ListItem>
                    <Typography variant="h6">Date:&nbsp;</Typography>
                    {stationDetails.date}
                </ListItem>
                <ListItem>
                    <Typography variant="h6">Location:&nbsp;</Typography>
                    {stationDetails.location}
                </ListItem>
                <List disablePadding dense>
                    <ListItem sx={{ pl: 4 }}>
                        <b>Place:&nbsp;</b>
                        {stationDetails.place || '-'}
                    </ListItem>
                    <ListItem sx={{ pl: 4 }}>
                        <b>Water body:&nbsp;</b>
                        {stationDetails.water_body}
                    </ListItem>
                    <ListItem sx={{ pl: 4 }}>
                        <b>Sea area:&nbsp;</b>
                        {stationDetails.sea_area || '-'}
                    </ListItem>
                    <ListItem sx={{ pl: 4 }}>
                        <b>FAO Area:&nbsp;</b>
                        {stationDetails.fao_area}
                    </ListItem>
                </List>
                <ListItem>
                    <Typography variant="h6">Gear:&nbsp;</Typography>
                    {stationDetails.gear || '-'}
                </ListItem>
                <ListItem>
                    <Typography variant="h6">Sediment sample:&nbsp;</Typography>
                    {stationDetails.sediment_sample || '-'}
                </ListItem>
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

export default Details;
