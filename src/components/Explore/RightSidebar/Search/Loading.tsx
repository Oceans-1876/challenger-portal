import { CircularProgress, Modal } from '@mui/material';
import React, { FC } from 'react';
import { theme } from '@app/theme';

const Loading: FC<{ open: boolean }> = ({ open }) => {
    return (
        <Modal open={open} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress
                size={100}
                sx={{
                    color: theme.palette.explore.selectedSecondary
                }}
            />
        </Modal>
    );
};

export default Loading;
