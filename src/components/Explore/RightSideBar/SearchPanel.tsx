import { Box, Button, Divider, FormControlLabel, MenuItem, Radio, RadioGroup, Select, Stack } from '@mui/material';
import React, { FC, useState } from 'react';
import { theme } from '../../../theme';
import { CloseOutlined } from '@mui/icons-material';
import GeneralSearch from './GeneralSearch';
import AdvancedSearch from './AdvancedSearch';

type SearchType = 'general' | 'advanced';

type Props = {
    onClose: () => void;
};

const SearchPanel: FC<Props> = ({ onClose }) => {
    const [searchType, setSearchType] = useState<SearchType>('general');
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

            {searchType == 'general' ? <GeneralSearch /> : <AdvancedSearch />}
        </Box>
    );
};

export default SearchPanel;
