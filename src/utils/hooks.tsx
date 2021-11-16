import axios from 'axios';
import React from 'react';

import { getData } from '../store/api';
import { DataActionDispatcherContext, DataStateContext } from '../store/contexts';

import faoAreasUrl from '../files/fao_areas.geojson';

export const useStationDetails = (stationName: string): StationDetails | null => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { stationsObject } = React.useContext(DataStateContext);
    const [stationDetails, setStationDetails] = React.useState<StationDetails | null>(null);

    React.useEffect(() => {
        if (stationsObject[stationName]) {
            setStationDetails(stationsObject[stationName]);
        } else {
            getData<StationDetails>(`stations/${stationName}`, (data) => {
                data.species.sort((a, b) => a.matched_canonical_full_name.localeCompare(b.matched_canonical_full_name));
                setStationDetails(data);
                dataActionDispatcher({ type: 'updateStationDetails', station: data });
            });
        }
    }, [stationName]);

    return stationDetails;
};

export const useSpeciesDetails = (speciesId: string): SpeciesDetails | null => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { allSpeciesObject } = React.useContext(DataStateContext);
    const [speciesDetails, setSpeciesDetails] = React.useState<SpeciesDetails | null>(null);

    React.useEffect(() => {
        if (allSpeciesObject[speciesId]) {
            setSpeciesDetails(allSpeciesObject[speciesId]);
        } else {
            getData<SpeciesDetails>(`species/${speciesId}`, (data) => {
                setSpeciesDetails(data);
                dataActionDispatcher({ type: 'updateSpeciesDetails', species: data });
            });
        }
    }, [speciesId]);

    return speciesDetails;
};

export const useFAOAreas = (): FAOArea[] => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { faoAreas } = React.useContext(DataStateContext);
    const [faoAreasData, setFAOAreasData] = React.useState<FAOArea[]>(faoAreas);

    React.useEffect(() => {
        if (!faoAreas.length) {
            axios
                .get(faoAreasUrl)
                .then((res) => {
                    const data = (
                        res.data.features.map(
                            ({
                                properties: { OCEAN, F_AREA, NAME_EN }
                            }: {
                                properties: { OCEAN: string; F_AREA: string; NAME_EN: string };
                            }) => ({
                                code: F_AREA,
                                name: NAME_EN,
                                ocean: OCEAN
                            })
                        ) as FAOArea[]
                    ).sort((a, b) => a.name.localeCompare(b.name));
                    setFAOAreasData(data);
                    dataActionDispatcher({
                        type: 'updateFAOAreas',
                        faoAreas: data
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, []);

    return faoAreasData;
};
