import { Box, Button, Divider, Grid, Slider, Stack, Typography } from '@mui/material';
import React, { FC, useContext, useEffect, useState } from 'react';
import { CloseOutlined, Opacity } from '@mui/icons-material';
import { theme } from '@app/theme';
import BasemapOption from './BasemapOption';
import mapPreviewSimple from '@app/images/layer_simple.png';
import mapPreviewSatellite from '@app/images/layer_satellite.png';
import mapPreviewMonochrome from '@app/images/layer_monochrome.png';
import { MapContext } from '@app/store/contexts';
import { runWhenReady } from '@app/components/Map/utils';

type Props = {
    onClose: () => void;
};

const LayerControl: FC<Props> = ({ onClose }) => {
    const mapRef = useContext(MapContext);
    const [faoOpacity, setFaoOpacity] = useState(0.5);

    useEffect(() => {
        const map = mapRef.current;
        if (map) {
            runWhenReady(map, () => {
                map?.setPaintProperty('faoAreas', 'line-opacity', faoOpacity);
            });
        }
    }, [faoOpacity]);

    return (
        <Box
            sx={{
                width: 450,
                height: '100%',
                background: theme.palette.explore.selected,
                padding: '32px',
                fontWeight: 600,
                color: theme.palette.explore.secondary
            }}
        >
            <Stack direction="row" sx={{ alignItems: 'center' }}>
                Map Layers
                <Box flex="1" />
                <Button onClick={onClose}>
                    <CloseOutlined sx={{ color: theme.palette.explore.secondary }} />
                </Button>
            </Stack>
            <Divider sx={{ background: theme.palette.explore.divider, mt: '16px', mb: '16px' }} />
            <Box sx={{ my: '16px', py: '16px' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: theme.palette.explore.secondaryText }}>
                    Base Map
                </Typography>
                <Grid columns={12} container spacing="25px" sx={{ mt: 0 }}>
                    <Grid xs={6} item>
                        <BasemapOption
                            name="Simple Style"
                            basemapId="World_Ocean_Base"
                            previewImgUrl={mapPreviewSimple}
                        />
                    </Grid>
                    <Grid xs={6} item>
                        <BasemapOption name="Satellite" basemapId="World_Imagery" previewImgUrl={mapPreviewSatellite} />
                    </Grid>
                    <Grid xs={6} item>
                        <BasemapOption name="Monochrome" basemapId="Carto" previewImgUrl={mapPreviewMonochrome} />
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ my: '16px', py: '16px' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: theme.palette.explore.secondaryText }}>
                    FAO Areas
                </Typography>
                <Stack
                    spacing={2}
                    direction="row"
                    alignItems="center"
                    sx={{ mt: '24px', color: theme.palette.explore.secondaryText }}
                >
                    <Opacity sx={{ width: 16, height: 16 }} />
                    <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={faoOpacity}
                        onChange={(_, value) => setFaoOpacity(value as number)}
                        onChangeCommitted={(_, value) => setFaoOpacity(value as number)}
                    />
                    <Opacity sx={{ width: 24, height: 24 }} />
                </Stack>
            </Box>
        </Box>
    );
};

export default LayerControl;
