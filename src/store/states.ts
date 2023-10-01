import { getUnitPreferences } from '../utils/localStorage';

const unitPref = getUnitPreferences();

// This is a fallback value for when a component that is not in a DataStateContext provider tries to access its value.
export const dataStateInitialValue: DataState = {
    allStationsList: [],
    stationsObject: {},
    stationsBounds: [-180, -90, 180, 90],
    journeyPath: [],
    filteredStations: [],
    selectedFaoArea: null,
    focusedStation: null,
    selectedStation: null,
    allSpeciesList: [],
    allSpeciesObject: {},
    faoAreas: [],
    tempToUnit: unitPref.Temp,
    depthToUnit: unitPref.Depth
};
