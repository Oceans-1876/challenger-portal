export const decimalFormat = (value: number, decimals = 2): string => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals
    });
    return formatter.format(value);
};

export const convertFarenheitToCelcius = (temp: number): string => {
    const formattedTemp = decimalFormat((temp - 32) * (5 / 9));
    return formattedTemp;
};
