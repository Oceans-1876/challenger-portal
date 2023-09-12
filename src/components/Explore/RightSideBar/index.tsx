import { Box, Button, Stack, Typography } from '@mui/material';
import React, { FC, useState } from 'react';
import { theme } from '../../../theme';
import FilterListIcon from '@mui/icons-material/FilterList';
import { KeyboardDoubleArrowLeftOutlined, KeyboardDoubleArrowRightOutlined, LayersOutlined } from '@mui/icons-material';
import SearchPanel from './SearchPanel';

const RightSideBar: FC = () => {
    const [expanded, setExpanded] = useState(false);
    const [searchPanelOpen, setSearchPanelOpen] = useState(true);

    return (
        <Stack
            direction="row"
            sx={{
                position: 'absolute',
                right: 0,
                height: '100%'
            }}
        >
            <Box sx={{ height: '100%', display: searchPanelOpen ? 'block' : 'none' }}>
                <SearchPanel onClose={() => setSearchPanelOpen(false)} />
            </Box>
            <Stack
                sx={{
                    width: expanded ? 118 : 48,
                    background: theme.palette.explore.main,
                    backdropFilter: 'blur(4px)'
                }}
            >
                <Button
                    onClick={() => setSearchPanelOpen(!searchPanelOpen)}
                    sx={{
                        justifyContent: 'start',
                        padding: '12px',
                        minWidth: 0,
                        color: theme.palette.explore.secondary,
                        textTransform: 'none'
                    }}
                >
                    <FilterListIcon />
                    {expanded ? <Typography ml="12px">Filter</Typography> : null}
                </Button>
                <Button
                    sx={{
                        justifyContent: 'start',
                        padding: '12px',
                        minWidth: 0,
                        color: theme.palette.explore.secondary,
                        textTransform: 'none'
                    }}
                >
                    <LayersOutlined />
                    {expanded ? <Typography ml="12px">Layers</Typography> : null}
                </Button>
                <Box flex="1" />
                <Button sx={{ padding: '12px', minWidth: 0 }} onClick={() => setExpanded(!expanded)}>
                    {expanded ? (
                        <KeyboardDoubleArrowRightOutlined sx={{ color: theme.palette.explore.secondary }} />
                    ) : (
                        <KeyboardDoubleArrowLeftOutlined sx={{ color: theme.palette.explore.secondary }} />
                    )}
                </Button>
            </Stack>
        </Stack>
    );
};

export default RightSideBar;
