interface UpdateStations {
    type: 'updateStations';
    stations: StationProperties[];
}

interface UpdateSelectedStation {
    type: 'updateSelectedStation';
    station: StationProperties | null;
}

interface UpdateAllSpecies {
    type: 'updateAllSpecies';
    species: SpeciesProperties[];
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
