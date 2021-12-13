import React from 'react';
import convert, { Temperature, Distance } from 'convert-units';

import { decimalFormat } from '../utils/format';

interface Props {
    from: Temperature | Distance;
    to: Temperature | Distance; // eslint-disable-line @typescript-eslint/no-explicit-any
    value: number;
    precision: number;
}

const RenderUnit = ({ from, to, value, precision }: Props) => {
    let new_value: number | string = value;
    if (from === 'fathom' || to === 'fathom') {
        // fathoms not present in unit converter.
        // Explict conversion to yards first, then to the requested unit
        // or convert to yards and then to fathoms for to === 'fathom'
        let type: Distance = 'yd' as Distance;
        new_value =
            from === 'fathom'
                ? convert(value * 2)
                      .from(type)
                      .to(to)
                : convert(value).from(from).to(type) / 2;
    } else {
        new_value = convert(value).from(from).to(to);
    }

    return <>{decimalFormat(new_value, precision)}</>;
};

export default RenderUnit;
