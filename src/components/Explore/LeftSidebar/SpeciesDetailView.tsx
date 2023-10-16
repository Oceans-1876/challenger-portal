import React, { FC, useContext } from 'react';
import Typography from '@mui/material/Typography';
import { Box, Button, Chip, Stack, capitalize } from '@mui/material';
import { ArrowBackOutlined, FileDownloadOutlined, ScienceOutlined } from '@mui/icons-material';
import Field from '../../Field';
import { theme } from '../../../theme';
import { DataActionDispatcherContext, DataStateContext } from '../../../store/contexts';
import { useSpeciesDetails } from '../../../utils/hooks';

type Classification = {
    rank: string;
    name: string;
};

/**
 * Convert classification strings obtained from Global Names Verifier to objects
 * @param pathStr the `classificationPath` field returned by GNverifier
 * @param ranksStr the `classificationRanks` field returned by GNverifier
 */
function getClassificationPath(pathStr: string, ranksStr: string): Classification[] {
    const path = pathStr.split('|').map((s) => s || '-');
    const ranks = ranksStr.split('|').map((s) => s || '-');
    return path.map((name, i) => ({
        rank: capitalize(ranks[i]),
        name: capitalize(name)
    }));
}

const SpeciesDetailView: FC = () => {
    const { selectedSpecies } = useContext(DataStateContext);
    const dataActionDispatcher = useContext(DataActionDispatcherContext);

    const speciesDetails = useSpeciesDetails(selectedSpecies?.id);
    const classificationPath = getClassificationPath(
        speciesDetails?.classification_path ?? '',
        speciesDetails?.classification_ranks ?? ''
    );

    return (
        <Stack sx={{ height: '100%', alignItems: 'start' }}>
            <Button
                sx={{ px: 0 }}
                variant="explore-text"
                onClick={() => {
                    dataActionDispatcher({
                        type: 'updateSelectedSpecies',
                        species: null
                    });
                }}
            >
                <ArrowBackOutlined sx={{ width: 16, height: 16 }} />{' '}
                <Typography sx={{ ml: '16px', fontWeight: 500 }}>Species</Typography>
            </Button>

            <Box
                sx={{
                    'mt': '32px',
                    'flex': 'auto',
                    'alignSelf': 'stretch',
                    'overflow': 'scroll',
                    '&::-webkit-scrollbar': {
                        display: 'none' // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge, etc.)
                    },
                    '&-ms-overflow-style:': {
                        display: 'none' // Hide the scrollbar for IE
                    }
                }}
            >
                <Stack direction="row" sx={{ gap: '16px' }}>
                    <Typography sx={{ color: 'white', fontSize: '20px', fontWeight: 500 }}>
                        {speciesDetails?.matched_canonical_full_name}
                    </Typography>
                    <Button
                        disabled={!speciesDetails}
                        size="small"
                        variant="explore-card-focus"
                        href={`data:text/json;charset=utf-8,${encodeURIComponent(
                            JSON.stringify(speciesDetails, null, 4)
                        )}`}
                        download={`${speciesDetails?.current_canonical_full_name}.json`}
                        sx={{ px: '8px', minWidth: 0 }}
                    >
                        <FileDownloadOutlined />
                    </Button>
                </Stack>

                <Field
                    title="Record ID"
                    content={
                        <Chip
                            sx={{
                                color: 'white',
                                background: theme.palette.explore.unselectedSecondary
                            }}
                            label={speciesDetails?.record_id}
                        />
                    }
                    properties={{
                        'Challenger Name': selectedSpecies?.matched_canonical_full_name,
                        'Current Name': selectedSpecies?.current_name
                    }}
                    IconComponent={ScienceOutlined}
                />

                <Field
                    title="Classifications"
                    table={{
                        columns: [
                            { key: 'name', label: 'Classification Path' },
                            { key: 'rank', label: 'Classification Ranks' }
                        ],
                        rows: classificationPath
                    }}
                    IconComponent={ScienceOutlined}
                />

                {speciesDetails?.species_common_names.length ? (
                    <Field
                        title="Common Names"
                        table={{
                            columns: [
                                { key: 'language', label: 'Language' },
                                { key: 'name', label: 'Name' }
                            ],
                            rows: speciesDetails
                                ? speciesDetails.species_common_names.map(({ language, name }) => ({ language, name }))
                                : []
                        }}
                        IconComponent={ScienceOutlined}
                    />
                ) : null}

                {speciesDetails?.outlink ? (
                    <Field
                        title="Outlink"
                        content={
                            <Button
                                size="small"
                                sx={{ p: 0 }}
                                variant="explore-text"
                                href={speciesDetails?.outlink}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {speciesDetails?.outlink}
                            </Button>
                        }
                        IconComponent={ScienceOutlined}
                    />
                ) : null}

                {speciesDetails?.species_synonyms.length ? (
                    <Field
                        title="Other Synonymous Species"
                        table={{
                            columns: [{ key: 'link', label: 'Scientific Names' }],
                            rows: speciesDetails.species_synonyms.map((sp) => ({
                                link: (
                                    <Button
                                        sx={{ p: 0 }}
                                        size="small"
                                        variant="explore-text"
                                        href={sp.outlink ?? ''}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {sp.scientific_name}
                                    </Button>
                                )
                            }))
                        }}
                        IconComponent={ScienceOutlined}
                    />
                ) : null}

                {speciesDetails?.species_extra[0] ? (
                    <Field
                        title="Extra"
                        table={{
                            columns: [
                                { key: 'key', label: 'Key' },
                                { key: 'value', label: 'Value' }
                            ],
                            rows: [
                                {
                                    key: 'Extinct',
                                    value: speciesDetails.species_extra[0].isExtinct ? 'Yes' : 'No'
                                },
                                {
                                    key: 'Marine',
                                    value: speciesDetails.species_extra[0].isMarine ? 'Yes' : 'No'
                                },
                                {
                                    key: 'Brackish',
                                    value: speciesDetails.species_extra[0].isBrackish ? 'Yes' : 'No'
                                },
                                {
                                    key: 'Freshwater',
                                    value: speciesDetails.species_extra[0].isFreshwater ? 'Yes' : 'No'
                                },
                                {
                                    key: 'Terrestrial',
                                    value: speciesDetails.species_extra[0].isTerrestrial ? 'Yes' : 'No'
                                },
                                {
                                    key: ' Accepted status',
                                    value: speciesDetails.species_extra[0].status ? 'Accepted' : 'Not accepted'
                                },
                                {
                                    key: 'Unaccepted reason',
                                    value: speciesDetails.species_extra[0].unaccepted_reason ?? '-'
                                }
                            ]
                        }}
                        IconComponent={ScienceOutlined}
                    />
                ) : null}
            </Box>
        </Stack>
    );
};

export default SpeciesDetailView;
