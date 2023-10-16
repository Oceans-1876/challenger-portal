import { Box, FormControlLabel, Radio } from '@mui/material';
import React, { FC, useContext } from 'react';
import { MapActionDispatcherContext, MapStateContext } from '@app/store/contexts';
import { theme } from '@app/theme';

type Props = {
    basemapId: string;
    name: string;
    previewImgUrl: string;
};

const BasemapOption: FC<Props> = ({ name, basemapId, previewImgUrl }) => {
    const { activeBasemap } = useContext(MapStateContext);
    const mapActionDispatcher = useContext(MapActionDispatcherContext);

    return (
        <Box
            onClick={() => {
                mapActionDispatcher({
                    type: 'updateBaseMap',
                    id: basemapId
                });
            }}
        >
            <Box
                sx={{
                    'backgroundImage': `url(${previewImgUrl})`,
                    'width': 180,
                    'height': 136,
                    'backgroundSize': '180px 136px',
                    'borderRadius': '16px',
                    'overflow': 'hidden',
                    'cursor': 'pointer',
                    'position': 'relative',
                    '::after': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        borderRadius: '16px',
                        border: activeBasemap === basemapId ? `2px solid ${theme.palette.explore.secondary}` : 'none'
                    }
                }}
            />
            <Box>
                <FormControlLabel
                    value={basemapId}
                    checked={activeBasemap === basemapId}
                    sx={{
                        '.MuiTypography-root': {
                            color:
                                activeBasemap === basemapId
                                    ? theme.palette.explore.mainText
                                    : theme.palette.explore.secondaryText
                        }
                    }}
                    control={<Radio />}
                    label={name}
                />
            </Box>
        </Box>
    );
};

export default BasemapOption;
