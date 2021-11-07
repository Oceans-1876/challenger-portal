// This is a fallback value for when a component that is not in a DataStateContext provider tries to access its value.
export const dataStateInitialValue: DataState = {
    stationsList: [],
    stationsObject: {},
    journeyPath: [],
    selectedStation: null,
    allSpeciesList: [],
    allSpeciesObject: {},
    selectedSpecies: []
};
