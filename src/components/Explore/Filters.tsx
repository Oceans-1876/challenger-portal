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
import { matchSorter } from 'match-sorter';
import dayjs, { Dayjs } from 'dayjs';

import { DataStateContext, DataActionDispatcherContext } from '../../store/contexts';
import { useFAOAreas } from '../../utils/hooks';

const Filters = () => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { stationsList, filteredStations, allSpeciesList, filteredFAOAreas, filteredSpecies, filterDates } =
        React.useContext(DataStateContext);
    const [speciesOptions, setSpeciesOptions] = React.useState<SpeciesSummary[]>([]);
    const minDate = dayjs('1872-01-01');
    const maxDate = dayjs('1876-12-31');
    const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
    const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
    const faoAreas = useFAOAreas();

    React.useEffect(() => {
        setSpeciesOptions(allSpeciesList.filter((sp) => sp.matched_canonical_full_name !== null));
    }, [allSpeciesList]);

    React.useEffect(() => {
        const dates: (string | null)[] = [];
        if (startDate !== null) {
            if ((startDate as Dayjs).isValid()) {
                dates.push((startDate as Dayjs).format('YYYY-MM-DD'));
            } else {
                dates.push(null);
            }
        } else {
            dates.push(null);
        }
        console.log('Change');
        if (endDate !== null) {
            if ((endDate as Dayjs).isValid()) {
                dates.push((endDate as Dayjs).format('YYYY-MM-DD'));
            } else {
                dates.push(null);
            }
        } else {
            dates.push(null);
        }
        dataActionDispatcher({
            type: 'updateFilterDates',
            dates: dates
        });
    }, [endDate, startDate]);

    return (
        <Stack direction="column" spacing={4}>
            <Typography variant="body1">
                Start by selecting a station from the map to see its details or filter out stations.
            </Typography>

            <Stack direction="column" alignItems="center" spacing={1}>
                <Box my={1} justifyContent="center">
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        renderInput={(params) => <TextField {...params} />}
                        minDate={minDate}
                        maxDate={maxDate}
                        openTo="year"
                        clearable={true}
                        onChange={(newVal) => {
                            setStartDate(newVal);
                        }}
                    />
                </Box>
                <Box my={1} justifyContent="center">
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        renderInput={(params) => <TextField {...params} />}
                        minDate={minDate}
                        maxDate={maxDate}
                        openTo="year"
                        clearable={true}
                        onChange={(newVal) => {
                            setEndDate(newVal);
                        }}
                    />
                </Box>
            </Stack>
            {startDate !== null && endDate !== null ? (
                startDate > endDate ? (
                    <Alert severity="warning">
                        The Start Date is greater than the End Date. It should be less than or equal to End Date.
                    </Alert>
                ) : null
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
                        dataActionDispatcher({
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
                                            dataActionDispatcher({
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
                        dataActionDispatcher({
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
                                                dataActionDispatcher({
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
                    disableCloseOnSelect
                    size="small"
                    multiple
                    limitTags={0}
                    renderInput={(params) => <TextField {...params} label="Species" placeholder="Select Species" />}
                    options={allSpeciesList.filter((sp) => sp.matched_canonical_full_name !== null)}
                    getOptionLabel={(option: SpeciesSummary) => option.matched_canonical_full_name}
                    filterOptions={(optionsInp, { inputValue }) =>
                        matchSorter(optionsInp, inputValue, { keys: ['matched_canonical_full_name'] })
                    }
                    renderTags={() => null}
                    value={filteredSpecies.reduce((values: SpeciesSummary[], speciesId: string) => {
                        const species = allSpeciesList.find(({ id }) => id === speciesId);
                        if (species) {
                            values.push(species);
                        }
                        return values;
                    }, [])}
                    onChange={(_e, selectedOption) => {
                        dataActionDispatcher({
                            type: 'updateFilteredSpecies',
                            species: selectedOption.map((species) => species.id)
                        });
                    }}
                />
                {filteredSpecies.length ? (
                    <Accordion square disableGutters>
                        <AccordionSummary expandIcon={<Icon baseClassName="icons">expand_more</Icon>}>
                            <Typography variant="subtitle2">Matched {filteredSpecies.length} species</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                {speciesOptions
                                    .filter(({ id }) => filteredSpecies.includes(id))
                                    .map(({ id, matched_canonical_full_name }) => (
                                        <Chip
                                            key={id}
                                            sx={{ mt: 1 }}
                                            variant="outlined"
                                            label={matched_canonical_full_name}
                                            onDelete={() => {
                                                dataActionDispatcher({
                                                    type: 'updateFilteredSpecies',
                                                    species: filteredSpecies.filter((speciesId) => speciesId !== id)
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
