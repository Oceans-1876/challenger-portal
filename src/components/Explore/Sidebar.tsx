import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DownloadIcon from '@mui/icons-material/Download';
import Stack from '@mui/material/Stack';

import { DataActionDispatcherContext, DataStateContext } from '../../store/contexts';
import About from '../About';
import TabsGroup from '../TabsGroup';
import StationDetails from '../Station/Details';
import StationEnvironment from '../Station/Environment';
import StationSpecies from '../Station/Species';
import StationText from '../Station/Text';
import Filters from './Filters';

const Sidebar = () => {
    const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const { selectedStation } = React.useContext(DataStateContext);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                width: { xs: 500, lg: 550 },
                p: 1,
                zIndex: 1,
                boxShadow: '1px 0 5px gray'
            }}
        >
            {selectedStation ? (
                <>
                    <Typography variant="h5" align="center">
                        Station {selectedStation.name}
                    </Typography>
                    <TabsGroup
                        sx={{ flexGrow: 1 }}
                        initialPanel="Station"
                        panels={[
                            { Panel: () => <StationDetails station={selectedStation} />, label: 'Station' },
                            { Panel: () => <StationEnvironment station={selectedStation} />, label: 'Environment' },
                            { Panel: () => <StationSpecies station={selectedStation} />, label: 'Species' },
                            { Panel: () => <StationText station={selectedStation} />, label: 'Text' }
                        ]}
                    />
                    <Box sx={{ alignSelf: 'center', zIndex: 1 }}>
                        <Stack direction="column" spacing={4}>
                            <Stack>
                                <Button
                                    variant="outlined"
                                    href={`data:text/json;charset=utf-8,${encodeURIComponent(
                                        JSON.stringify(selectedStation, null, 4)
                                    )}`}
                                    download={`${selectedStation.name}.json`}
                                >
                                    <DownloadIcon />
                                    Download Station Details
                                </Button>
                            </Stack>
                            <Stack spacing={4}>
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        dataActionDispatcher({ type: 'updateSelectedStation', station: null })
                                    }
                                >
                                    Go Back
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </>
            ) : (
                <TabsGroup
                    initialPanel="Filters"
                    panels={[
                        {
                            Panel: Filters,
                            label: 'Filters'
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
