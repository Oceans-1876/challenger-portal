import { createJourneyPathFromStationPoints } from '../components/Map/utils';
import { setUnitPreferences } from '../utils/localStorage';

export const dataReducers = (state: DataState, action: DataAction): DataState => {
    switch (action.type) {
        case 'loadFAOAreas':
            return {
                ...state,
                faoAreas: action.faoAreas
            };
        case 'cacheFAOAreaIcons': {
            return {
                ...state,
                faoAreaIcons: {
                    ...state.faoAreaIcons,
                    [action.faoArea]: action.base64Encoded
                }
            };
        }
        case 'loadStations': {
            const journeyPath = createJourneyPathFromStationPoints(
                action.stations.map((station) => station.coordinates)
            ); // Expects stations to be sorted by date
            return {
                ...state,
                journeyPath,
                allStationsList: action.stations,
                filteredStations: groupStationsByFaoArea(action.stations, state.faoAreas)
            };
        }
        case 'updateFilteredStations': {
            const stationGroups = groupStationsByFaoArea(action.stations, state.faoAreas);
            return {
                ...state,
                filteredStations: stationGroups,
                selectedFaoArea: null,
                focusedStation: null,
                selectedStation: null
            };
        }
        case 'updateSelectedFaoArea': {
            return {
                ...state,
                selectedFaoArea: action.faoArea,
                focusedStation: null,
                selectedStation: null
            };
        }
        case 'updateFocusedStation': {
            return {
                ...state,
                focusedStation: action.station
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

export const mapReducers = (state: MapState, action: MapAction): MapState => {
    switch (action.type) {
        case 'updateBaseMap':
            return {
                ...state,
                activeBasemap: action.id
            };
    }
    throw Error(`Received invalid action: ${action}`);
};

function groupStationsByFaoArea(stations: StationSummary[] | null, allFaoAreas: FAOArea[]): StationGroup[] {
    const groups: {
        [faoAreaCode: string]: {
            faoArea: FAOArea;
            stations: StationSummary[];
        };
    } = {};
    stations?.forEach((station) => {
        if (!groups[station.fao_area]) {
            groups[station.fao_area] = {
                faoArea: allFaoAreas.find((area) => area.code === station.fao_area)!,
                stations: []
            };
        }
        groups[station.fao_area].stations.push(station);
    });
    return Object.values(groups);
}
