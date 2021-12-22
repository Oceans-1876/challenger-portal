// This is a fallback value for when a component that is not in a DataStateContext provider tries to access its value.
export const dataStateInitialValue: DataState = {
    stationsList: [],
    stationsObject: {},
    stationsBounds: [-180, -90, 180, 90],
    journeyPath: [],
    selectedStation: null,
    allSpeciesList: [],
    allSpeciesObject: {},
    faoAreas: [],
    tempToUnit: 'C',
    depthToUnit: 'ft'
};

export const filtersStateInitialValue: FilterState = {
    filterCount: null,
    filteredStations: [],
    filteredSpecies: [],
    filteredFAOAreas: [],
    filterDates: [null, null]
};
