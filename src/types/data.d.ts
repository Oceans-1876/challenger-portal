import { Feature, MultiPolygon, Polygon } from '@turf/turf';

declare global {
    interface FAOArea {
        code: number;
        name: string;
        ocean: string;
        geometry: Polygon | MultiPolygon;
    }

    interface StationGroup {
        faoArea: FAOArea;
        stations: StationSummary[];
    }

    interface StationSummary {
        name: string;
        date: string; // Date in ISO 8601 format (i.e. YYYY-MM-DD)
        coordinates: PointCoordinates;
        fao_area: number;
        gear?: string;
        sediment_sample: string;
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
        hathitrust_urls: string[];
        species: SpeciesSummary[];
    }

    interface SpeciesSummary {
        id: string;
        record_id: string;
        matched_canonical_full_name: string;
        current_name: string;
    }

    interface SpeciesDetails extends SpeciesSummary {
        id: string;
        matched_name: string;
        current_name: string;
        current_record_id: string;
        matched_canonical_simple_name?: string;
        current_canonical_simple_name?: string;
        current_canonical_full_name?: string;
        common_name?: string;
        classification_path?: string;
        classification_ranks?: string;
        classification_ids?: string;
        outlink?: string;
        species_extra: SpeciesExtra[];
        species_synonyms: SpeciesSynonyms[];
        species_common_names: SpeciesCommonNames[];
        data_source_id: number;
    }

    interface SpeciesExtra {
        id: string;
        scientific_name?: string;
        status: boolean;
        unaccepted_reason?: string;
        valid_name?: string;
        lsid?: string;
        isBrackish: boolean;
        isExtinct: boolean;
        isFreshwater: boolean;
        isMarine: boolean;
        isTerrestrial: boolean;
        species_id: string;
    }

    interface SpeciesSynonyms {
        id: string;
        scientific_name?: string;
        outlink?: string;
        species_id: string;
    }

    interface SpeciesCommonNames {
        id: string;
        language: string;
        name: string;
        species_id: string;
    }

    interface DataState {
        faoAreas: FAOArea[];
        faoAreaIcons: { [faoAreaCode: string]: string }; // rendered and base64 encoded
        allStationsList: StationSummary[];
        stationsObject: { [name: string]: StationDetails };
        journeyPath: LineCoordinates;
        filteredStations: StationGroup[];
        selectedFaoArea: FAOArea | null; // FAO area code
        focusedStation: StationSummary | null; // station name
        selectedStation: StationSummary | null; // station name
        allSpeciesList: SpeciesSummary[];
        allSpeciesObject: { [matched_canonical_full_name: string]: SpeciesDetails };
        tempToUnit: string;
        depthToUnit: string;
    }
}
