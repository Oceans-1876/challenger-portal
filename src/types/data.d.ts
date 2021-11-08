interface StationSummary {
    name: string;
    date: string; // Date in ISO 8601 format (i.e. YYYY-MM-DD)
    coordinates: PointCoordinates;
}

interface StationDetails extends StationSummary {
    sediment_sample?: string;
    location: string;
    water_body: string;
    sea_area?: string;
    place?: string;
    fao_area: number;
    gear?: string;
    depth_fathoms?: number;
    bottom_water_temp_c?: number;
    bottom_water_depth_fathoms?: number;
    specific_gravity_at_bottom?: number;
    surface_temp_c?: number;
    specific_gravity_at_surface?: number;
    water_temp_c_at_depth_fathoms: {
        [depth: string]: ?number;
    };
    text: string;
    species: Array<{ id: string }>;
}

interface SpeciesSummary {
    id: string;
    matched_canonical_full_name: string;
}

interface SpeciesDetails extends SpeciesSummary {
    id: string;
    matched_name: string;
    matched_canonical_simple_name: string;
    common_name: string;
    classification_path: string;
    classification_ranks: string;
    classification_ids: string;
    data_source_id: number;
}

interface DataState {
    stationsList: StationSummary[];
    stationsObject: { [name: string]: StationDetails };
    stationsBounds: import('maplibre-gl').LngLatBoundsLike;
    journeyPath: LineCoordinates;
    selectedStation: StationDetails | null;
    allSpeciesList: SpeciesSummary[];
    allSpeciesObject: { [matched_canonical_full_name: string]: SpeciesDetails };
    selectedSpecies: string[];
}
