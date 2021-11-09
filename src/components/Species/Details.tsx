import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { useSpeciesDetails } from '../../utils/hooks';
import Loading from '../Loading';

interface Props {
    speciesId: string;
}
const Details = ({ speciesId }: Props) => {
    const stationDetails = useSpeciesDetails(speciesId);

    return stationDetails ? (
        <List>
            <ListItem>
                <Typography variant="h5">{stationDetails.matched_canonical_full_name}</Typography>
            </ListItem>
            <ListItem>Classification path: {stationDetails.classification_path}</ListItem>
            <ListItem>Classification ranks: {stationDetails.classification_ranks}</ListItem>
        </List>
    ) : (
        <Loading />
    );
};

export default Details;
