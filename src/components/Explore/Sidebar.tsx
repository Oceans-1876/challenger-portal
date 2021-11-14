import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { DataStateContext } from '../../store/contexts';

const Sidebar = () => {
    const { selectedStation } = React.useContext(DataStateContext);

    return (
        <Box sx={{ background: '#fff', width: { xs: 350, lg: 500 }, p: 1 }}>
            SIDEBAR PLACEHOLDER
            {selectedStation ? (
                <List>
                    <ListItem>
                        Station {selectedStation.name} - {selectedStation.location}
                    </ListItem>
                    <ListItem>Surface temperature: {selectedStation.surface_temp_c}&deg;</ListItem>
                    <ListItem>Water temperature (bottom): {selectedStation.bottom_water_temp_c}&deg;</ListItem>
                </List>
            ) : null}
        </Box>
    );
};

export default Sidebar;
