import { Box, Button, Stack, Typography } from '@mui/material';
import React, { FC, useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import { KeyboardDoubleArrowLeftOutlined, KeyboardDoubleArrowRightOutlined, LayersOutlined } from '@mui/icons-material';
import { theme } from '../../../theme';
import SearchPanel from './Search/SearchPanel';
import LayerControl from './Layer/LayerControl';

type SideBarState = 'search' | 'layer';

const RightSidebar: FC = () => {
    const [expanded, setExpanded] = useState(false);
    const [state, setState] = useState<SideBarState | null>('layer');

    return (
        <Stack
            direction="row"
            sx={{
                position: 'absolute',
                right: 0,
                height: '100%'
            }}
        >
            <Box sx={{ height: '100%', display: state === 'search' ? 'block' : 'none' }}>
                <SearchPanel onClose={() => setState(null)} />
            </Box>
            <Box sx={{ height: '100%', display: state === 'layer' ? 'block' : 'none' }}>
                <LayerControl onClose={() => setState(null)} />
            </Box>
            <Stack
                sx={{
                    width: expanded ? 118 : 48,
                    background: theme.palette.explore.mainTransparent,
                    backdropFilter: 'blur(4px)'
                }}
            >
                <Button
                    onClick={() => setState(state === 'search' ? null : 'search')}
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
                    onClick={() => setState(state === 'layer' ? null : 'layer')}
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

export default RightSidebar;
