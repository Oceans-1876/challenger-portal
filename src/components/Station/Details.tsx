import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

interface Props {
    station: StationDetails;
}

const Details = ({ station }: Props) => (
    <List>
        <ListItem>
            <Typography variant="h6">Date:&nbsp;</Typography>
            {station.date}
        </ListItem>
        <ListItem>
            <Typography variant="h6">Location:&nbsp;</Typography>
            {station.location}
        </ListItem>
        <List disablePadding dense>
            <ListItem sx={{ pl: 4 }}>
                <b>Place:&nbsp;</b>
                {station.place || '-'}
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
                <b>Water body:&nbsp;</b>
                {station.water_body}
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
                <b>Sea area:&nbsp;</b>
                {station.sea_area || '-'}
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
                <b>FAO Area:&nbsp;</b>
                {station.fao_area}
            </ListItem>
        </List>
        <ListItem>
            <Typography variant="h6">Gear:&nbsp;</Typography>
            {station.gear || '-'}
        </ListItem>
        <ListItem>
            <Typography variant="h6">Sediment sample:&nbsp;</Typography>
            {station.sediment_sample || '-'}
        </ListItem>
    </List>
);

export default Details;
