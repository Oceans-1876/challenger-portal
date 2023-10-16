import React from 'react';

import SpeciesList from './SpeciesList';
import { DataStateContext } from '@app/store/contexts';

const Species = (): JSX.Element => {
    const { allSpeciesList } = React.useContext(DataStateContext);

    return <SpeciesList species_list={allSpeciesList} />;
};

export default Species;
