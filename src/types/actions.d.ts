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

interface UpdateFilteredSpecies {
    type: 'updateFilteredSpecies';
    species: string[];
}

interface UpdateSpeciesOptions {
    type: 'updateSpeciesOptions';
    speciesOptions: SpeciesOptions[];
}

interface AddToFilteredSpecies {
    type: 'addToFilteredSpecies';
    species: string[];
}

interface RemoveFromFilteredSpecies {
    type: 'removeFromFilteredSpecies';
    species: string[];
}

interface UpdateFilteredStations {
    type: 'updateFilteredStations';
    stations: string[];
}

interface UpdateFilteredFAOAreas {
    type: 'updateFilteredFAOAreas';
    faoAreas: string[];
}

type DataAction =
    | UpdateStations
    | UpdateSelectedStation
    | UpdateStationDetails
    | UpdateAllSpecies
    | UpdateSpeciesDetails
    | UpdateFAOAreas
    | UpdateFilteredSpecies
    | AddToFilteredSpecies
    | RemoveFromFilteredSpecies
    | UpdateFilteredStations
    | UpdateSpeciesOptions
    | UpdateFilteredFAOAreas;
