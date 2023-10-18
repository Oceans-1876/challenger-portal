import React, { FC, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Chip,
    Collapse,
    FormControlLabel,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { theme } from '@app/theme';
import { DataActionDispatcherContext, DataStateContext } from '@app/store/contexts';
import { useDebounce } from '@app/utils/hooks';
import { getData, searchStations } from '@app/store/api';
import { chipStyleOverride, selectStyleOverride } from '../theme';
import SpeciesListbox from './SpeciesListbox';
import Loading from './Loading';

const MAX_DATE = dayjs('1876-12-31');
const MIN_DATE = dayjs('1872-01-01');

type Props = {
    toggle: ReactNode;
    onClose: () => void;
};

const AdvancedSearch: FC<Props> = ({ toggle, onClose }) => {
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
    const { faoAreas, allStationsList, allSpeciesList } = useContext(DataStateContext);

    const [joinOperator, setJoinOperator] = useState<BooleanOperator>('AND');

    const speciesDefaultRanks = useMemo(() => new Map(allSpeciesList.map((s, rank) => [s.id, rank])), [allSpeciesList]);
    const [speciesFilter, setSpeciesFilter] = useState<SpeciesSummary[]>([]);
    const [speciesFilterInput, setSpeciesFilterInput] = useState('');
    const [speciesFilterOptionRanks, setSpeciesFilterOptionRanks] = useState<Map<string, number>>(speciesDefaultRanks);

    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);

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
            stations: allStationsList
        });
    }, []);

    const timerRef = useRef(-1);
    const applyFilter = useCallback(() => {
        const searchExpr: StationSearchExpressions = {
            join: joinOperator,
            species: speciesFilter.map((s) => s.id),
            stationNames: stationFilter.map((s) => s.name),
            faoAreas: faoAreaFilter.map((a) => a.code),
            dates: [startDate, endDate]
        };
        timerRef.current = window.setTimeout(() => setLoading(true), 200);
        searchStations(searchExpr, (stations) => {
            clearTimeout(timerRef.current);
            setLoading(false);
            if (stations.length === 0) {
                setShowAlert(true);
            } else {
                dataActionDispatcher({
                    type: 'updateFilteredStations',
                    stations
                });
                onClose();
            }
        });
    }, [joinOperator, speciesFilter, stationFilter, faoAreaFilter, startDate, endDate, onClose]);

    return (
        <>
            <Loading open={loading} />

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
                ListboxComponent={SpeciesListbox}
                getOptionLabel={(option) => option.record_id}
                renderOption={(props, option, state) => [props, option, state] as ReactNode}
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
                options={allStationsList}
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
            
            <Collapse in={showAlert}>
                <Alert
                    severity="info"
                    onClose={() => setShowAlert(false)}
                  sx={{ mt: 4 }}
                >
                  No stations found matching the search criteria.
                </Alert>
            </Collapse>

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
