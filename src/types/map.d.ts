type PointCoordinates = [number, number];

type LineCoordinates = PointCoordinates[];

interface StyleImage {
    context: CanvasRenderingContext2D | null;
    width: number;
    height: number;
    data: Uint8Array | Uint8ClampedArray;
    render?: () => boolean;
    onAdd?: (map: Map, id: string) => void;
    onRemove?: () => void;
}

interface LayersControlProps {
    id: string;
    label: string;
    initialOpacity: number;
    attribution?: {
        text: string;
        url?: string;
    };
    style: Partial<import('maplibre-gl').AnyLayer>;
}
