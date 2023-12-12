export const INITIAL_BASEMAP = 'World_Imagery';

interface BasemapControlOption {
    id: string;
    tiles: string[];
    sourceExtraParams?: Partial<maplibregl.RasterSourceSpecification>;
    layerExtraParams?: Partial<maplibregl.RasterLayerSpecification>;
}

export const BASEMAPS: Array<BasemapControlOption> = [
    {
        id: 'World_Ocean_Base',
        tiles: [
            'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}'
        ],
        sourceExtraParams: {
            tileSize: 256,
            attribution:
                '&#169; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.'
        }
    },
    {
        id: 'World_Imagery',
        tiles: ['https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        sourceExtraParams: {
            tileSize: 256,
            attribution: 'Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        }
    },
    {
        id: 'Carto',
        tiles: [
            'https://a.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
            'https://b.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
            'https://c.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
            'https://d.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png'
        ],
        sourceExtraParams: {
            tileSize: 256,
            attribution: '&#169; <a href="https://www.carto.com">Carto</a>'
        }
    }
];
