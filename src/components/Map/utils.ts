import maplibre from 'maplibre-gl';
import * as turf from '@turf/turf';

export function normalizeFaoAreaGeometry(geometry: turf.Polygon | turf.MultiPolygon): turf.Polygon | turf.MultiPolygon {
    if (geometry.type == 'Polygon') return geometry;
    return {
        type: 'MultiPolygon',
        coordinates: geometry.coordinates.map((polyCoords) =>
            polyCoords.map((lineCoords) => {
                // When the region straddles the 180th meridian, we need to swap subregions on different sides of the meridian
                const minLng = Math.min(...lineCoords.map(([lng]) => lng));
                return minLng == -180 ? lineCoords.map(([lng, lat]) => [lng + 360, lat]) : lineCoords;
            })
        )
    };
}

export const createJourneyPathFromStationPoints = (coordinates: LineCoordinates): LineCoordinates => {
    for (let i = 0; i < coordinates.length; i += 1) {
        const currentLng = coordinates[i][0];
        if (i !== coordinates.length - 1) {
            const nextLng = coordinates[i + 1][0];
            if (currentLng - nextLng > 180) {
                coordinates[i + 1][0] += 360;
            }
        }
    }
    return coordinates;
};

export const getFeatureBounds = (coordinates: LineCoordinates) => {
    const start = coordinates[0];

    // Create a 'LngLatBounds' with both corners at the first coordinate.
    const bounds = new maplibre.LngLatBounds(start, start);

    // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
    coordinates.forEach((coordinate) => {
        bounds.extend(coordinate);
    });

    return bounds;
};

export const pulsingDot = (map: maplibregl.Map, size: number): void => {
    /** Create a pulsing dot that can be used by symbol styles.
     * Set `icon-image` to ``pulsing-dot` under the `layout` attribute of the style.
     * @param {maplibregl.Map} map - The map to add the pulsing dot to.
     * @param {number} size - The size of the dot in pixels.
     */
    const dot: StyleImage = {
        context: null,
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // When the layer is added to the map,
        // get the rendering context for the map canvas.
        onAdd() {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d');
        },

        // Call once before every frame where the icon will be used.
        render() {
            const duration = 1000;
            const t = (performance.now() % duration) / duration;

            const radius = (size / 2) * 0.3;
            const outerRadius = (size / 2) * 0.7 * t + radius;
            const context = this.context;

            if (context) {
                // Draw the outer circle.
                context.clearRect(0, 0, this.width, this.height);
                context.beginPath();
                context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
                context.fillStyle = `rgba(255, 255, 0, ${1 - t})`;
                context.strokeStyle = 'rgb(255, 255, 0)';
                context.fill();
                context.stroke();

                // Update this image's data with data from the canvas.
                this.data = context.getImageData(0, 0, this.width, this.height).data;

                // Continuously repaint the map, resulting
                // in the smooth animation of the dot.
                map.triggerRepaint();

                // Return `true` to let the map know that the image was updated.
                return true;
            }
            return false;
        }
    };
    map.addImage('pulsing-dot', dot, { pixelRatio: 2 });
};

/**
 * See discussions here: https://github.com/mapbox/mapbox-gl-js/issues/6707
 */
export function runWhenReady(map: maplibregl.Map, fn: () => void) {
    if (map.loaded()) {
        fn();
    } else {
        map.once('render', fn);
    }
}

/**
 * MapLibre GL JS v3 has removed `mapbox-gl-supported` from their API.
 * This function is copied from: https://maplibre.org/maplibre-gl-js/docs/examples/check-for-support/
 *
 * Caveat: This function creates a new WebGL context which won't be destroyed until garbage collection.
 * Calling this function repeatedly will likely cause the "too many active WebGL contexts" error.
 */
function detectWebglSupport() {
    if (window.WebGLRenderingContext) {
        const canvas = document.createElement('canvas');
        try {
            // Note that { failIfMajorPerformanceCaveat: true } can be passed as a second argument
            // to canvas.getContext(), causing the check to fail if hardware rendering is not available. See
            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
            // for more details.
            const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
            if (context && typeof context.getParameter === 'function') {
                return true;
            }
        } catch (e) {
            // WebGL is supported, but disabled
        }
        return false;
    }
    // WebGL not supported
    return false;
}

export const IS_WEBGL_SUPPORTED = detectWebglSupport();
