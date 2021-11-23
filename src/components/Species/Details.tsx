import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { useSpeciesDetails } from '../../utils/hooks';
import Loading from '../Loading';
import DownloadButton from '../Station/DownloadButton';

interface Props {
    speciesId: string;
    stationName: string;
}
const Details = ({ speciesId, stationName }: Props) => {
    const speciesDetails = useSpeciesDetails(speciesId);

    return speciesDetails ? (
        <Box>
            <List>
                <ListItem>
                    <Typography variant="h5">{speciesDetails.matched_canonical_full_name}</Typography>
                </ListItem>
                <ListItem>Classification path: {speciesDetails.classification_path}</ListItem>
                <ListItem>Classification ranks: {speciesDetails.classification_ranks}</ListItem>
            </List>
            <DownloadButton
                data={speciesDetails}
                filename={`Station-${stationName}'s-${speciesDetails.matched_canonical_full_name}-details`}
                message={`Download Species's Details`}
            />
        </Box>
    ) : (
        <Loading />
    );
};

export default Details;
