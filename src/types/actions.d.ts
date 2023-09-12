interface UpdateStations {
    type: 'updateStations';
    stations: StationSummary[];
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

interface UpdateFAOAreas {
    type: 'updateFAOAreas';
    faoAreas: FAOArea[];
}

interface UpdateFilteredStations {
    type: 'updateFilteredStations';
    stations: StationSummary[] | null;
}

interface UpdateTempToUnit {
    type: 'updateTempToUnit';
    unit: string;
}

interface UpdateDepthToUnit {
    type: 'updateDepthToUnit';
    unit: string;
}

type DataAction =
    | UpdateTempToUnit
    | UpdateDepthToUnit
    | UpdateStations
    | UpdateFilteredStations
    | UpdateSelectedStation
    | UpdateStationDetails
    | UpdateAllSpecies
    | UpdateSpeciesDetails
    | UpdateFAOAreas;
