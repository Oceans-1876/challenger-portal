import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Stack from '@mui/material/Stack';

interface Props {
    stationDetails: StationDetails;
}

const DownloadButton = ({ stationDetails }: Props) => {
    return (
        <Box sx={{ alignSelf: 'center', zIndex: 1 }}>
            <Stack direction="column" spacing={4}>
                <Button
                    variant="outlined"
                    startIcon={<Icon baseClassName="icons">download</Icon>}
                    href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(stationDetails, null, 4))}`}
                    download={`${stationDetails.name}.json`}
                >
                    Download Station Details
                </Button>
            </Stack>
        </Box>
    );
};

export default DownloadButton;
