interface loadFAOAreas {
    type: 'loadFAOAreas';
    faoAreas: FAOArea[];
}

interface LoadStations {
    type: 'loadStations';
    stations: StationSummary[];
}

interface UpdateFilteredStations {
    type: 'updateFilteredStations';
    stations: StationSummary[] | null;
}

interface UpdateSelectedFaoArea {
    type: 'updateSelectedFaoArea';
    faoArea: FAOArea;
}

interface UpdateFocusedStation {
    type: 'updateFocusedStation';
    station: StationSummary | null;
}
interface UpdateSelectedStation {
    type: 'updateSelectedStation';
    station: StationSummary | null;
}

interface UpdateStationDetails {
    type: 'updateStationDetails';
    station: StationDetails;
}

interface UpdateAllSpecies {
    type: 'updateAllSpecies';
    species: SpeciesSummary[];
}

interface UpdateSpeciesDetails {
    type: 'updateSpeciesDetails';
    species: SpeciesDetails;
}

interface UpdateTempToUnit {
    type: 'updateTempToUnit';
    unit: string;
}

interface UpdateDepthToUnit {
    type: 'updateDepthToUnit';
    unit: string;
}

interface UpdateBasemap {
    type: 'updateBaseMap';
    id: string;
}

type DataAction =
    | UpdateTempToUnit
    | UpdateDepthToUnit
    | LoadStations
    | UpdateFilteredStations
    | UpdateSelectedFaoArea
    | UpdateFocusedStation
    | UpdateSelectedStation
    | UpdateStationDetails
    | UpdateAllSpecies
    | UpdateSpeciesDetails
    | loadFAOAreas;

type MapAction = UpdateBasemap;
