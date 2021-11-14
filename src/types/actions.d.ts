interface UpdateStations {
    type: 'updateStations';
    stations: StationSummary[];
}

interface UpdateSelectedStation {
    type: 'updateSelectedStation';
    station: StationDetails | null;
}

interface UpdateAllSpecies {
    type: 'updateAllSpecies';
    species: SpeciesSummary[];
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
    | UpdateAllSpecies
    | UpdateSelectedSpecies
    | AddToSelectedSpecies
    | RemoveFromSelectedSpecies;
