import React, { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';

import { useDebounce, useSpeciesDetails } from '../../utils/hooks';
import SpeciesDetails from '../Species/Details';
import DownloadButton from '../DownloadButton';
import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { getData } from '../../store/api';

type SpeciesGroup = { key: string; species: SpeciesSummary[] };

function groupSpecies(species: SpeciesSummary[]): SpeciesGroup[] {
    const groups: Record<string, SpeciesSummary[]> = {};
    for (const s of species) {
        const key = s.matched_canonical_full_name[0].toUpperCase();
        (groups[key] ?? (groups[key] = [])).push(s);
    }
    return Object.entries(groups)
        .map(([key, species]) => ({ key, species }))
        .sort((a, b) => (a.key < b.key ? -1 : 1));
}

interface Props {
    station: StationDetails | null;
}

const Species = ({ station }: Props) => {
    const [selectedSpecies, setSelectedSpecies] = React.useState<string>();
    const speciesDetails = useSpeciesDetails(selectedSpecies);

    const [filteredSpecies, setFilteredSpecies] = useState(station?.species ?? []);
    const [input, setInput] = useState('');

    useDebounce(
        () => {
            if (input) {
                getData<SpeciesSummary[]>(
                    `species/fuzzymatch/?query_str=${input}`,
                    (data) => {
                        setFilteredSpecies(data);
                    },
                    () => undefined
                );
            } else {
                setFilteredSpecies(station?.species ?? []);
            }
        },
        [input, station?.species],
        200
    );

    const filteredSpeciesGroups = useMemo(() => groupSpecies(filteredSpecies), [filteredSpecies]);

    console.log(selectedSpecies, speciesDetails);

    return (
        <>
            {selectedSpecies && speciesDetails ? (
                <Box>
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
                </Box>
            ) : null}

            <Stack sx={{ height: '100%', display: selectedSpecies && speciesDetails ? 'none' : 'flex' }}>
                <TextField
                    fullWidth
                    label="Search field"
                    type="search"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Typography fontSize={12} sx={{ mt: '8px', color: '#FFFFFF99' }}>
                    {filteredSpecies.length} Species Matched
                </Typography>

                <List sx={{ mt: '32px', flex: 'auto', overflow: 'scroll', color: 'white' }}>
                    {filteredSpeciesGroups.map(({ key, species }) => (
                        <Box key={key}>
                            <ListItem
                                sx={{
                                    p: 0,
                                    lineHeight: 1.75,
                                    color: '#FFFFFF99',
                                    fontWeight: 600,
                                    boxShadow: '0px -1px 0px 0px rgba(144, 255, 243, 0.12) inset'
                                }}
                            >
                                {key}
                            </ListItem>
                            {species.map((s) => (
                                <ListItemButton
                                    key={s.record_id}
                                    sx={{ p: 0 }}
                                    onClick={() => setSelectedSpecies(s.id)}
                                >
                                    <ListItem sx={{ py: '8px', px: '25px' }}>
                                        <Box>
                                            <Typography>{s.matched_canonical_full_name ?? '(none)'}</Typography>
                                            <Typography
                                                variant="caption"
                                                noWrap
                                                sx={{
                                                    display: 'block',
                                                    fontStyle: 'italic',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {s.current_name ?? '(none)'}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                </ListItemButton>
                            ))}
                        </Box>
                    ))}
                </List>
            </Stack>
        </>
    );
};

export default Species;
