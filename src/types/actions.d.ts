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

interface UpdateSelectedSpecies {
    type: 'updateSelectedSpecies';
    species: string[];
}

interface AddToSelectedSpecies {
    type: 'addToSelectedSpecies';
    species: string[];
}

interface RemoveFromSelectedSpecies {
    type: 'removeFromSelectedSpecies';
    species: string[];
}

type DataAction =
    | UpdateStations
    | UpdateSelectedStation
    | UpdateStationDetails
    | UpdateAllSpecies
    | UpdateSpeciesDetails
    | UpdateSelectedSpecies
    | AddToSelectedSpecies
    | RemoveFromSelectedSpecies;
