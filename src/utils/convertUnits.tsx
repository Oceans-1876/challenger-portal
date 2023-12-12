import configureMeasurements, {
    temperature,
    TemperatureSystems,
    TemperatureUnits,
    length,
    LengthSystems,
    LengthUnits
} from 'convert-units';

import { decimalFormat } from './format';

// Measures: The names of the measures being used
type Measures = 'length' | 'temperature';
// Systems: The systems being used across all measures
type Systems = LengthSystems | TemperatureSystems;
// Units: The units across all measures and their systems
type Units = LengthUnits | TemperatureUnits;

const convert = configureMeasurements<Measures, Systems, Units>({
    length,
    temperature
});

const convertUnit = (from: Units, to: Units, value: number, precision: number): string => {
    const new_value: number = convert(value).from(from).to(to);
    return decimalFormat(new_value, precision);
};

export default convertUnit;
