import React from 'react';

import { TemperatureUnits, LengthUnits } from 'convert-units';
import { DataStateContext } from '@app/store/contexts';
import { decimalFormat } from '@app/utils/format';
import convertUnit from '@app/utils/convertUnits';
import { depthUnitMap, tempUnitMap } from '@app/components/UnitPreferencesDialog';
import Field from '@app/components/Field';
import { PublicOutlined, StraightenOutlined, ThermostatOutlined, WaterOutlined } from '@mui/icons-material';
import { Box } from '@mui/material';

interface Props {
    station: StationDetails | null;
}

const Environment = ({ station }: Props) => {
    const { tempToUnit, depthToUnit } = React.useContext(DataStateContext);
    const tempFromUnit = 'C';
    const tempDepthFromUnit = 'F';
    const depthFromUnit = 'fathom';

    return (
        <Box
            sx={{
                'height': '100%',
                'overflowY': 'scroll',
                '&::-webkit-scrollbar': {
                    display: 'none' // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge, etc.)
                },
                '&-ms-overflow-style:': {
                    display: 'none' // Hide the scrollbar for IE
                }
            }}
        >
            <Field
                title="Temperature"
                properties={{
                    [`Surface (${tempToUnit === 'C' ? 'C' : 'F'})`]: station?.surface_temp_c
                        ? `${convertUnit(
                              tempFromUnit as TemperatureUnits,
                              tempToUnit as TemperatureUnits,
                              station.surface_temp_c,
                              3
                          )}\u00b0`
                        : '-',
                    [`Bottom Water (${tempToUnit === 'C' ? 'C' : 'F'})`]: station?.bottom_water_temp_c
                        ? `${convertUnit(
                              tempFromUnit as TemperatureUnits,
                              tempToUnit as TemperatureUnits,
                              station.bottom_water_temp_c,
                              3
                          )}\u00b0`
                        : '-'
                }}
                IconComponent={ThermostatOutlined}
            />
            <Field
                title="Depth"
                content={
                    station?.depth_fathoms
                        ? `${convertUnit(
                              depthFromUnit as LengthUnits,
                              depthToUnit as LengthUnits,
                              station.depth_fathoms,
                              1
                          )} ${depthUnitMap[depthToUnit]}`
                        : '-'
                }
                IconComponent={StraightenOutlined}
            />

            <Field
                title="Specific Gravity"
                properties={{
                    Surface: station?.specific_gravity_at_surface
                        ? decimalFormat(station.specific_gravity_at_surface, 3)
                        : '-',
                    Bottom: station?.specific_gravity_at_bottom
                        ? decimalFormat(station.specific_gravity_at_bottom, 3)
                        : '-'
                }}
                IconComponent={PublicOutlined}
            />

            <Field
                title="Water Temperature at Depths"
                table={{
                    columns: [
                        {
                            label: `Depth (${depthUnitMap[depthToUnit]})`,
                            key: 'depth'
                        },
                        {
                            label: `Temperature (${tempUnitMap[tempToUnit]})`,
                            key: 'temp'
                        }
                    ],
                    rows: Object.entries(station?.water_temp_c_at_depth_fathoms ?? {}).flatMap(([_depth, _temp]) => {
                        if (!_temp) return [];
                        const depth = convertUnit(
                            depthFromUnit as LengthUnits,
                            depthToUnit as LengthUnits,
                            Number(_depth),
                            1
                        );
                        const temp = convertUnit(
                            tempDepthFromUnit as TemperatureUnits,
                            tempToUnit as TemperatureUnits,
                            _temp,
                            3
                        );
                        return {
                            key: depth + temp,
                            depth,
                            temp
                        };
                    })
                }}
                IconComponent={WaterOutlined}
            />
        </Box>
    );
};

export default Environment;
