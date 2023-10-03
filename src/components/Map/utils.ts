import maplibre, { StyleImageInterface } from 'maplibre-gl';
import * as turf from '@turf/turf';

export function normalizeFaoAreaGeometry(geometry: turf.Polygon | turf.MultiPolygon): turf.Polygon | turf.MultiPolygon {
    if (geometry.type === 'Polygon') return geometry;
    return {
        type: 'MultiPolygon',
        coordinates: geometry.coordinates.map((polyCoords) => {
            return polyCoords.map((lineCoords) => {
                // When the region straddles the 180th meridian, we need to swap subregions on different sides of the meridian
                const minLng = Math.min(...lineCoords.map(([lng]) => lng));
                return minLng === -180 ? lineCoords.map(([lng, lat]) => [lng + 360, lat]) : lineCoords;
            });
        })
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

export const loadStaionIcons = (map: maplibregl.Map): void => {
    const outerRadius = 22 * devicePixelRatio;
    const innerRadius = 18 * devicePixelRatio;
    const fontSize = 8 * devicePixelRatio;
    const tipSize = 5 * devicePixelRatio;
    const haloWidth = outerRadius;
    const width = 2 * outerRadius + 2 * haloWidth;
    const height = 2 * outerRadius + haloWidth + Math.max(haloWidth, tipSize);
    const centerX = haloWidth + outerRadius;
    const centerY = haloWidth + outerRadius;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return;

    const drawIcon = () => {
        context.beginPath();
        context.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
        context.fillStyle = '#FFFF00';
        context.fill();

        context.beginPath();
        context.moveTo(centerX, centerY + outerRadius + tipSize);
        context.lineTo(centerX - 2 * tipSize, centerY + outerRadius - tipSize);
        context.lineTo(centerX + 2 * tipSize, centerY + outerRadius - tipSize);
        context.closePath();
        context.fillStyle = '#FFFF00';
        context.fill();

        context.beginPath();
        context.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
        context.fillStyle = '#FFFFE8';
        context.fill();

        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = `500 ${fontSize}px sans-serif`;
        context.fillStyle = 'rgba(29, 51, 70, 0.75)';
        context.fillText('Station', centerX, centerY + 0.5 * innerRadius);
    };

    drawIcon();
    const data = context.getImageData(0, 0, width, height).data;

    const stationIcon: StyleImageInterface = {
        width,
        height,
        data
    };

    const pulsingIcon: StyleImageInterface = {
        width,
        height,
        data,
        render() {
            const duration = 1000;
            const t = (performance.now() % duration) / duration;
            const pulseRadius = outerRadius * (0.5 + 1.5 * t);

            context.clearRect(0, 0, width, height);

            // Draw the halo
            context.beginPath();
            context.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
            context.fillStyle = `rgba(255, 255, 0, ${1 - t})`;
            context.strokeStyle = '#FFFF00';
            context.fill();
            context.stroke();

            // Update this image's data with data from the canvas.
            this.data = context.getImageData(0, 0, this.width, this.height).data;

            // Continuously repaint the map, resulting in the smooth animation of the dot.
            map.triggerRepaint();

            // Return `true` to let the map know that the image was updated.
            return true;
        }
    };

    map.addImage('station-icon', stationIcon, { pixelRatio: devicePixelRatio });
    map.addImage('pulsing-icon', pulsingIcon, { pixelRatio: devicePixelRatio });
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
