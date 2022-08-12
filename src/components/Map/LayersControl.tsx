import React from 'react';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Popover from '@mui/material/Popover';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { getLegendFromStyle } from './legends';

interface Props {
    map?: maplibregl.Map;
    layers: LayersControlProps[];
}

const LayersControl = ({ map, layers }: Props) => {
    const [layersControlAttributionProps, updateLayersControlAttributionProps] = React.useState<{
        anchor?: HTMLElement;
        text?: string;
        url?: string;
    }>({});

    return (
        <>
            {layers.map(({ id, label, initialOpacity, attribution: layerAttribution, style }) => (
                <Box key={id} sx={{ p: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle1">{label}</Typography>
                        {layerAttribution ? (
                            <IconButton
                                size="small"
                                onClick={(e) =>
                                    updateLayersControlAttributionProps({
                                        anchor: e.currentTarget,
                                        text: layerAttribution.text,
                                        url: layerAttribution.url
                                    })
                                }
                            >
                                <Icon baseClassName="icons" fontSize="inherit">
                                    attribution
                                </Icon>
                            </IconButton>
                        ) : null}
                    </Stack>
                    <Stack sx={{ ml: 1 }} direction="row" alignItems="center" spacing={2}>
                        {getLegendFromStyle(style)}
                        <Typography variant="caption">Opacity</Typography>
                        <Slider
                            sx={{ width: 100 }}
                            size="small"
                            min={0}
                            max={1}
                            step={0.1}
                            defaultValue={initialOpacity}
                            onChange={(_e, value) => {
                                map?.setPaintProperty(id, 'fill-opacity', value);
                            }}
                        />
                    </Stack>
                </Box>
            ))}
            <Popover
                open={Boolean(layersControlAttributionProps.anchor)}
                disableRestoreFocus
                anchorEl={layersControlAttributionProps.anchor}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                onClose={() => updateLayersControlAttributionProps({})}
            >
                <Stack sx={{ p: 1, maxWidth: 300 }} direction="row" alignItems="center" spacing={1}>
                    <Typography variant="caption">{layersControlAttributionProps.text}</Typography>
                    {layersControlAttributionProps.url ? (
                        <Link href={layersControlAttributionProps.url} target="_blank" rel="noopener,noreferrer">
                            <Icon baseClassName="icons" fontSize="small">
                                launch
                            </Icon>
                        </Link>
                    ) : null}
                </Stack>
            </Popover>
        </>
    );
};

export default LayersControl;
