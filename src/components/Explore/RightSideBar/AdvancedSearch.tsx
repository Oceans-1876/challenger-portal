import React, { FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Chip,
    FormControlLabel,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { theme } from '../../../theme';
import { DataActionDispatcherContext, DataStateContext } from '../../../store/contexts';
import { useDebounce, useFAOAreas } from '../../../utils/hooks';
import { getData, searchStations } from '../../../store/api';
import { chipStyleOverride, selectStyleOverride } from './theme';

const MAX_DATE = dayjs('1876-12-31');
const MIN_DATE = dayjs('1872-01-01');

type Props = {
    toggle: ReactNode;
};

const AdvancedSearch: FC<Props> = ({ toggle }) => {
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
    const { stationsList, allSpeciesList } = useContext(DataStateContext);

    const [joinOperator, setJoinOperator] = useState<BooleanOperator>('AND');

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

    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);

    const clearFilter = useCallback(() => {
        setSpeciesFilter([]);
        setStationFilter([]);
        setFaoAreaFilter([]);
        setStartDate(null);
        setEndDate(null);
        dataActionDispatcher({
            type: 'updateFilteredStations',
            stations: null
        });
        dataActionDispatcher({
            type: 'updateSelectedStation',
            station: null
        });
    }, []);

    const applyFilter = useCallback(() => {
        const searchExpr: StationSearchExpressions = {
            join: joinOperator,
            species: speciesFilter.map((s) => s.id),
            stationNames: stationFilter.map((s) => s.name),
            faoAreas: faoAreaFilter.map((a) => a.code),
            dates: [startDate, endDate]
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
    }, [joinOperator, speciesFilter, stationFilter, faoAreaFilter, startDate, endDate]);

    return (
        <>
            <Typography sx={{ fontSize: 12, color: theme.palette.explore.secondaryText }}>Search Rules</Typography>

            <RadioGroup row value={joinOperator} onChange={(_, op) => setJoinOperator(op as BooleanOperator)}>
                {['AND', 'OR'].map((op) => (
                    <FormControlLabel
                        key={op}
                        sx={{
                            '& .MuiTypography-root': {
                                color:
                                    op === joinOperator
                                        ? theme.palette.explore.mainText
                                        : theme.palette.explore.secondaryText,
                                fontWeight: '500',
                                fontSize: 14
                            }
                        }}
                        value={op}
                        control={
                            <Radio
                                sx={{
                                    '&, &.Mui-checked': {
                                        color: theme.palette.explore.secondary
                                    }
                                }}
                            />
                        }
                        label={op}
                    />
                ))}
            </RadioGroup>

            <Autocomplete
                sx={{ mt: '16px' }}
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
                                (speciesFilterOptionRanks.get(a.id) ?? 0) - (speciesFilterOptionRanks.get(b.id) ?? 0)
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

            <Autocomplete
                sx={{ mt: '16px' }}
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
                                setStationFilter(stationFilter.filter((station) => station.name !== option.name));
                            }}
                        />
                    ))
                }
                value={stationFilter}
                onChange={(_, selectedOptions) => {
                    setStationFilter([...selectedOptions]);
                }}
            />

            <Autocomplete
                sx={{ mt: '16px' }}
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
                                setFaoAreaFilter(faoAreaFilter.filter((station) => station.code !== option.code));
                            }}
                        />
                    ))
                }
                value={faoAreaFilter}
                onChange={(_, selectedOptions) => {
                    setFaoAreaFilter([...selectedOptions]);
                }}
            />

            <Stack direction="row" spacing="16px" sx={{ mt: '16px' }}>
                <DatePicker
                    sx={selectStyleOverride}
                    label="Start Date"
                    value={startDate}
                    views={['year', 'month', 'day']}
                    minDate={MIN_DATE}
                    maxDate={endDate || MAX_DATE}
                    openTo="year"
                    onChange={setStartDate}
                />

                <DatePicker
                    sx={selectStyleOverride}
                    label="End Date"
                    value={endDate}
                    views={['year', 'month', 'day']}
                    minDate={startDate || MIN_DATE}
                    maxDate={MAX_DATE}
                    openTo="year"
                    onChange={setEndDate}
                />
            </Stack>

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

export default AdvancedSearch;
