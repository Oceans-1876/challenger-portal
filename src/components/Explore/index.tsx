import React from 'react';

import Map from './Map';
import { FilterStateContext, FilterActionDispatcherContext } from '../../store/contexts';
import { filterReducers } from '../../store/reducers';
import { filtersStateInitialValue } from '../../store/states';

const Explore = (): JSX.Element => {
    const [filterState, filterActionDispatcher] = React.useReducer(filterReducers, filtersStateInitialValue);

    return (
        <FilterActionDispatcherContext.Provider value={filterActionDispatcher}>
            <FilterStateContext.Provider value={filterState}>
                <Map />
            </FilterStateContext.Provider>
        </FilterActionDispatcherContext.Provider>
    );
};

export default Explore;
