import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useStationDetails } from '../../utils/hooks';

interface Props {
    station: StationSummary;
}

const Text = ({ station }: Props) => {
    const stationDetails = useStationDetails(station.name);
    const [selectedHathiTrustUrl, setSelectedHathiTrustUrl] = React.useState<string | null>(null);

    return stationDetails ? (
        <Stack spacing={2}>
            <Alert severity="warning">
                <Typography variant="subtitle2">
                    This text is from the scanned reports of <i>HMS Challenger</i> available at&nbsp;
                    <Link
                        href="https://catalog.hathitrust.org/Record/001473257"
                        target="_blank"
                        rel="noreferrer,nofollow"
                    >
                        HathiTrust
                    </Link>
                    .&nbsp;The text format and structure is as it appears in the OCRed document.
                </Typography>
            </Alert>
            <Accordion square disableGutters>
                <AccordionSummary expandIcon={<Icon baseClassName="icons">expand_more</Icon>}>
                    <Typography>See in HathiTrust</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List dense disablePadding>
                        {stationDetails.hathitrust_urls.map((url, idx) => (
                            <ListItemButton
                                key={url}
                                dense
                                disableGutters
                                onClick={() => setSelectedHathiTrustUrl(url)}
                            >
                                <ListItemText primary={`Part ${idx + 1}`} />
                            </ListItemButton>
                        ))}
                    </List>
                    {selectedHathiTrustUrl ? (
                        <Dialog
                            PaperProps={{
                                sx: { alignItems: 'center', height: '100%' }
                            }}
                            fullWidth
                            maxWidth={false}
                            open
                            onClose={() => setSelectedHathiTrustUrl(null)}
                        >
                            <DialogTitle>
                                Station {stationDetails.name} - HathiTrust&nbsp;
                                <Link href={selectedHathiTrustUrl} target="_blank" rel="noreferrer,nofollow">
                                    <IconButton>
                                        <Icon baseClassName="icons">launch</Icon>
                                    </IconButton>
                                </Link>
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8
                                    }}
                                    onClick={() => setSelectedHathiTrustUrl(null)}
                                >
                                    <Icon baseClassName="icons">close</Icon>
                                </IconButton>
                            </DialogTitle>
                            <DialogContent sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <Box
                                    sx={{ width: 'calc(100% - 64px)', height: 'calc(100% - 64px)' }}
                                    component="iframe"
                                    src={`${selectedHathiTrustUrl}%3Bui=embed`}
                                    title={`Station ${stationDetails.name} - HathiTrust`}
                                />
                            </DialogContent>
                        </Dialog>
                    ) : null}
                </AccordionDetails>
            </Accordion>
            <Typography sx={{ whiteSpace: 'break-spaces' }} variant="body1" component="pre">
                {stationDetails.text}
            </Typography>
        </Stack>
    ) : null;
};

export default Text;
