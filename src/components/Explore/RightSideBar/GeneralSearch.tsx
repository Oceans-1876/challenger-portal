import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Chip,
    FormControlLabel,
    Radio,
    RadioGroup,
    Stack,
    SxProps,
    TextField
} from '@mui/material';
import { theme } from '../../../theme';
import { DataStateContext, FilterActionDispatcherContext } from '../../../store/contexts';
import { useDebounce, useFAOAreas } from '../../../utils/hooks';
import { getData } from '../../../store/api';

type GeneralSearchType = 'species' | 'station' | 'oceanic-region';

const searchTypes: Array<{ type: GeneralSearchType; label: string }> = [
    {
        type: 'species',
        label: 'Species'
    },
    {
        type: 'station',
        label: 'Station Number'
    },
    {
        type: 'oceanic-region',
        label: 'Oceanic Region'
    }
];

const chipStyleOverride: SxProps = {
    color: theme.palette.explore.mainText,
    borderColor: theme.palette.explore.secondary
};

const autocompleteStyleOverride: SxProps = {
    '.MuiFormLabel-root': {
        'color': `${theme.palette.explore.secondaryText} !important`,
        '&.Mui-focused': {
            color: `${theme.palette.explore.secondary} !important`
        }
    },
    '.MuiSvgIcon-root': {
        color: `${theme.palette.explore.secondary} !important`
    },
    '.MuiOutlinedInput-notchedOutline': {
        borderColor: `${theme.palette.explore.secondary} !important`,
        color: theme.palette.explore.secondaryText
    },
    'input': {
        color: theme.palette.explore.mainText,
        border: theme.palette.explore.secondary
    }
};

const GeneralSearch: FC = () => {
    const filterActionDispatcher = useContext(FilterActionDispatcherContext);

    const { stationsList, allSpeciesList } = useContext(DataStateContext);
    const speciesDefaultRanks = useMemo(() => new Map(allSpeciesList.map((s, rank) => [s.id, rank])), [allSpeciesList]);

    const [speciesFilter, setSpeciesFilter] = useState<SpeciesSummary[]>([]);
    const [speciesFilterInput, setSpeciesFilterInput] = useState('');
    const [speciesFilterOptionRanks, setSpeciesFilterOptionRanks] = useState<Map<string, number>>(speciesDefaultRanks);

    useEffect(() => {
        setSpeciesFilterOptionRanks(speciesDefaultRanks);
    }, [speciesDefaultRanks]);

    useDebounce(
        () => {
            if (speciesFilterInput) {
                getData<SpeciesSummary[]>(
                    `species/fuzzymatch/?query_str=${speciesFilterInput}`,
                    (data) => {
                        setSpeciesFilterOptionRanks(new Map(data.map((species, rank) => [species.id, rank])));
                    },
                    () => undefined
                );
            } else {
                setSpeciesFilterOptionRanks(speciesDefaultRanks);
            }
        },
        [speciesFilterInput, speciesDefaultRanks],
        200
    );

    const [stationFilter, setStationFilter] = useState<StationSummary[]>([]);

    const faoAreas = useFAOAreas();
    const [faoAreaFilter, setFaoAreaFilter] = useState<FAOArea[]>([]);

    const [searchType, setSearchType] = useState<GeneralSearchType>('species');

    useEffect(() => {
        setSpeciesFilter([]);
        setStationFilter([]);
        setFaoAreaFilter([]);
        filterActionDispatcher({
            type: 'updateFilteredSpecies',
            species: []
        });
        filterActionDispatcher({
            type: 'updateFilteredStations',
            stations: []
        });
        filterActionDispatcher({
            type: 'updateFilteredFAOAreas',
            faoAreas: []
        });
    }, [searchType]);

    const clearFilter = useCallback(() => {
        switch (searchType) {
            case 'species':
                setSpeciesFilter([]);
                filterActionDispatcher({
                    type: 'updateFilteredSpecies',
                    species: []
                });
                break;
            case 'station':
                setStationFilter([]);
                filterActionDispatcher({
                    type: 'updateFilteredStations',
                    stations: []
                });
                break;
            case 'oceanic-region':
                setFaoAreaFilter([]);
                filterActionDispatcher({
                    type: 'updateFilteredFAOAreas',
                    faoAreas: []
                });
                break;
        }
    }, [searchType]);

    const applyFilter = useCallback(() => {
        switch (searchType) {
            case 'species':
                filterActionDispatcher({
                    type: 'updateFilteredSpecies',
                    species: speciesFilter.map((species) => species.id)
                });
                break;
            case 'station':
                filterActionDispatcher({
                    type: 'updateFilteredStations',
                    stations: stationFilter.map((station) => station.name)
                });
                break;
            case 'oceanic-region':
                filterActionDispatcher({
                    type: 'updateFilteredFAOAreas',
                    faoAreas: faoAreaFilter.map((faoArea) => faoArea.code)
                });
                break;
        }
    }, [searchType, speciesFilter, stationFilter, faoAreaFilter]);

    return (
        <>
            <RadioGroup value={searchType} onChange={(_, value) => setSearchType(value as GeneralSearchType)}>
                {searchTypes.map(({ type, label }) => (
                    <FormControlLabel
                        key={type}
                        sx={{
                            '& .MuiTypography-root': {
                                color:
                                    type == searchType
                                        ? theme.palette.explore.mainText
                                        : theme.palette.explore.secondaryText,
                                fontWeight: '500',
                                fontSize: 14
                            }
                        }}
                        value={type}
                        control={
                            <Radio
                                sx={{
                                    '&, &.Mui-checked': {
                                        color: theme.palette.explore.secondary
                                    }
                                }}
                            />
                        }
                        label={label}
                    />
                ))}
            </RadioGroup>

            <Box sx={{ mt: '16px' }}>
                {searchType == 'species' ? (
                    <Autocomplete
                        fullWidth
                        multiple
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                value={speciesFilterInput}
                                onChange={(e) => setSpeciesFilterInput(e.target.value)}
                                label="Species"
                                placeholder="Species"
                                sx={autocompleteStyleOverride}
                            />
                        )}
                        getOptionLabel={(option) => option.matched_canonical_full_name || option.record_id}
                        options={allSpeciesList}
                        filterOptions={(options) =>
                            options
                                .filter((option) => speciesFilterOptionRanks.has(option.id))
                                .sort((a, b) => {
                                    return speciesFilterOptionRanks.get(a.id)! - speciesFilterOptionRanks.get(b.id)!;
                                })
                        }
                        renderTags={(tagValue) =>
                            tagValue.map((option) => (
                                <Chip
                                    variant="outlined"
                                    sx={chipStyleOverride}
                                    key={option.id}
                                    label={option.matched_canonical_full_name}
                                    onDelete={() => {
                                        setSpeciesFilter(speciesFilter.filter((species) => species.id != option.id));
                                    }}
                                />
                            ))
                        }
                        value={speciesFilter}
                        onChange={(_, selectedOptions) => {
                            setSpeciesFilter([...selectedOptions]);
                        }}
                    />
                ) : searchType == 'station' ? (
                    <Autocomplete
                        fullWidth
                        multiple
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Stations"
                                placeholder="Stations"
                                sx={autocompleteStyleOverride}
                            />
                        )}
                        getOptionLabel={(option) => option.name}
                        options={stationsList}
                        renderTags={(tagValue) =>
                            tagValue.map((option) => (
                                <Chip
                                    variant="outlined"
                                    sx={chipStyleOverride}
                                    key={option.name}
                                    label={option.name}
                                    onDelete={() => {
                                        setStationFilter(
                                            stationFilter.filter((station) => station.name != option.name)
                                        );
                                    }}
                                />
                            ))
                        }
                        value={stationFilter}
                        onChange={(_, selectedOptions) => {
                            setStationFilter([...selectedOptions]);
                        }}
                    />
                ) : (
                    <Autocomplete
                        fullWidth
                        multiple
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Oceanic Regions"
                                placeholder="Oceanic Regions"
                                sx={autocompleteStyleOverride}
                            />
                        )}
                        getOptionLabel={(option) => option.name}
                        options={faoAreas}
                        renderTags={(tagValue) =>
                            tagValue.map((option) => (
                                <Chip
                                    variant="outlined"
                                    sx={chipStyleOverride}
                                    key={option.code}
                                    label={option.name}
                                    onDelete={() => {
                                        setFaoAreaFilter(
                                            faoAreaFilter.filter((station) => station.code != option.code)
                                        );
                                    }}
                                />
                            ))
                        }
                        value={faoAreaFilter}
                        onChange={(_, selectedOptions) => {
                            setFaoAreaFilter([...selectedOptions]);
                        }}
                    />
                )}
            </Box>

            <Stack
                direction="row"
                sx={{
                    mt: '16px',
                    py: '16px'
                }}
            >
                <Button variant="explore-text">Advanced Search</Button>
                <Box flex="1" />
                <Button variant="explore-text" onClick={clearFilter}>
                    Clear
                </Button>
                <Button variant="explore-contained" onClick={applyFilter}>
                    Search
                </Button>
            </Stack>
        </>
    );
};

export default GeneralSearch;
