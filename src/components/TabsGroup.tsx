import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import type { SxProps } from '@mui/system';

interface Props {
    sx?: SxProps;
    panels: Array<{
        Panel: React.ComponentType;
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
        <Box
            sx={{
                zIndex: 1,
                height: '80%',
                ...sx
            }}
        >
            <Tabs
                centered
                value={activeTabIsInPanels ? activeTab : false}
                onChange={(_e, newActiveTab) => setActiveTab(newActiveTab)}
            >
                {panels.map(({ label }) => (
                    <Tab key={label} value={label} label={label} />
                ))}
            </Tabs>

            {panels.map(({ Panel, label }) => {
                return (
                    <Box key={label} sx={{ p: 2, height: '90%', overflowY: 'auto' }} hidden={activeTab !== label}>
                        <Panel />
                    </Box>
                );
            })}
        </Box>
    );
};

export default TabsGroup;
