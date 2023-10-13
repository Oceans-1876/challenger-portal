import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import type { SxProps } from '@mui/system';
import { theme } from '../theme';
import { Stack } from '@mui/material';

interface Props {
    sx?: SxProps;
    panels: Array<{
        Panel: React.ReactNode;
        label: string;
    }>;
    initialPanel?: string;
}

const TabsGroup = ({ sx, panels, initialPanel }: Props) => {
    const [activeTab, setActiveTab] = React.useState<string>();

    React.useEffect(() => {
        if (initialPanel !== activeTab) {
            setActiveTab(initialPanel);
        }
    }, [initialPanel]);

    let activeTabIsInPanels = false;
    for (let i = 0; i < panels.length; i += 1) {
        const { label } = panels[i];
        if (label === activeTab) {
            activeTabIsInPanels = true;
            break;
        }
    }

    return (
        <Stack
            sx={{
                zIndex: 1,
                minHeight: 0, // to allow the box to shrink past its content height
                ...sx
            }}
        >
            <Tabs
                TabIndicatorProps={{ style: { background: theme.palette.explore.secondary } }}
                centered
                value={activeTabIsInPanels ? activeTab : false}
                onChange={(_e, newActiveTab) => setActiveTab(newActiveTab)}
            >
                {panels.map(({ label }) => (
                    <Tab
                        key={label}
                        value={label}
                        label={label}
                        sx={{
                            'fontSize': '14px',
                            'textTransform': 'none',
                            'color': theme.palette.explore.secondaryText,
                            '&.Mui-selected': {
                                color: theme.palette.explore.secondary
                            }
                        }}
                    />
                ))}
            </Tabs>

            {panels.map(({ Panel, label }) => {
                return (
                    <Box
                        sx={{
                            flex: 1,
                            overflow: 'scroll',
                            py: '32px'
                        }}
                        key={label}
                        hidden={activeTab !== label}
                    >
                        {Panel}
                    </Box>
                );
            })}
        </Stack>
    );
};

export default TabsGroup;
