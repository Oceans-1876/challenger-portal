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
