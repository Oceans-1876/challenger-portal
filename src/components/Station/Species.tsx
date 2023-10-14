import React, { CSSProperties, FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';

import { useDebounce } from '../../utils/hooks';
import { Box, Button, TextField, Typography } from '@mui/material';
import { getData } from '../../store/api';
import { ListChildComponentProps, VariableSizeList } from 'react-window';
import { DataActionDispatcherContext } from '../../store/contexts';
import { CloseOutlined } from '@mui/icons-material';
import { theme } from '../../theme';

const SECTION_TITLE_HEIGHT = 44;
const DATA_ITEM_HEIGHT = 60;

type SpeciesListItems =
    | { type: 'group-title'; title: string }
    | {
          type: 'species-entry';
          data: SpeciesSummary;
      };

type SectionLayoutInfo = {
    title: string;
    offset: number;
};

function groupSpecies(species: SpeciesSummary[]): {
    sections: SectionLayoutInfo[];
    items: SpeciesListItems[];
} {
    const groups: Record<string, SpeciesSummary[]> = {};
    for (const s of species) {
        const key = s.matched_canonical_full_name[0].toUpperCase();
        (groups[key] ?? (groups[key] = [])).push(s);
    }
    let offset = 0;
    const sections: SectionLayoutInfo[] = [];
    const items: SpeciesListItems[] = [];
    for (let i = 0; i < 26; ++i) {
        const key = String.fromCharCode(65 + i);
        if (groups[key]) {
            sections.push({ title: key, offset });
            items.push({ type: 'group-title', title: key });
            for (const species of groups[key]) {
                items.push({
                    type: 'species-entry',
                    data: species
                });
            }
            offset += SECTION_TITLE_HEIGHT + DATA_ITEM_HEIGHT * groups[key].length;
        }
    }
    return {
        sections,
        items
    };
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

    const { sections, items } = useMemo(() => groupSpecies(filteredSpecies), [filteredSpecies]);

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
    }, [items]);

    const [activeSection, setActiveSection] = useState('');

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
                    label="Search Species"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Typography fontSize={12} sx={{ mt: '8px', color: '#FFFFFF99' }}>
                    {filteredSpecies.length} Species Matched
                </Typography>

                <Stack
                    direction="row"
                    sx={{
                        mt: '32px',
                        flex: 'auto',
                        minHeight: 0,
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <Box
                        id="species-list"
                        sx={{
                            'flex': 'auto',
                            'alignSelf': 'stretch',
                            'color': 'white',
                            'minWidth': 0,
                            '& ::-webkit-scrollbar': {
                                display: 'none' // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge, etc.)
                            },
                            '& -ms-overflow-style:': {
                                display: 'none' // Hide the scrollbar for IE
                            }
                        }}
                        ref={containerRef}
                    >
                        <VariableSizeList
                            onScroll={(e) => {
                                const current = sections.findLast(
                                    (section) => section.offset <= e.scrollOffset + listHeight / 2
                                );
                                if (current) {
                                    setActiveSection(current.title);
                                }
                            }}
                            ref={listRef}
                            height={listHeight}
                            width={listWdith}
                            itemSize={(index) =>
                                items[index].type === 'group-title' ? SECTION_TITLE_HEIGHT : DATA_ITEM_HEIGHT
                            }
                            itemCount={items.length}
                        >
                            {(props: ListChildComponentProps) => {
                                const { index, style } = props;
                                const item = items[index];
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
                    <Stack>
                        {sections.map((section) => (
                            <Box
                                key={section.title}
                                onClick={() => {
                                    listRef.current?.scrollTo(section.offset);
                                }}
                                sx={{
                                    'color':
                                        section.title === activeSection ? theme.palette.explore.secondary : '#FFFFFF99',
                                    'textAlign': 'center',
                                    'fontSize': '12px',
                                    'fontWeight': 600,
                                    'transition': 'transform 0.2s ease-out',
                                    '&:hover': {
                                        color: theme.palette.explore.secondary,
                                        transform: 'scale(2)',
                                        cursor: 'pointer'
                                    }
                                }}
                            >
                                {section.title}
                            </Box>
                        ))}
                    </Stack>
                </Stack>
            </Stack>
        </>
    );
};

export default Species;
