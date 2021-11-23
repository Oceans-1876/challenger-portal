import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import { useStationDetails } from '../../utils/hooks';
import Loading from '../Loading';
import SpeciesDetails from '../Species/Details';
import DownloadButton from './DownloadButton';

interface Props {
    station: StationSummary;
}

const Species = ({ station }: Props) => {
    const stationDetails = useStationDetails(station.name);
    const [selectedSpecies, setSelectedSpecies] = React.useState<string | null>(null);

    return stationDetails ? (
        <>
            {selectedSpecies ? (
                <>
                    <Button
                        variant="outlined"
                        startIcon={<Icon baseClassName="icons">chevron_left</Icon>}
                        onClick={() => {
                            setSelectedSpecies(null);
                        }}
                    >
                        Back to species
                    </Button>
                    <SpeciesDetails speciesId={selectedSpecies} />
                    <DownloadButton stationDetails={stationDetails} />
                </>
            ) : (
                <Box>
                    <List>
                        {stationDetails.species.map(({ id, matched_canonical_full_name }) => (
                            <ListItemButton key={id} onClick={() => setSelectedSpecies(id)}>
                                <ListItem>{matched_canonical_full_name}</ListItem>
                            </ListItemButton>
                        ))}
                    </List>
                    <DownloadButton stationDetails={stationDetails} />
                </Box>
            )}
        </>
    ) : (
        <Loading />
    );
};

export default Species;
