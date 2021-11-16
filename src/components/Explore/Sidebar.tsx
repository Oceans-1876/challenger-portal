import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { DataActionDispatcherContext, DataStateContext } from '../../store/contexts';
import About from '../About';
import Intro from '../Intro';
import TabsGroup from '../TabsGroup';
import StationDetails from '../Station/Details';
import StationSpecies from '../Station/Species';
import StationText from '../Station/Text';

const Sidebar = () => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { selectedStation } = React.useContext(DataStateContext);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', background: '#fff', width: { xs: 350, lg: 500 }, p: 1 }}>
            {selectedStation ? (
                <>
                    <TabsGroup
                        sx={{ flexGrow: 1 }}
                        initialPanel="Station"
                        panels={[
                            { Panel: () => <StationDetails station={selectedStation} />, label: 'Station' },
                            { Panel: () => <StationSpecies station={selectedStation} />, label: 'Species' },
                            { Panel: () => <StationText station={selectedStation} />, label: 'Text' }
                        ]}
                    />
                    <Box sx={{ alignSelf: 'center' }}>
                        <Button
                            variant="outlined"
                            onClick={() => dataActionDispatcher({ type: 'updateSelectedStation', station: null })}
                        >
                            Go Back
                        </Button>
                    </Box>
                </>
            ) : (
                <TabsGroup
                    initialPanel="Intro"
                    panels={[
                        {
                            Panel: Intro,
                            label: 'Intro'
                        },
                        {
                            Panel: About,
                            label: 'About'
                        }
                    ]}
                />
            )}
        </Box>
    );
};

export default Sidebar;
