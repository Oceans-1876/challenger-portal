import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { OpenInNewOutlined } from '@mui/icons-material';
import hathiTrustLogoSvg from '../../images/hathi_trust.svg';
import Loading from '../Loading';

interface Props {
    station: StationDetails;
}

const Text = ({ station }: Props) => {
    const [iframeLoaded, setIframeLoaded] = useState(false);

    return (
        <Stack sx={{ height: '100%' }}>
            <Alert
                severity="warning"
                sx={{
                    'background': '#000000E5',
                    'color': '#FFDCA8',
                    'fontWeight': 400!,
                    '& .MuiAlert-icon': {
                        color: '#FFDCA8',
                        alignItems: 'center'
                    }
                }}
            >
                This text is from the scanned reports of HMS Challenger available at HathiTrust. The text format and
                structure is as it appears in the OCRed document.
            </Alert>
            <Button
                size="large"
                variant="explore-card-focus"
                href={station.hathitrust_urls[0]}
                target="_blank"
                rel="noreferrer,nofollow"
                sx={{ flex: 'none', my: '32px', mx: 'auto' }}
            >
                <Box sx={{ width: 16, height: 16, background: `url(${hathiTrustLogoSvg})` }} />
                <Typography sx={{ mx: '12px' }}>Read in HathiTrust</Typography>
                <OpenInNewOutlined />
            </Button>
            <Box
                onLoad={() => setIframeLoaded(true)}
                sx={{
                    display: iframeLoaded ? 'block' : 'none',
                    flex: 'auto',
                    border: 'none'
                }}
                component="iframe"
                src={`${station.hathitrust_urls[0]}`}
                title={`Station ${station.name} - HathiTrust`}
            />
            {iframeLoaded ? null : <Loading />}
        </Stack>
    );
};

export default Text;
