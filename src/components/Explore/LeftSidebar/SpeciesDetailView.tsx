import { Box, Button, Icon, Stack } from '@mui/material';
import React, { FC } from 'react';
import DownloadButton from '../../DownloadButton';
import SpeciesDetails from '../../Species/Details';

type Props = {
    species: SpeciesDetails | null;
    onClose: () => void;
};
const SpeciesDetailView: FC<Props> = ({ species, onClose }) => {
    return (
        <Box>
            <Stack direction="row" spacing={1}>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Icon baseClassName="icons">chevron_left</Icon>}
                    onClick={onClose}
                >
                    Back to species
                </Button>
                <DownloadButton
                    data={species}
                    filename={species?.matched_canonical_full_name ?? ''}
                    message="Download Species"
                />
            </Stack>
            <SpeciesDetails species={species} />
        </Box>
    );
};

export default SpeciesDetailView;
