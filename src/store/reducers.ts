export const dataReducers = (state: DataState, action: DataAction): DataState => {
    switch (action.type) {
        case 'updateStations':
            return {
                ...state,
                stations: action.stations
            };
        case 'updateSelectedStation':
            return {
                ...state,
                selectedStation: action.station
            };
        case 'updateAllSpecies':
            return {
                ...state,
                allSpecies: action.species
            };
        case 'updateSelectedSpecies':
            return {
                ...state,
                selectedSpecies: action.species
            };
        case 'addToSelectedSpecies':
            return {
                ...state,
                selectedSpecies: Array.from(new Set([...state.selectedSpecies, ...action.species]))
            };
        case 'removeFromSelectedSpecies':
            return {
                ...state,
                selectedSpecies: state.selectedSpecies.filter((speciesId) => !action.species.includes(speciesId))
            };
    }
    throw Error(`Received invalid action: ${action}`);
};
