import React from 'react';
import Box from '@mui/material/Box';
import Tabs, { TabsOwnProps } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import type { SxProps } from '@mui/system';
import { theme } from '@app/theme';
import { Stack } from '@mui/material';

interface Props {
    sx?: SxProps;
    TabIndicatorProps: TabsOwnProps['TabIndicatorProps'];
    panels: Array<{
        Panel: React.ReactNode;
        label: string;
    }>;
    initialPanel?: string;
}

const TabsGroup = ({ sx, TabIndicatorProps, panels, initialPanel }: Props) => {
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
        <Stack sx={{ zIndex: 1, ...sx }}>
            <Tabs
                TabIndicatorProps={TabIndicatorProps}
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

            <Box
                sx={{
                    flex: 1,
                    py: '32px',
                    position: 'relative'
                }}
            >
                {panels.map(({ Panel, label }) => {
                    return (
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                opacity: activeTab === label ? 1 : 0,
                                zIndex: activeTab === label ? 1 : 0
                            }}
                            key={label}
                        >
                            {Panel}
                        </Box>
                    );
                })}
            </Box>
        </Stack>
    );
};

export default TabsGroup;
