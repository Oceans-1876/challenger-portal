import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import backgroundImage from './francesco-ungaro-nlqqldluDBw-unsplash.jpg';
import overlayImage from './home_overlay.png';
import buttonImageAnalysis from './button_analysis.png';
import buttonImageAPI from './button_api.png';
import buttonImageExplore from './button_explore.png';
import logoBWSAMS from './logo_bw_sams.png';
import logoColorSAMS from './logo_color_sams.png';
import logoBWNHM from './logo_bw_nhm.png';
import logoColorNHM from './logo_color_nhm.png';
import logoBWUIUC from './logo_bw_uiuc.png';
import logoColorUIUC from './logo_color_uiuc.png';
import logoBWCarnegie from './logo_bw_carnegie.png';
import logoColorCarnegie from './logo_color_carnegie.png';
import logoBWPlymouth from './logo_bw_plymouth.png';
import logoColorPlymouth from './logo_color_plymouth.png';

const Home = (): JSX.Element => (
    <>
        <Box
            sx={{
                'backgroundImage': `url(${backgroundImage})`,
                'backgroundRepeat': 'no-repeat',
                'backgroundSize': 'contain',
                '@media (min-width: 1420px)': {
                    backgroundSize: 'cover'
                },
                'position': 'absolute',
                'width': '100vw',
                'height': 1893,
                'left': 0,
                'top': 0
            }}
        >
            <a
                style={{ display: 'none' }}
                href="https://unsplash.com/photos/nlqqldluDBw"
                target="_blank"
                rel="noreferrer"
            >
                Unsplash
            </a>
        </Box>
        <Box
            sx={(theme) => ({
                position: 'absolute',
                [theme.breakpoints.up('xl')]: {
                    top: 1250
                },
                [theme.breakpoints.up('lg')]: {
                    top: 970
                },
                [theme.breakpoints.up('md')]: {
                    top: 570
                },
                [theme.breakpoints.up('sm')]: {
                    top: 160
                },
                [theme.breakpoints.up('xs')]: {
                    top: -180
                },
                height: 3360,
                [theme.breakpoints.down('xl')]: {
                    height: 3640
                },
                [theme.breakpoints.down('lg')]: {
                    height: 4200
                },
                [theme.breakpoints.down('md')]: {
                    height: 4610
                },
                left: 0,
                width: '100vw',
                background: 'linear-gradient(180deg, rgba(3, 15, 32, 0) 0%, #030F20 17.2%)'
            })}
        />
        <Box
            sx={(theme) => ({
                backgroundImage: `url(${overlayImage})`,
                backgroundRepeat: 'repeat-y',
                backgroundSize: 'contain',
                width: '100vw',
                height: 2810,
                [theme.breakpoints.down('xl')]: {
                    height: 3160
                },
                [theme.breakpoints.down('lg')]: {
                    height: 3670
                },
                [theme.breakpoints.down('md')]: {
                    height: 3965
                },
                position: 'absolute',
                [theme.breakpoints.up('xl')]: {
                    top: 1800
                },
                [theme.breakpoints.up('lg')]: {
                    top: 1450
                },
                [theme.breakpoints.up('md')]: {
                    top: 1100
                },
                [theme.breakpoints.up('sm')]: {
                    top: 800
                },
                [theme.breakpoints.up('xs')]: {
                    top: 500
                },
                opacity: 0.1
            })}
        />

        <Typography
            sx={(theme) => ({
                position: 'absolute',
                top: 134,
                left: 35,
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: '10em',
                [theme.breakpoints.down('lg')]: {
                    top: 280,
                    fontSize: '7em'
                },
                [theme.breakpoints.down('md')]: {
                    top: 290,
                    fontSize: '5.5rem'
                },
                WebkitTextStroke: '1px #90FFF3',
                letterSpacing: -7.5,
                opacity: 0.95,
                color: 'rgba(255, 255, 255, 0)',
                clipPath: 'polygon(0 0, 110% 0, 110% 40%, 0 40%)'
            })}
            variant="h1"
        >
            CHALLENGER
        </Typography>
        <Typography
            sx={(theme) => ({
                position: 'absolute',
                top: 204,
                left: 35,
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: '10em',
                [theme.breakpoints.down('lg')]: {
                    top: 320,
                    fontSize: '7em'
                },
                [theme.breakpoints.down('md')]: {
                    top: 320,
                    fontSize: '5.5rem'
                },
                WebkitTextStroke: '3px #90FFF3',
                letterSpacing: -7.5,
                opacity: 0.95,
                color: 'rgba(255, 255, 255, 0)',
                clipPath: 'polygon(0 0, 110% 0, 110% 50%, 0 50%)'
            })}
            variant="h1"
        >
            CHALLENGER
        </Typography>
        <Typography
            sx={(theme) => ({
                position: 'absolute',
                top: 292,
                left: 35,
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: '10em',
                [theme.breakpoints.down('lg')]: {
                    top: 380,
                    fontSize: '7em'
                },
                [theme.breakpoints.down('md')]: {
                    top: 370,
                    fontSize: '5.5rem'
                },
                letterSpacing: -7.5,
                opacity: 0.95,
                color: '#FFFFE8',
                textShadow: '0px 4px 4px rgba(235, 255, 0, 0.25)'
            })}
            variant="h1"
        >
            CHALLENGER
        </Typography>
        <Typography
            sx={(theme) => ({
                position: 'absolute',
                top: 484,
                left: 55,
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '9em',
                [theme.breakpoints.down('lg')]: {
                    fontSize: '6em'
                },
                [theme.breakpoints.down('md')]: {
                    fontSize: '4.5rem'
                },
                letterSpacing: -7.5,
                opacity: 0.95,
                color: '#FFFFE8',
                textShadow: '0px 4px 4px rgba(235, 255, 0, 0.25)'
            })}
            variant="h1"
        >
            EXPEDITION
        </Typography>

        <Typography
            sx={{
                position: 'absolute',
                top: 680,
                left: 65,
                p: 1,
                maxWidth: 670,
                fontFamily: 'Cinzel Decorative',
                fontWeight: 400,
                fontSize: 40,
                textTransform: 'capitalize',
                color: '#D9FE6F',
                borderTop: '2px dashed #FFFFFF;'
            }}
            variant="h2"
        >
            The World&apos;s First Expedition of the Deep Sea
        </Typography>

        <Typography
            className="center-horizontal"
            sx={{
                display: 'flex',
                position: 'absolute',
                top: 1117,
                left: 412,
                width: 450,
                height: 116,
                fontFamily: 'sans-serif',
                fontWeight: 400,
                fontSize: 20,
                lineHeight: '143%',
                textAlign: 'right',
                letterSpacing: '0.03em',
                color: '#FFFFFF'
            }}
            variant="body1"
        >
            A four-year voyage (1872-1876)
            <br />
            70,000 miles travelled
            <br />
            364 stations visited
            <br />
            4,700 new species found
            <svg style={{ position: 'relative', right: -30, top: 10 }} width={75} height={119}>
                <path fill="none" stroke="#fff" strokeWidth="3" strokeDasharray={3} d="M 0,0 V 119 L 100,55" />
            </svg>
        </Typography>

        <Typography
            className="center-horizontal"
            sx={{
                position: 'absolute',
                top: 1507,
                left: 445,
                width: 592,
                height: 29,
                fontFamily: 'Cinzel Decorative',
                fontWeight: 700,
                fontSize: 20,
                textAlign: 'center',
                letterSpacing: 0.17,
                color: '#D9FE6F'
            }}
            variant="subtitle1"
        >
            Why is Challenger important today?
        </Typography>
        <Typography
            className="center-horizontal"
            sx={{
                position: 'absolute',
                top: 1552,
                left: 445,
                width: 635,
                height: 116,
                fontFamily: 'sans-serif',
                fontWeight: 400,
                fontSize: 20,
                textAlign: 'center',
                letterSpacing: 0.03,
                color: '#FFFFFF'
            }}
            variant="body1"
        >
            The expedition&apos;s 50 volumes of data provide a vital historical baseline for the pre-industrial ocean.
            Because of <i>Challenger&apos;s</i> legacy, we can track how much the oceans have changed over the last 150
            years.
        </Typography>

        <Typography
            className="center-horizontal"
            sx={{
                position: 'absolute',
                top: 1889,
                left: 445,
                width: 592,
                height: 29,
                fontFamily: 'Cinzel Decorative',
                fontWeight: 700,
                fontSize: 20,
                textAlign: 'center',
                letterSpacing: 0.17,
                color: '#D9FE6F'
            }}
            variant="subtitle1"
        >
            You can explore:
        </Typography>
        <Typography
            className="center-horizontal"
            sx={{
                position: 'absolute',
                top: 1934,
                left: 445,
                width: 592,
                height: 116,
                fontFamily: 'sans-serif',
                fontWeight: 400,
                fontSize: 20,
                textAlign: 'center',
                letterSpacing: 0.03,
                color: '#FFFFFF'
            }}
            variant="body1"
        >
            - What species Challenger found and where
            <br />- Historical ocean temperatures (1872-76)
        </Typography>

        <Box
            className="center-horizontal"
            sx={{
                position: 'absolute',
                top: 2258,
                left: 445,
                width: 592,
                height: 116,
                textAlign: 'center'
            }}
        >
            <Typography
                sx={{
                    fontFamily: 'sans-serif',
                    fontWeight: 400,
                    fontSize: 20,
                    letterSpacing: 0.03,
                    color: '#FFFFFF'
                }}
                variant="body1"
            >
                Start your own deep-sea journey
            </Typography>
            <svg style={{ position: 'relative', top: 10 }} width={55} height={119}>
                <path fill="none" stroke="#fff" strokeWidth="3" strokeDasharray={3} d="M 0,0 V 119 L 55,65" />
            </svg>
        </Box>

        <Box
            className="center-horizontal"
            sx={{
                position: 'absolute',
                width: '100%',
                top: 2545,
                display: 'flex'
            }}
        >
            <Box sx={{ width: '33%', textDecorationLine: 'none' }} component={Link} to="/explore">
                <img src={buttonImageExplore} alt="explore_button" width="100%" />
                <Typography
                    sx={(theme) => ({
                        position: 'relative',
                        top: '-35%',
                        left: '55%',
                        width: '40%',
                        fontFamily: 'Cinzel Decorative',
                        fontWeight: 700,
                        fontSize: '1.25em',
                        [theme.breakpoints.down('lg')]: {
                            fontSize: '1em'
                        },
                        [theme.breakpoints.down('md')]: {
                            fontSize: '0.9em'
                        },
                        color: '#D9FE6F',
                        letterSpacing: 0.17
                    })}
                    variant="subtitle1"
                >
                    Follow the Challenger’s voyage
                </Typography>
                <Typography
                    sx={(theme) => ({
                        position: 'relative',
                        top: '-20%',
                        left: '35%',
                        width: '60%',
                        height: 88,
                        fontFamily: 'sans-serif',
                        fontWeight: 400,
                        fontSize: '0.85em',
                        [theme.breakpoints.down('lg')]: {
                            fontSize: '0.8em'
                        },
                        [theme.breakpoints.down('md')]: {
                            fontSize: '0.75em'
                        },
                        letterSpacing: '0.03em',
                        color: '#F2FAE6'
                    })}
                    variant="body1"
                >
                    Click on the <i>Challenger</i> map, and zoom in on any of the 364 stations from Hawaii to Antarctica
                    for information on <i>Challenger&apos;s</i> amazing discoveries…
                </Typography>
            </Box>

            <Box sx={{ width: '33%', alignSelf: 'end', textDecorationLine: 'none' }}>
                <img src={buttonImageAnalysis} alt="analysis_button" width="100%" />
                <Typography
                    sx={(theme) => ({
                        position: 'relative',
                        mt: '-55%',
                        left: '10%',
                        width: '30%',
                        fontFamily: 'Cinzel Decorative',
                        fontWeight: 700,
                        fontSize: '1.25em',
                        [theme.breakpoints.down('lg')]: {
                            fontSize: '1em'
                        },
                        [theme.breakpoints.down('md')]: {
                            fontSize: '0.9em'
                        },
                        color: '#D9FE6F',
                        letterSpacing: 0.17
                    })}
                    variant="subtitle1"
                >
                    <Chip sx={{ backgroundColor: '#FFFF0033', color: '#fff' }} label="Up coming" />
                    <br />
                    Data Analysis
                </Typography>
            </Box>

            <Box
                sx={{ width: '33%', textDecorationLine: 'none' }}
                component="a"
                href={`${window.API_PATH}/docs`}
                target="_blank"
            >
                <img src={buttonImageAPI} alt="api_button" width="100%" />
                <Typography
                    sx={(theme) => ({
                        position: 'relative',
                        top: '-35%',
                        left: '55%',
                        width: '40%',
                        fontFamily: 'Cinzel Decorative',
                        fontWeight: 700,
                        fontSize: '1.25em',
                        [theme.breakpoints.down('lg')]: {
                            fontSize: '1em'
                        },
                        [theme.breakpoints.down('md')]: {
                            fontSize: '0.9em'
                        },
                        color: '#D9FE6F',
                        letterSpacing: 0.17
                    })}
                    variant="subtitle1"
                >
                    Data API
                </Typography>
                <Typography
                    sx={(theme) => ({
                        position: 'relative',
                        top: '-7%',
                        left: '15%',
                        width: '60%',
                        height: 88,
                        fontFamily: 'sans-serif',
                        fontWeight: 400,
                        fontSize: '0.85em',
                        [theme.breakpoints.down('lg')]: {
                            fontSize: '0.8em'
                        },
                        [theme.breakpoints.down('md')]: {
                            fontSize: '0.75em'
                        },
                        letterSpacing: '0.03em',
                        color: '#F2FAE6'
                    })}
                    variant="body1"
                >
                    The Application Programming Interface to access the raw data behind the <i>Challenger</i> Expedition
                    project
                </Typography>
            </Box>
        </Box>

        <Box
            sx={(theme) => ({
                position: 'absolute',
                top: 3550,
                [theme.breakpoints.up('lg')]: {
                    top: 3500
                },
                width: '100%',
                display: 'flex',
                alignItems: 'baseline',
                p: 12,
                background: 'rgba(36, 60, 89, 0.65)'
            })}
        >
            <Typography
                sx={{
                    fontFamily: 'Cinzel Decorative',
                    fontWeight: 400,
                    fontSize: 40,
                    textTransform: 'capitalize',
                    color: '#D9FE6F',
                    borderBottom: '2px dashed #FFFFFF;',
                    width: '40%',
                    textAlign: 'right'
                }}
                variant="h2"
            >
                Background
            </Typography>
            <Box sx={{ color: '#fff' }}>
                <Typography sx={{ pt: 2, pl: 5 }} variant="body1">
                    In December 1872, <i>HMS Challenger</i>, a small British warship converted into the world&apos;s
                    first floating laboratory left Portsmouth on a four-year voyage across the globe. Its pathbreaking
                    mission was to chart the ocean floor, measure ocean temperatures and chemistry, and collect marine
                    specimens from worldwide coastal shores, reefs, and the unexplored deep sea.
                </Typography>
                <Typography sx={{ pt: 2, pl: 5 }} variant="body1">
                    By the voyage&apos;s end, <i>Challenger</i> had wildly exceeded even these ambitious expectations.
                    Sailing nearly 70,000 miles, and recording data at over 360 individual stations, Challenger
                    identified the world&apos;s major ocean basins and currents as well as 4,700 new species of marine
                    creatures and plants.
                </Typography>
                <Typography sx={{ pt: 2, pl: 5 }} variant="body1">
                    The thousands of bottled specimens, deposited largely in the Natural History Museum in London, plus
                    fifty published volumes of <i>Challenger</i> data, inaugurated the modern fields of oceanography and
                    marine biology.
                </Typography>
                <Typography sx={{ pt: 2, pl: 5 }} variant="body1">
                    Here, for the first time, <i>Challenger&apos;s</i> vast trove of groundbreaking data is at
                    everyone&apos;s fingertips, with vital lessons for today&apos;s world. How have our oceans, and
                    their creatures, been transformed over the last 150 years? And how can we protect the wonderful
                    diversity of marine life into an uncertain future?
                </Typography>
            </Box>
        </Box>

        <Box
            sx={(theme) => ({
                position: 'absolute',
                top: 4000,
                [theme.breakpoints.down('lg')]: {
                    top: 4200
                },
                width: '100%',
                p: 8,
                mt: 5
            })}
        >
            <Typography
                sx={{
                    fontFamily: 'Cinzel Decorative',
                    fontWeight: 400,
                    fontSize: 40,
                    textTransform: 'capitalize',
                    color: '#D9FE6F',
                    borderBottom: '2px dashed #FFFFFF;',
                    width: '40%',
                    textAlign: 'right'
                }}
                variant="h2"
            >
                Sponsors
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 5 }}>
                <Button
                    sx={{
                        'borderColor': '#90FFF3',
                        'width': 200,
                        'height': 77,
                        'backgroundImage': `url(${logoBWSAMS})`,
                        'backgroundRepeat': 'no-repeat',
                        'backgroundPosition': 'center',
                        'transition': 'all 0.3s ease-in-out',
                        '&:hover': {
                            backgroundImage: `url(${logoColorSAMS})`,
                            backgroundColor: '#fff',
                            height: 150
                        }
                    }}
                    component="a"
                    href="https://www.sams.ac.uk/"
                    target="_blank"
                    variant="outlined"
                    size="large"
                />
                <Button
                    sx={{
                        'borderColor': '#90FFF3',
                        'width': 200,
                        'height': 77,
                        'backgroundImage': `url(${logoBWNHM})`,
                        'backgroundRepeat': 'no-repeat',
                        'backgroundPosition': 'center',
                        'transition': 'all 0.3s ease-in-out',
                        '&:hover': {
                            backgroundImage: `url(${logoColorNHM})`,
                            backgroundColor: '#fff',
                            height: 150
                        }
                    }}
                    component="a"
                    href="https://www.nhm.ac.uk/"
                    target="_blank"
                    variant="outlined"
                    size="large"
                />
                <Button
                    sx={{
                        'borderColor': '#90FFF3',
                        'width': 200,
                        'height': 77,
                        'backgroundImage': `url(${logoBWUIUC})`,
                        'backgroundRepeat': 'no-repeat',
                        'backgroundPosition': 'center',
                        'transition': 'all 0.3s ease-in-out',
                        '&:hover': {
                            backgroundImage: `url(${logoColorUIUC})`,
                            backgroundColor: '#fff',
                            height: 150
                        }
                    }}
                    component="a"
                    href="https://illinois.edu/"
                    target="_blank"
                    variant="outlined"
                    size="large"
                />
                <Button
                    sx={{
                        'borderColor': '#90FFF3',
                        'width': 200,
                        'height': 77,
                        'backgroundImage': `url(${logoBWCarnegie})`,
                        'backgroundRepeat': 'no-repeat',
                        'backgroundPosition': 'center',
                        'transition': 'all 0.3s ease-in-out',
                        '&:hover': {
                            backgroundImage: `url(${logoColorCarnegie})`,
                            backgroundColor: '#fff',
                            height: 150
                        }
                    }}
                    component="a"
                    href="https://www.carnegiefoundation.org/"
                    target="_blank"
                    variant="outlined"
                    size="large"
                />
                <Button
                    sx={{
                        'borderColor': '#90FFF3',
                        'width': 200,
                        'height': 77,
                        'backgroundImage': `url(${logoBWPlymouth})`,
                        'backgroundRepeat': 'no-repeat',
                        'backgroundPosition': 'center',
                        'transition': 'all 0.3s ease-in-out',
                        '&:hover': {
                            backgroundImage: `url(${logoColorPlymouth})`,
                            backgroundColor: '#fff',
                            height: 150
                        }
                    }}
                    component="a"
                    href="https://www.plymouth.ac.uk/"
                    target="_blank"
                    variant="outlined"
                    size="large"
                />
            </Box>
        </Box>

        <Box
            sx={(theme) => ({
                position: 'absolute',
                top: 4500,
                [theme.breakpoints.down('lg')]: {
                    top: 4660
                },
                height: 110,
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '100%',
                p: 2,
                background: 'rgba(36, 60, 89, 0.65)'
            })}
        >
            <Typography sx={{ color: '#90FFF3' }} component={Link} to="#" variant="subtitle1">
                Copyright
            </Typography>
            <Typography sx={{ color: '#90FFF3' }} component={Link} to="#" variant="subtitle1">
                License
            </Typography>
            <Typography sx={{ color: '#90FFF3' }} component={Link} to="#" variant="subtitle1">
                Contact: admin@illinois.edu
            </Typography>
            <Typography sx={{ color: '#90FFF3' }} component={Link} to="#" variant="subtitle1">
                API
            </Typography>
            <Typography sx={{ color: '#90FFF3' }} variant="subtitle1">
                Challenger Expedition
                <br />
                <i>HMS Challenger</i> journey
            </Typography>
        </Box>
    </>
);

export default Home;
