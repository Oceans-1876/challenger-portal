declare const ENV: 'development' | 'production' | 'test';
declare const PUBLIC_PATH: string;
declare const API_PATH: string;
declare const MAPBOX_TOKEN: string;

declare module '*.json' {
    const src: string;
    export default src;
}

declare module '*.geojson' {
    const src: string;
    export default src;
}

declare module '*.bmp' {
    const src: string;
    export default src;
}

declare module '*.gif' {
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const src: string;
    export default src;
}

declare module '*.jpeg' {
    const src: string;
    export default src;
}

declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

    const src: string;
    export default src;
}

declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.module.scss' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

interface StationProperties {
    station_id: number;
    station: string;
    name: string;
    species: string;
    date: string;
    air_temperature_noon: number;
    air_temperature_daily_mean: number;
    water_temperature_bottom: number;
    water_temperature_surface: number;
    water_density_bottom_60f: number;
    water_density_surface_60f: number;
}
