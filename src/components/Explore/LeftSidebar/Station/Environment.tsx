import React from 'react';

import { TemperatureUnits, LengthUnits } from 'convert-units';
import { DataStateContext } from '../../../../store/contexts';
import { decimalFormat } from '../../../../utils/format';
import convertUnit from '../../../../utils/convertUnits';
import { depthUnitMap, tempUnitMap } from '../../../UnitPreferencesDialog';
import Field from '../../../Field';
import { PublicOutlined, StraightenOutlined, ThermostatOutlined, WaterOutlined } from '@mui/icons-material';
import { Box } from '@mui/material';

interface Props {
    station: StationDetails | null;
}

const Environment = ({ station }: Props) => {
    const { tempToUnit, depthToUnit } = React.useContext(DataStateContext);
    const tempFromUnit = 'C'; // ? Should this be 'C'?
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
                        ? convertUnit(
                              tempFromUnit as TemperatureUnits,
                              tempToUnit as TemperatureUnits,
                              station.surface_temp_c,
                              3
                          ) + '\u00b0'
                        : '-',
                    [`Bottom Water (${tempToUnit === 'C' ? 'C' : 'F'})`]: station?.bottom_water_temp_c
                        ? convertUnit(
                              tempFromUnit as TemperatureUnits,
                              tempToUnit as TemperatureUnits,
                              station.bottom_water_temp_c,
                              3
                          ) + '\u00b0'
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
                    rows: Object.entries(station?.water_temp_c_at_depth_fathoms ?? {}).flatMap(([depth, temp]) =>
                        temp
                            ? {
                                  depth: convertUnit(
                                      depthFromUnit as LengthUnits,
                                      depthToUnit as LengthUnits,
                                      Number(depth),
                                      1
                                  ),
                                  temp: convertUnit(
                                      tempFromUnit as TemperatureUnits,
                                      tempToUnit as TemperatureUnits,
                                      temp,
                                      3
                                  )
                              }
                            : []
                    )
                }}
                IconComponent={WaterOutlined}
            />
        </Box>
    );
};

export default Environment;
