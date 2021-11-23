import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Stack from '@mui/material/Stack';

interface Props {
    data: StationDetails | SpeciesDetails | SpeciesSummary[];
    filename: string;
    message: string;
}

const DownloadButton = ({ data, filename, message }: Props) => {
    console.log(filename);
    return (
        <Box sx={{ alignSelf: 'center', zIndex: 1 }}>
            <Stack direction="column" spacing={4}>
                <Button
                    variant="outlined"
                    startIcon={<Icon baseClassName="icons">download</Icon>}
                    href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 4))}`}
                    download={`${filename}.json`}
                >
                    {message}
                </Button>
            </Stack>
        </Box>
    );
};

export default DownloadButton;
