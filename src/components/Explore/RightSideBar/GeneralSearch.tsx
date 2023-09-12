import React, { FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Autocomplete, Box, Button, Chip, FormControlLabel, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import { theme } from '../../../theme';
import { DataActionDispatcherContext, DataStateContext } from '../../../store/contexts';
import { useDebounce, useFAOAreas } from '../../../utils/hooks';
import { getData, searchStations } from '../../../store/api';
import { chipStyleOverride, selectStyleOverride } from './theme';

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

type Props = {
    toggle: ReactNode;
};

const GeneralSearch: FC<Props> = ({ toggle }) => {
    const { stationsList, allSpeciesList } = useContext(DataStateContext);
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
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

    const clearFilter = useCallback(() => {
        switch (searchType) {
            case 'species':
                setSpeciesFilter([]);
                break;
            case 'station':
                setStationFilter([]);
                break;
            case 'oceanic-region':
                setFaoAreaFilter([]);
                break;
        }
        dataActionDispatcher({
            type: 'updateFilteredStations',
            stations: null
        });
        dataActionDispatcher({
            type: 'updateSelectedStation',
            station: null
        });
    }, [searchType]);

    useEffect(() => {
        setSpeciesFilter([]);
        setStationFilter([]);
        setFaoAreaFilter([]);
        dataActionDispatcher({
            type: 'updateFilteredStations',
            stations: null
        });
        dataActionDispatcher({
            type: 'updateSelectedStation',
            station: null
        });
    }, [searchType]);

    const applyFilter = useCallback(() => {
        const searchExpr: StationSearchExpressions = {
            species: searchType === 'species' ? speciesFilter.map((s) => s.id) : [],
            stationNames: searchType === 'station' ? stationFilter.map((s) => s.name) : [],
            faoAreas: searchType === 'oceanic-region' ? faoAreaFilter.map((a) => a.code) : [],
            dates: []
        };
        searchStations(searchExpr, (stations) => {
            dataActionDispatcher({
                type: 'updateFilteredStations',
                stations
            });
            dataActionDispatcher({
                type: 'updateSelectedStation',
                station: stations.length == 1 ? stations[0] : null
            });
        });
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
                                    type === searchType
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
                {searchType === 'species' ? (
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
                                sx={selectStyleOverride}
                            />
                        )}
                        getOptionLabel={(option) => option.matched_canonical_full_name || option.record_id}
                        options={allSpeciesList}
                        filterOptions={(options) =>
                            options
                                .filter((option) => speciesFilterOptionRanks.has(option.id))
                                .sort((a, b) => {
                                    return (
                                        (speciesFilterOptionRanks.get(a.id) ?? 0) -
                                        (speciesFilterOptionRanks.get(b.id) ?? 0)
                                    );
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
                                        setSpeciesFilter(speciesFilter.filter((species) => species.id !== option.id));
                                    }}
                                />
                            ))
                        }
                        value={speciesFilter}
                        onChange={(_, selectedOptions) => {
                            setSpeciesFilter([...selectedOptions]);
                        }}
                    />
                ) : searchType === 'station' ? (
                    <Autocomplete
                        fullWidth
                        multiple
                        renderInput={(params) => (
                            <TextField {...params} label="Stations" placeholder="Stations" sx={selectStyleOverride} />
                        )}
                        getOptionLabel={(option) => `Station ${option.name}`}
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
                                            stationFilter.filter((station) => station.name !== option.name)
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
                                sx={selectStyleOverride}
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
                                            faoAreaFilter.filter((station) => station.code !== option.code)
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
                {toggle}
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
