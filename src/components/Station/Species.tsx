import React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';

import { useSpeciesDetails } from '../../utils/hooks';
import SpeciesDetails from '../Species/Details';
import DownloadButton from '../DownloadButton';

interface Props {
    station: StationDetails;
}

const Species = ({ station }: Props) => {
    const [selectedSpecies, setSelectedSpecies] = React.useState<string>();
    const speciesDetails = useSpeciesDetails(selectedSpecies);

    return selectedSpecies && speciesDetails ? (
        <>
            <Stack direction="row" spacing={1}>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Icon baseClassName="icons">chevron_left</Icon>}
                    onClick={() => {
                        setSelectedSpecies(undefined);
                    }}
                >
                    Back to species
                </Button>
                <DownloadButton
                    data={speciesDetails}
                    filename={speciesDetails.matched_canonical_full_name}
                    message="Download Species"
                />
            </Stack>
            <SpeciesDetails species={speciesDetails} />
        </>
    ) : (
        <>
            {station.species.length ? (
                <List>
                    {station.species.map(({ id, matched_canonical_full_name }) => (
                        <ListItemButton key={id} onClick={() => setSelectedSpecies(id)}>
                            <ListItem>{matched_canonical_full_name}</ListItem>
                        </ListItemButton>
                    ))}
                    <Stack direction="column" spacing={2} sx={{ padding: 1 }}>
                        <Stack direction="row" spacing={1} justifyContent="space-between">
                            <DownloadButton
                                data={station.species}
                                filename={`Station-${station.name}-Species`}
                                message="Download All Species"
                            />
                        </Stack>
                    </Stack>
                </List>
            ) : (
                <Alert severity="info">{`Currently there are no records of any Species for Station ${station.name} in the database.`}</Alert>
            )}
        </>
    );
};

export default Species;
