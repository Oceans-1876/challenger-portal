import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Autocomplete from '@mui/material/Autocomplete';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DatePicker from '@mui/lab/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

import { FilterStateContext, FilterActionDispatcherContext, DataStateContext } from '../../store/contexts';
import { useFAOAreas, useDebounce } from '../../utils/hooks';
import { getData } from '../../store/api';
import DatePickerClearableTextField, { DatePickerClearableInputProps } from '../ClearableDatePicker';

const MAX_DATE = dayjs('1876-12-31');
const MIN_DATE = dayjs('1872-01-01');

const Filters = () => {
    const filterActionDispatcher = React.useContext(FilterActionDispatcherContext);
    const { filterCount, filteredFAOAreas, filteredSpecies, filteredStations, filterDates } =
        React.useContext(FilterStateContext);
    const { stationsList } = React.useContext(DataStateContext);
    const [speciesOptions, setSpeciesOptions] = React.useState<SpeciesSummary[]>([]);
    const [filteredSpeciesDetails, setFilteredSpeciesDetails] = React.useState<SpeciesSummary[]>([]);
    const [speciesInputValue, setSpeciesInputValue] = React.useState<string>('');
    const faoAreas = useFAOAreas();

    const [startDate, endDate] = filterDates;

    useDebounce(
        () => {
            if (speciesInputValue) {
                getData<SpeciesSummary[]>(
                    `species/fuzzymatch/?query_str=${speciesInputValue}`,
                    (data) => {
                        setSpeciesOptions(data);
                    },
                    () => undefined
                );
            } else {
                setSpeciesOptions([]);
            }
        },
        [speciesInputValue],
        500
    );

    const handleDateRangeChange = (source: 'start' | 'end', value: Dayjs | null) => {
        if (!value || value.isValid()) {
            filterActionDispatcher({
                type: 'updateFilterDates',
                dates: source === 'start' ? [value, endDate] : [startDate, value]
            });
        }
    };

    return (
        <Stack direction="column" spacing={4}>
            <Typography variant="body1">
                Start by selecting a station from the map to see its details or filter out stations.
            </Typography>

            {filterCount !== null ? (
                <Alert severity="info">
                    {filterCount
                        ? `${filterCount} station(s) match the selected filters`
                        : 'No station matches the selected filters'}
                </Alert>
            ) : null}

            <Stack direction="row" spacing={1}>
                <DatePicker
                    label="Start Date"
                    value={startDate}
                    renderInput={({ InputProps, ...params }) => (
                        <DatePickerClearableTextField
                            textFieldProps={{
                                ...params,
                                size: 'small'
                            }}
                            inputProps={InputProps as DatePickerClearableInputProps}
                            value={startDate}
                            onClear={() => handleDateRangeChange('start', null)}
                        />
                    )}
                    minDate={MIN_DATE}
                    maxDate={endDate || MAX_DATE}
                    openTo="year"
                    clearable
                    onChange={(newVal) => {
                        handleDateRangeChange('start', newVal);
                    }}
                />

                <DatePicker
                    label="End Date"
                    value={endDate}
                    renderInput={({ InputProps, ...params }) => (
                        <DatePickerClearableTextField
                            textFieldProps={{
                                ...params,
                                size: 'small'
                            }}
                            inputProps={InputProps as DatePickerClearableInputProps}
                            value={endDate}
                            onClear={() => handleDateRangeChange('end', null)}
                        />
                    )}
                    minDate={startDate || MIN_DATE}
                    maxDate={MAX_DATE}
                    openTo="year"
                    clearable
                    onChange={(newVal) => {
                        handleDateRangeChange('end', newVal);
                    }}
                />
            </Stack>
            {startDate && endDate && startDate > endDate ? (
                <Alert severity="warning">
                    The Start Date is greater than the End Date. It should be less than or equal to End Date.
                </Alert>
            ) : null}

            <Stack direction="column" spacing={1}>
                <Autocomplete
                    fullWidth
                    disableCloseOnSelect
                    size="small"
                    multiple
                    limitTags={0}
                    renderInput={(params) => <TextField {...params} label="Stations" placeholder="Select Stations" />}
                    options={stationsList.map((station) => station.name)}
                    getOptionLabel={(option) => `Station ${option}`}
                    renderTags={() => null}
                    value={filteredStations}
                    onChange={(_e, selectedOption) => {
                        filterActionDispatcher({
                            type: 'updateFilteredStations',
                            stations: selectedOption
                        });
                    }}
                />
                {filteredStations.length ? (
                    <Accordion square disableGutters>
                        <AccordionSummary expandIcon={<Icon baseClassName="icons">expand_more</Icon>}>
                            <Typography variant="subtitle2">Matched {filteredStations.length} station(s)</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                {filteredStations.map((station) => (
                                    <Chip
                                        key={station}
                                        sx={{ mt: 1 }}
                                        variant="outlined"
                                        label={`Station ${station}`}
                                        onDelete={() => {
                                            filterActionDispatcher({
                                                type: 'updateFilteredStations',
                                                stations: filteredStations.filter(
                                                    (stationName) => stationName !== station
                                                )
                                            });
                                        }}
                                    />
                                ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ) : null}
            </Stack>

            <Stack direction="column" spacing={1}>
                <Autocomplete
                    fullWidth
                    disableCloseOnSelect
                    size="small"
                    multiple
                    limitTags={0}
                    renderInput={(params) => <TextField {...params} label="FAO Areas" placeholder="Select FAO Areas" />}
                    options={faoAreas}
                    getOptionLabel={(option: FAOArea) => `${option.name} (${option.code})`}
                    renderTags={() => null}
                    value={filteredFAOAreas.reduce((values: FAOArea[], faoAreaCode: string) => {
                        const faoArea = faoAreas.find(({ code }) => code === faoAreaCode);
                        if (faoArea) {
                            values.push(faoArea);
                        }
                        return values;
                    }, [])}
                    onChange={(_e, selectedOption) => {
                        filterActionDispatcher({
                            type: 'updateFilteredFAOAreas',
                            faoAreas: selectedOption.map((faoArea) => faoArea.code)
                        });
                    }}
                />
                {filteredFAOAreas.length ? (
                    <Accordion square disableGutters>
                        <AccordionSummary expandIcon={<Icon baseClassName="icons">expand_more</Icon>}>
                            <Typography variant="subtitle2">Matched {filteredFAOAreas.length} FAO Area(s)</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                {faoAreas
                                    .filter(({ code }) => filteredFAOAreas.includes(code))
                                    .map(({ code, name }) => (
                                        <Chip
                                            key={code}
                                            sx={{ mt: 1 }}
                                            variant="outlined"
                                            label={`${name} (${code})`}
                                            onDelete={() => {
                                                filterActionDispatcher({
                                                    type: 'updateFilteredFAOAreas',
                                                    faoAreas: filteredFAOAreas.filter(
                                                        (faoAreaCode) => faoAreaCode !== code
                                                    )
                                                });
                                            }}
                                        />
                                    ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ) : null}
            </Stack>

            <Stack direction="column" spacing={1}>
                <Autocomplete
                    fullWidth
                    size="small"
                    multiple
                    disableCloseOnSelect
                    inputValue={speciesInputValue}
                    renderInput={(params) => <TextField {...params} label="Species" placeholder="Select Species" />}
                    options={speciesOptions.filter((sp) => sp.matched_canonical_full_name !== null)}
                    getOptionLabel={(option: SpeciesSummary) => option.matched_canonical_full_name}
                    filterOptions={(x) => x}
                    renderTags={() => null}
                    value={filteredSpecies.reduce((values: SpeciesSummary[], speciesId: string) => {
                        const species = speciesOptions.find(({ id }) => id === speciesId);
                        if (species) {
                            values.push(species);
                        }
                        return values;
                    }, [])}
                    onInputChange={(event, newInputValue) => {
                        if (event !== null) {
                            setSpeciesInputValue(newInputValue);
                        }
                    }}
                    onChange={(_e, selectedOption) => {
                        setFilteredSpeciesDetails(Array.from(new Set([...selectedOption, ...filteredSpeciesDetails])));
                        filterActionDispatcher({
                            type: 'updateFilteredSpecies',
                            species: selectedOption.map((species) => species.id)
                        });
                    }}
                />
                {filteredSpeciesDetails.length ? (
                    <Accordion square disableGutters>
                        <AccordionSummary expandIcon={<Icon baseClassName="icons">expand_more</Icon>}>
                            <Typography variant="subtitle2">Matched {filteredSpeciesDetails.length} species</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                {filteredSpeciesDetails.map(({ id, matched_canonical_full_name }) => (
                                    <Chip
                                        key={id}
                                        sx={{ mt: 1 }}
                                        variant="outlined"
                                        label={matched_canonical_full_name}
                                        onDelete={() => {
                                            setFilteredSpeciesDetails(
                                                filteredSpeciesDetails.filter((species) => species.id !== id)
                                            );
                                            filterActionDispatcher({
                                                type: 'updateFilteredSpecies',
                                                species: filteredSpeciesDetails
                                                    .filter((species) => species.id !== id)
                                                    .map((species) => species.id)
                                            });
                                        }}
                                    />
                                ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ) : null}
            </Stack>
        </Stack>
    );
};

export default Filters;
