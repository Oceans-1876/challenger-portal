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

import { useSpeciesDetails, usePagination } from '@app/utils/hooks';
import Loading from '@app/components/Loading';
import { getData } from '@app/store/api';
import SpeciesDetails from './Details';

interface Props {
    species_list: SpeciesSummary[];
}

const SpeciesList = ({ species_list }: Props) => {
    const [selectedSpecies, setSelectedSpecies] = React.useState<string>();
    const speciesDetails = useSpeciesDetails(selectedSpecies);
    const [searchFieldValue, setSearchFieldValue] = React.useState<string>('');
    const [searching, setSearching] = React.useState<boolean>(false);
    const [page, setPage] = React.useState<number>(1);
    const [showAllSpecies, setShowAllSpecies] = React.useState<boolean>(true);
    const [speciesSearchResults, setSpeciesSearchResults] = React.useState<SpeciesSummary[] | null>(null);

    const perPage = 30;
    const count: number = Math.ceil(species_list.length / perPage);
    const speciesListPagination = usePagination(species_list, perPage);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, p: number) => {
        setPage(p);
        speciesListPagination.jump(p);
    };

    const handleStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFieldValue(event.target.value);
    };

    const perfromQuery = () => {
        if (searchFieldValue !== '') {
            setShowAllSpecies(false);
            setSearching(true);
            getData<SpeciesSummary[]>(
                `species/fuzzymatch/?query_str=${searchFieldValue}`,
                (data) => {
                    if (data.length === 0) {
                        setSpeciesSearchResults(null);
                    } else {
                        setSpeciesSearchResults(data);
                    }
                    setSearching(false);
                },
                () => {
                    setSearching(false);
                }
            );
        }
    };

    const handleHitEnterEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            perfromQuery();
        }
    };

    return (
        <Box>
            <Box
                component="form"
                sx={{ mb: 1, display: 'flex', width: '100%', justifyContent: 'center', alignContent: 'space-around' }}
            >
                <Stack direction="row" spacing={1}>
                    <TextField
                        id="outlined-search"
                        label="Search Species"
                        type="search"
                        value={searchFieldValue}
                        onChange={handleStringChange}
                        onKeyDown={handleHitEnterEvent}
                    />
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Icon baseClassName="icons">search</Icon>}
                        onClick={perfromQuery}
                    >
                        Search
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                            <Icon baseClassName="icons">{showAllSpecies ? 'chevron_right' : 'chevron_left'}</Icon>
                        }
                        onClick={() => {
                            setShowAllSpecies(!showAllSpecies);
                            if (!showAllSpecies) {
                                setSelectedSpecies(undefined);
                            }
                        }}
                    >
                        {showAllSpecies ? 'Search Results' : 'Back to All species'}
                    </Button>
                </Stack>
            </Box>
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', alignContent: 'space-around' }}>
                {selectedSpecies && speciesDetails ? (
                    <Stack direction="column" spacing={1} sx={{ mt: 1 }}>
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
                        <SpeciesDetails species={speciesDetails} />
                    </Stack>
                ) : (
                    <>
                        {showAllSpecies ? (
                            <>
                                {species_list.length ? (
                                    <Stack spacing={2} sx={{ mt: 1 }}>
                                        <Pagination count={count} page={page} onChange={handlePageChange} />
                                        <List>
                                            {speciesListPagination.currentData().map((sp) => (
                                                <ListItemButton key={sp.id} onClick={() => setSelectedSpecies(sp.id)}>
                                                    <ListItem>{sp.matched_canonical_full_name}</ListItem>
                                                </ListItemButton>
                                            ))}
                                        </List>
                                        <Pagination count={count} page={page} onChange={handlePageChange} />
                                    </Stack>
                                ) : (
                                    <Alert severity="info">Currently there are no records of any Species found</Alert>
                                )}{' '}
                            </>
                        ) : (
                            <>
                                {speciesSearchResults !== null ? (
                                    <Stack spacing={2}>
                                        <List>
                                            {speciesSearchResults.map((sp) => {
                                                return (
                                                    <ListItemButton
                                                        key={sp.id}
                                                        onClick={() => setSelectedSpecies(sp.id)}
                                                    >
                                                        <ListItem>{sp.matched_canonical_full_name}</ListItem>
                                                    </ListItemButton>
                                                );
                                            })}
                                        </List>
                                    </Stack>
                                ) : (
                                    <>
                                        {searching ? (
                                            <Loading />
                                        ) : (
                                            <Alert severity="info">
                                                Could not find anything. Try something more specific or check spelling
                                            </Alert>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default SpeciesList;
