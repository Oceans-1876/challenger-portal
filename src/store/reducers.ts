import { createJourneyPathFromStationPoints, getFeatureBounds } from '../components/Map/utils';
import { setUnitPreferences } from '../utils/localStorage';

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
        case 'updateFilteredStations': {
            return {
                ...state,
                filteredStations: action.stations,
                selectedStation: action.stations ? action.stations[0] : null
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
            setUnitPreferences({
                Temp: action.unit,
                Depth: state.depthToUnit
            });
            return {
                ...state,
                tempToUnit: action.unit
            };
        case 'updateDepthToUnit':
            setUnitPreferences({
                Temp: state.tempToUnit,
                Depth: action.unit
            });
            return {
                ...state,
                depthToUnit: action.unit
            };
    }
    throw Error(`Received invalid action: ${action}`);
};
