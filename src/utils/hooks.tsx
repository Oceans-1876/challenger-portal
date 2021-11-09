import React from 'react';

import { getData } from '../store/api';
import { DataActionDispatcherContext, DataStateContext } from '../store/contexts';

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
