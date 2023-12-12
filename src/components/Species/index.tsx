import React from 'react';

import { DataStateContext } from '@app/store/contexts';
import SpeciesList from './SpeciesList';

const Species = (): JSX.Element => {
    const { allSpeciesList } = React.useContext(DataStateContext);

    return <SpeciesList species_list={allSpeciesList} />;
};

export default Species;
