import React, { useEffect, useMemo, useRef, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';

import { useDebounce } from '../../utils/hooks';
import { Box, TextField, Typography } from '@mui/material';
import { getData } from '../../store/api';
import { ListChildComponentProps, VariableSizeList } from 'react-window';

type SpeciesListItems =
    | { type: 'group-title'; title: string }
    | {
          type: 'species-entry';
          id: string;
          challengerName: string;
          currentName: string;
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
                    id: species.id,
                    challengerName: species.matched_canonical_full_name ?? '(none)',
                    currentName: species.current_name ?? '(none)'
                });
            }
        }
    }
    console.log(res);
    return res;
}

interface Props {
    station: StationDetails | null;
    setSelectedSpecies: (speciesId: string) => void;
}

const Species = ({ station, setSelectedSpecies }: Props) => {
    const [filteredSpecies, setFilteredSpecies] = useState(station?.species ?? []);
    const [input, setInput] = useState('');

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
    const listRef = useRef<VariableSizeList<SpeciesListItems> | null>(null);
    useEffect(() => {
        listRef.current?.scrollTo(0);
    }, [filteredSpeciesListItems]);

    return (
        <>
            <Stack sx={{ height: '100%' }}>
                <TextField
                    fullWidth
                    label="Search field"
                    type="search"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Typography fontSize={12} sx={{ mt: '8px', color: '#FFFFFF99' }}>
                    {filteredSpecies.length} Species Matched
                </Typography>

                <Box sx={{ mt: '32px', flex: 'auto', color: 'white' }} ref={containerRef}>
                    <VariableSizeList
                        ref={listRef}
                        height={containerRef.current?.clientHeight ?? 0}
                        width={containerRef.current?.clientWidth ?? 0}
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
                                    key={item.id}
                                    sx={{ p: 0, ...style }}
                                    onClick={() => setSelectedSpecies(item.id)}
                                >
                                    <ListItem sx={{ py: '8px', px: '25px' }}>
                                        <Box>
                                            <Typography>{item.challengerName}</Typography>
                                            <Typography
                                                variant="caption"
                                                noWrap
                                                sx={{
                                                    display: 'block',
                                                    fontStyle: 'italic',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {item.currentName}
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
