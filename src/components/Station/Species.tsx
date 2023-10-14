import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';

import { useDebounce } from '../../utils/hooks';
import { Box, Button, TextField, Typography } from '@mui/material';
import { getData } from '../../store/api';
import { ListChildComponentProps, VariableSizeList } from 'react-window';
import { DataActionDispatcherContext } from '../../store/contexts';
import { CloseOutlined } from '@mui/icons-material';

type SpeciesListItems =
    | { type: 'group-title'; title: string }
    | {
          type: 'species-entry';
          data: SpeciesSummary;
      };

function groupSpecies(species: SpeciesSummary[]): SpeciesListItems[] {
    const groups: Record<string, SpeciesSummary[]> = {};
    for (const s of species) {
        const key = s.matched_canonical_full_name[0].toUpperCase();
        (groups[key] ?? (groups[key] = [])).push(s);
    }
    const res: SpeciesListItems[] = [];
    for (let i = 0; i < 26; ++i) {
        const key = String.fromCharCode(65 + i);
        if (groups[key]) {
            res.push({ type: 'group-title', title: key });
            for (const species of groups[key]) {
                res.push({
                    type: 'species-entry',
                    data: species
                });
            }
        }
    }
    return res;
}

interface Props {
    station: StationDetails | null;
}

const Species = ({ station }: Props) => {
    const dataActionDispatcher = useContext(DataActionDispatcherContext);
    const [filteredSpecies, setFilteredSpecies] = useState(station?.species ?? []);

    const [input, setInput] = useState('');

    useEffect(() => {
        setInput('');
    }, [station?.name]);

    useDebounce(
        () => {
            if (input) {
                getData<SpeciesSummary[]>(
                    `species/fuzzymatch/?query_str=${input}`,
                    (data) => {
                        setFilteredSpecies(data);
                    },
                    () => undefined
                );
            } else {
                setFilteredSpecies(station?.species ?? []);
            }
        },
        [input, station?.species],
        200
    );

    const filteredSpeciesListItems = useMemo(() => groupSpecies(filteredSpecies), [filteredSpecies]);

    const containerRef = useRef<HTMLDivElement>();
    const [listWdith, setListWidth] = useState(0);
    const [listHeight, setListHeight] = useState(0);

    useEffect(() => {
        setListWidth(containerRef.current?.clientWidth ?? 0);
        setListHeight(containerRef.current?.clientHeight ?? 0);
        const onResize = () => {
            setListWidth(containerRef.current?.clientWidth ?? 0);
            setListHeight(containerRef.current?.clientHeight ?? 0);
        };
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [containerRef.current]);

    const listRef = useRef<VariableSizeList<SpeciesListItems> | null>(null);

    useEffect(() => {
        listRef.current?.scrollTo(0);
        listRef.current?.resetAfterIndex(0);
    }, [filteredSpeciesListItems]);

    return (
        <>
            <Stack sx={{ height: '100%' }}>
                <TextField
                    sx={{ mt: '32px' }}
                    InputProps={{
                        endAdornment: input ? (
                            <Button variant="explore-text" onClick={() => setInput('')}>
                                <CloseOutlined />
                            </Button>
                        ) : null
                    }}
                    fullWidth
                    label="Search field"
                    // type="search"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Typography fontSize={12} sx={{ mt: '8px', color: '#FFFFFF99' }}>
                    {filteredSpecies.length} Species Matched
                </Typography>

                <Box sx={{ mt: '32px', flex: 'auto', color: 'white', overflow: 'hidden' }} ref={containerRef}>
                    <VariableSizeList
                        ref={listRef}
                        height={listHeight}
                        width={listWdith}
                        itemSize={(index) => (filteredSpeciesListItems[index].type === 'group-title' ? 44 : 64)}
                        itemCount={filteredSpeciesListItems.length}
                    >
                        {(props: ListChildComponentProps) => {
                            const { index, style } = props;

                            const item = filteredSpeciesListItems[index];

                            return item.type === 'group-title' ? (
                                <ListItem
                                    sx={{
                                        p: 0,
                                        lineHeight: 1.75,
                                        color: '#FFFFFF99',
                                        fontWeight: 600,
                                        boxShadow: '0px -1px 0px 0px rgba(144, 255, 243, 0.12) inset',
                                        ...style
                                    }}
                                >
                                    {item.title}
                                </ListItem>
                            ) : (
                                <ListItemButton
                                    key={item.data.id}
                                    sx={{ p: 0, ...style }}
                                    onClick={() => {
                                        dataActionDispatcher({ type: 'updateSelectedSpecies', species: item.data });
                                    }}
                                >
                                    <ListItem sx={{ py: '8px', px: '25px' }}>
                                        <Box>
                                            <Typography>{item.data.matched_canonical_full_name}</Typography>
                                            <Typography
                                                variant="caption"
                                                noWrap
                                                sx={{
                                                    display: 'block',
                                                    fontStyle: 'italic',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {item.data.current_name}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                </ListItemButton>
                            );
                        }}
                    </VariableSizeList>
                </Box>
            </Stack>
        </>
    );
};

export default Species;
