export const formatLongitude = (lng: number) => {
    const wrappedLng = ((((lng + 180) % 360) + 360) % 360) - 180;
    const hemisphere = wrappedLng > 0 ? 'E' : 'W';
    const degrees = Math.floor(Math.abs(wrappedLng));
    const minutes = String(Math.round((Math.abs(wrappedLng) % 1) * 60)).padStart(2, '0');
    return `${degrees}° ${minutes}' ${hemisphere}`;
};

export const formatLatitude = (lat: number) => {
    const hemisphere = lat > 0 ? 'N' : 'S';
    const degrees = Math.floor(Math.abs(lat));
    const minutes = String(Math.round((Math.abs(lat) % 1) * 60)).padStart(2, '0');
    return `${degrees}° ${minutes}' ${hemisphere}`;
};

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
