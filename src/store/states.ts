import { getUnitPreferences } from '@app/utils/localStorage';

const unitPref = getUnitPreferences();

// This is a fallback value for when a component that is not in a DataStateContext provider tries to access its value.
export const dataStateInitialValue: DataState = {
    faoAreas: [],
    faoAreaIcons: {},
    allStationsList: [],
    stationsObject: {},
    journeyPath: [],
    filteredStations: [],
    selectedFaoArea: null,
    focusedStation: null,
    selectedStation: null,
    allSpeciesList: [],
    allSpeciesObject: {},
    selectedSpecies: null,
    tempToUnit: unitPref.Temp,
    depthToUnit: unitPref.Depth
};
