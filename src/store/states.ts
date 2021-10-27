// This is a fallback value for when a component that is not in a DataStateContext provider tries to access its value.
export const dataStateInitialValue: DataState = {
    stations: [],
    selectedStation: null,
    allSpecies: [],
    selectedSpecies: []
};
