import React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { useSpeciesDetails } from '../../utils/hooks';
import SpeciesDetails from './Details';
import usePagination from './Pagination';
import { getData } from '../../store/api';

interface Props {
    species_list: SpeciesSummary[];
}

const SpeciesList = ({ species_list }: Props) => {
    const [selectedSpecies, setSelectedSpecies] = React.useState<string>();
    const speciesDetails = useSpeciesDetails(selectedSpecies);
    const [searchFeildValue, setSearchFieldValue] = React.useState<string>('');
    const [searchString, setSearchString] = React.useState<string>('');
    const [page, setPage] = React.useState<number>(1);
    const [showAllSpecies, setShowAllSpecies] = React.useState<boolean>(true);
    const [speciesSearchResults, setSpeciesSearchResults] = React.useState<SpeciesSummary[] | null>(null);

    const perPage = 30;
    const count: number = Math.ceil(species_list.length / perPage);
    const SpeciesListPagination = usePagination(species_list, perPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, p: number) => {
        setPage(p);
        SpeciesListPagination.jump(p);
    };

    const handleStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFieldValue(event.target.value);
    };

    React.useEffect(() => {
        if (searchString !== '') {
            getData<SpeciesSummary[]>(`species/fuzzymatch/?query_str=${searchString}`, (data) => {
                if (data.length === 0 && speciesSearchResults !== null) {
                    setSpeciesSearchResults(null);
                } else {
                    setSpeciesSearchResults(data);
                }
            });
        }
    }, [searchString]);

    return (
        <Box>
            <Box component="form">
                <TextField
                    id="outlined-search"
                    label="Search field"
                    type="search"
                    value={searchFeildValue}
                    onChange={handleStringChange}
                />
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Icon baseClassName="icons">search</Icon>}
                    onClick={() => {
                        if (searchFeildValue !== '') {
                            setSearchString(searchFeildValue);
                            setShowAllSpecies(false);
                        }
                    }}
                />
            </Box>
            {selectedSpecies && speciesDetails ? (
                <>
                    <Stack direction="column" spacing={1}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Icon baseClassName="icons">chevron_left</Icon>}
                            onClick={() => {
                                setSelectedSpecies(undefined);
                            }}
                        >
                            Back
                        </Button>
                        {/* </Stack>
            <Stack direction="row" spacing={1}> */}
                        <SpeciesDetails species={speciesDetails} />
                    </Stack>
                </>
            ) : (
                <>
                    {showAllSpecies ? (
                        <>
                            <Button
                                disabled={!speciesSearchResults}
                                variant="outlined"
                                size="small"
                                startIcon={<Icon baseClassName="icons">chevron_right</Icon>}
                                onClick={() => {
                                    setShowAllSpecies(false);
                                }}
                            >
                                Search Results
                            </Button>
                            {species_list.length ? (
                                <>
                                    <Stack spacing={2}>
                                        <Pagination count={count} page={page} onChange={handlePageChange} />
                                        <List>
                                            {SpeciesListPagination.currentData().map((sp) => (
                                                <ListItemButton key={sp.id} onClick={() => setSelectedSpecies(sp.id)}>
                                                    <ListItem>{sp.matched_canonical_full_name}</ListItem>
                                                </ListItemButton>
                                            ))}
                                        </List>
                                        <Pagination count={count} page={page} onChange={handlePageChange} />
                                    </Stack>
                                </>
                            ) : (
                                <Alert severity="info">Currently there are no records of any Species found</Alert>
                            )}{' '}
                        </>
                    ) : (
                        <>
                            {speciesSearchResults ? (
                                <Stack spacing={2}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Icon baseClassName="icons">chevron_left</Icon>}
                                        onClick={() => {
                                            setShowAllSpecies(true);
                                        }}
                                    >
                                        Back to All species
                                    </Button>
                                    <List>
                                        {speciesSearchResults.map((sp) => {
                                            return (
                                                <ListItemButton key={sp.id} onClick={() => setSelectedSpecies(sp.id)}>
                                                    <ListItem>{sp.matched_canonical_full_name}</ListItem>
                                                </ListItemButton>
                                            );
                                        })}
                                    </List>
                                </Stack>
                            ) : (
                                <Alert severity="info">
                                    Could not find anything. Try something more specific or check spelling
                                </Alert>
                            )}
                        </>
                    )}
                </>
            )}
        </Box>
    );
};

export default SpeciesList;
