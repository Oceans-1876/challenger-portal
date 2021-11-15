import { fixLineMeridianCrossing, getFeatureBounds } from '../components/Map/utils';

export const dataReducers = (state: DataState, action: DataAction): DataState => {
    switch (action.type) {
        case 'updateStations': {
            const journeyPath = fixLineMeridianCrossing(action.stations.map((station) => station.coordinates)); // Expects stations to be sorted by date
            return {
                ...state,
                journeyPath,
                stationsBounds: getFeatureBounds(journeyPath),
                stationsList: action.stations
            };
        }
        case 'updateSelectedStation':
            return {
                ...state,
                selectedStation: action.station
            };
        case 'updateStationDetails':
            state.stationsObject[action.station.name] = action.station;
            return state;
        case 'updateAllSpecies':
            return {
                ...state,
                allSpeciesList: action.species
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
