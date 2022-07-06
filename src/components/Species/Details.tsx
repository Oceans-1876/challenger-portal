import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

interface Props {
    species: SpeciesDetails;
}
const Details = ({ species }: Props) => (
    <List>
        <ListItem>
            <Typography variant="h5">{species.matched_canonical_full_name}</Typography>
        </ListItem>
        <ListItem>Record Id: {species.record_id}</ListItem>
        <ListItem>Matched Name: {species.matched_name ? species.matched_name : 'No Matched Name found.'}</ListItem>
        <ListItem>Current Name: {species.current_name ? species.current_name : 'No Current Name found.'}</ListItem>
        <ListItem>
            Classification path: {species.classification_path ? species.classification_path : 'No Path found'}
        </ListItem>
        <ListItem>
            Classification ranks:
            {species.classification_ranks ? species.classification_ranks : 'No Ranks found'}
        </ListItem>
        {species.species_extra.length > 0 ? (
            <>
                <ListItem>Brackish: {species.species_extra[0].isBrackish ? 'Yes' : 'No'}</ListItem>
                <ListItem>Extinct: {species.species_extra[0].isExtinct ? 'Yes' : 'No'}</ListItem>
                <ListItem>Freshwater: {species.species_extra[0].isFreshwater ? 'Yes' : 'No'}</ListItem>
                <ListItem>Marine: {species.species_extra[0].isMarine ? 'Yes' : 'No'}</ListItem>
                <ListItem>Terrestrial: {species.species_extra[0].isTerrestrial ? 'Yes' : 'No'}</ListItem>
                <ListItem>
                    Accepted status:
                    {species.species_extra[0].status ? 'Accepted' : 'Not accepted'}
                </ListItem>
                {species.species_extra[0].status ? null : (
                    <ListItem>{species.species_extra[0].unaccepted_reason}</ListItem>
                )}
            </>
        ) : null}

        <ListItem>
            Species Common Names:
            {species.species_common_names.length > 0 ? (
                <List>
                    {species.species_common_names.map((sp) => {
                        return (
                            <ListItem key={sp.id}>
                                {sp.language}:{` ${sp.name}`}
                            </ListItem>
                        );
                    })}
                </List>
            ) : (
                'No Species Common Names found.'
            )}
        </ListItem>
        {species.outlink ? (
            <ListItem>
                <a href={species.outlink}>OutLink to Species</a>
            </ListItem>
        ) : null}
        <Typography variant="h5">Other Synonymous Species</Typography>
        {species.species_synonyms.length > 0 ? (
            <List>
                {species.species_synonyms.map((sp) => {
                    return (
                        <ListItem key={sp.id}>
                            <a href={sp.outlink}>{sp.scientific_name}</a>
                        </ListItem>
                    );
                })}
            </List>
        ) : (
            'No other synonymous species found.'
        )}
    </List>
);

export default Details;
