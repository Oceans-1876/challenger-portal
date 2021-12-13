import React from 'react';
import { convertFahrenheitToCelcius, convertDepthFathomsTo } from '../utils/format';

interface Props {
    targetUnit: string; // eslint-disable-line @typescript-eslint/no-explicit-any
    value: number;
}

const RenderUnit = ({ targetUnit, value }: Props) => {
    let new_value: number | string = value;
    switch (targetUnit) {
        case 'celcius':
            new_value = convertFahrenheitToCelcius(value);
            break;
        case 'kilometers':
            new_value = convertDepthFathomsTo(value, 'km');
            break;
        case 'meters':
            new_value = convertDepthFathomsTo(value, 'm');
            break;
        case 'centimeters':
            new_value = convertDepthFathomsTo(value, 'cm');
            break;
        case 'miles':
            new_value = convertDepthFathomsTo(value, 'mi');
            break;
        case 'yards':
            new_value = convertDepthFathomsTo(value, 'y');
            break;
        case 'feets':
            new_value = convertDepthFathomsTo(value, 'f');
            break;
        case 'inches':
            new_value = convertDepthFathomsTo(value, 'in');
            break;
        default:
            new_value = value;
    }

    return <>{new_value}</>;
};

export default RenderUnit;
