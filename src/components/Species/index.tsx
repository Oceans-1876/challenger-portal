import React from 'react';

import SpeciesList from './SpeciesList';
import { DataStateContext } from '../../store/contexts';
// import { DataActionDispatcherContext, DataStateContext } from '../../store/contexts';

const Species = (): JSX.Element => {
    // const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { allSpeciesList } = React.useContext(DataStateContext);

    return <SpeciesList species_list={allSpeciesList} />;
};

export default Species;
