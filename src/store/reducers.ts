import { createJourneyPathFromStationPoints, getFeatureBounds } from '../components/Map/utils';

export const dataReducers = (state: DataState, action: DataAction): DataState => {
    switch (action.type) {
        case 'updateStations': {
            const journeyPath = createJourneyPathFromStationPoints(
                action.stations.map((station) => station.coordinates)
            ); // Expects stations to be sorted by date
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
        case 'updateSpeciesDetails':
            state.allSpeciesObject[action.species.id] = action.species;
            return state;
        case 'updateFAOAreas':
            return {
                ...state,
                faoAreas: action.faoAreas
            };
        case 'updateTempToUnit':
            return {
                ...state,
                tempToUnit: action.unit
            };
        case 'updateDepthToUnit':
            return {
                ...state,
                depthToUnit: action.unit
            };
    }
    throw Error(`Received invalid action: ${action}`);
};

export const filterReducers = (state: FilterState, action: FilterAction): FilterState => {
    switch (action.type) {
        case 'updateFilterCount':
            return {
                ...state,
                filterCount: action.count
            };
        case 'updateFilteredSpecies':
            return {
                ...state,
                filteredSpecies: action.species
            };
        case 'addToFilteredSpecies':
            return {
                ...state,
                filteredSpecies: Array.from(new Set([...state.filteredSpecies, ...action.species]))
            };
        case 'removeFromFilteredSpecies':
            return {
                ...state,
                filteredSpecies: state.filteredSpecies.filter((speciesId) => !action.species.includes(speciesId))
            };
        case 'updateFilteredStations':
            return {
                ...state,
                filteredStations: action.stations
            };
        case 'updateFilteredFAOAreas':
            return {
                ...state,
                filteredFAOAreas: action.faoAreas
            };
        case 'updateFilterDates':
            return {
                ...state,
                filterDates: action.dates
            };
    }
    throw Error(`Received invalid action: ${action}`);
};
