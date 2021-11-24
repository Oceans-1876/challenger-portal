import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

interface Props {
    species: SpeciesDetails;
}
const Details = ({ species }: Props) => (
    <List>
        <ListItem>
            <Typography variant="h5">{species.matched_canonical_full_name}</Typography>
        </ListItem>
        <ListItem>Classification path: {species.classification_path}</ListItem>
        <ListItem>Classification ranks: {species.classification_ranks}</ListItem>
    </List>
);

export default Details;
