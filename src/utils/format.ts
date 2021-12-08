export const decimalFormat = (value: number, decimals = 2): string => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals
    });
    return formatter.format(value);
};

export const convertFahrenheitToCelcius = (temp: number): string => {
    const formattedCelciusTemp = decimalFormat((temp - 32) * (5 / 9));
    return formattedCelciusTemp;
};

export const convertCelciusToFahrenheit = (temp: number): string => {
    const formattedFahrenheitTemp = decimalFormat(temp * (9 / 5) + 32);
    return formattedFahrenheitTemp;
};

export const convertDepthFathomsTo = (depth: number, to: string): string => {
    let multiplier = 1;
    switch (to) {
        case 'km':
            multiplier = 0.0018288;
            break;
        case 'm':
            multiplier = 1.8288;
            break;
        case 'cm':
            multiplier = 182.88;
            break;
        case 'mi':
            multiplier = 0.00113636;
            break;
        case 'y':
            multiplier = 2;
            break;
        case 'f':
            multiplier = 6;
            break;
        case 'in':
            multiplier = 72;
            break;
        default:
            multiplier = 1;
    }
    const formattedDepthMeters = decimalFormat(depth * multiplier, 3);
    return formattedDepthMeters;
};
