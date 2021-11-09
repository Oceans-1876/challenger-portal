import React from 'react';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import { useStationDetails } from '../../utils/hooks';
import Loading from '../Loading';
import SpeciesDetails from '../Species/Details';

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
                        startIcon={<Icon>chevron_left</Icon>}
                        onClick={() => {
                            setSelectedSpecies(null);
                        }}
                    >
                        Back to species
                    </Button>
                    <SpeciesDetails speciesId={selectedSpecies} />
                </>
            ) : (
                <List>
                    {stationDetails.species.map(({ id, matched_canonical_full_name }) => (
                        <ListItemButton key={id} onClick={() => setSelectedSpecies(id)}>
                            <ListItem>{matched_canonical_full_name}</ListItem>
                        </ListItemButton>
                    ))}
                </List>
            )}
        </>
    ) : (
        <Loading />
    );
};

export default Species;
