interface StationProperties {
    name: string;
    sediment_sample: string;
    coordinates: [number, number];
    location: string;
    water_body: string;
    sea_area: string;
    place: string;
    date: string; // Date in ISO 8601 format (i.e. YYYY-MM-DD)
    fao_area: number;
    gear: string;
    depth_fathoms: number;
    bottom_water_temp_c: number;
    bottom_water_depth_fathoms: number;
    specific_gravity_at_bottom: number;
    surface_temp_c: number;
    specific_gravity_at_surface: number;
    water_temp_c_at_depth_fathoms: {
        [depth: string]: number;
    };
    text: string;
    species: { id: string }[];
}

interface SpeciesProperties {
    id: string;
    matched_name: string;
    matched_canonical_simple_name: string;
    matched_canonical_full_name: string;
    common_name: string;
    classification_path: string;
    classification_ranks: string;
    classification_ids: string;
    data_source_id: number;
}

interface DataState {
    stations: StationProperties[];
    selectedStation: StationProperties | null;
    allSpecies: SpeciesProperties[];
    selectedSpecies: string[];
}
