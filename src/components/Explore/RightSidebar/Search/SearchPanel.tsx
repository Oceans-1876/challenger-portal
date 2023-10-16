import { Box, Button, Divider, MenuItem, Select, Stack } from '@mui/material';
import React, { FC, useContext, useEffect, useState } from 'react';
import { CloseOutlined } from '@mui/icons-material';
import { theme } from '@app/theme';
import GeneralSearch from './GeneralSearch';
import AdvancedSearch from './AdvancedSearch';
import { DataActionDispatcherContext, DataStateContext } from '@app/store/contexts';

type SearchType = 'general' | 'advanced';

type Props = {
    onClose: () => void;
};

const SearchPanel: FC<Props> = ({ onClose }) => {
    const [searchType, setSearchType] = useState<SearchType>('general');
    const { allStationsList } = useContext(DataStateContext);
    const dataActionDispatcher = useContext(DataActionDispatcherContext);

    useEffect(() => {
        dataActionDispatcher({
            type: 'updateFilteredStations',
            stations: allStationsList
        });
    }, [searchType]);

    const toggle = (
        <Button
            variant="explore-text"
            onClick={() => {
                setSearchType(searchType === 'advanced' ? 'general' : 'advanced');
            }}
        >
            {searchType === 'advanced' ? 'General' : 'Advanced'} Search
        </Button>
    );
    return (
        <Box
            sx={{
                width: 450,
                height: '100%',
                background: theme.palette.explore.selected,
                padding: '32px',
                color: theme.palette.explore.secondary
            }}
        >
            <Stack direction="row" sx={{ alignItems: 'center' }}>
                <Select
                    size="small"
                    value={searchType}
                    label="Age"
                    variant="standard"
                    sx={{
                        '& > div:focus': {
                            backgroundColor: 'transparent'
                        },
                        '&::before, &::after': {
                            display: 'none'
                        },
                        '&, & svg': { color: theme.palette.explore.secondary },
                        'fontWeight': 600
                    }}
                    onChange={(v) => setSearchType(v.target.value as SearchType)}
                >
                    <MenuItem value="general">General Search</MenuItem>
                    <MenuItem value="advanced">Advanced Search</MenuItem>
                </Select>
                <Box flex="1" />
                <Button onClick={onClose}>
                    <CloseOutlined sx={{ color: theme.palette.explore.secondary }} />
                </Button>
            </Stack>
            <Divider sx={{ background: theme.palette.explore.divider, mt: '16px', mb: '16px' }} />

            {searchType === 'general' ? (
                <GeneralSearch toggle={toggle} onClose={onClose} />
            ) : (
                <AdvancedSearch toggle={toggle} onClose={onClose} />
            )}
        </Box>
    );
};

export default SearchPanel;
