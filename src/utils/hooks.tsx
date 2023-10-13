import React, { DependencyList } from 'react';

import { getData } from '../store/api';
import { DataActionDispatcherContext, DataStateContext } from '../store/contexts';

export const useStationDetails = (stationName?: string): StationDetails | null => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { stationsObject } = React.useContext(DataStateContext);

    React.useEffect(() => {
        if (stationName && !stationsObject[stationName]) {
            getData<StationDetails>(
                `stations/${stationName}`,
                (data) => {
                    data.species.sort((a, b) => {
                        return a.matched_canonical_full_name.localeCompare(b.matched_canonical_full_name);
                    });
                    dataActionDispatcher({ type: 'updateStationDetails', station: data });
                },
                () => undefined
            );
        }
    }, [stationName]);

    return stationName ? stationsObject[stationName] ?? null : null;
};

export const useSpeciesDetails = (speciesId?: string): SpeciesDetails | null => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { allSpeciesObject } = React.useContext(DataStateContext);

    React.useEffect(() => {
        if (speciesId && !allSpeciesObject[speciesId]) {
            getData<SpeciesDetails>(
                `species/${speciesId}`,
                (data) => {
                    dataActionDispatcher({ type: 'updateSpeciesDetails', species: data });
                },
                () => undefined
            );
        }
    }, [speciesId]);

    return speciesId ? allSpeciesObject[speciesId] ?? null : null;
};

export const usePagination = (data: SpeciesSummary[], itemsPerPage: number) => {
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const maxPage: number = Math.ceil(data.length / itemsPerPage);

    const currentData = () => {
        const begin = (currentPage - 1) * itemsPerPage;
        const end = begin + itemsPerPage;
        return data.slice(begin, end);
    };

    const next = () => {
        setCurrentPage((currPage) => Math.min(currPage + 1, maxPage));
    };

    const prev = () => {
        setCurrentPage((currPage) => Math.max(currPage - 1, 1));
    };

    const jump = (page: number) => {
        const pageNumber = Math.max(1, page);
        setCurrentPage(() => Math.min(pageNumber, maxPage));
    };

    return { next, prev, jump, currentData, currentPage, maxPage };
};

export const useDebounce = (callback: () => void, deps: DependencyList, delay?: number) => {
    // Based on https://stackoverflow.com/a/61127960/2074794
    React.useEffect(() => {
        const handler = setTimeout(() => callback(), delay);

        return () => clearTimeout(handler);
    }, [...(deps || []), Number.isNaN(delay) ? 0 : delay]);
};
