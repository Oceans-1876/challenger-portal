import maplibre from 'maplibre-gl';

export const fixLineMeridianCrossing = (coordinates: LineCoordinates): LineCoordinates => {
    // TODO fix this
    for (let i = 0; i < coordinates.length; i += 1) {
        const currentLng = coordinates[i][0];
        const previousLng = coordinates[i === 0 ? coordinates.length - 1 : i - 1][0];
        if (currentLng - previousLng > 180) {
            coordinates[i][0] -= 360;
        } else if (currentLng - previousLng < -180) {
            coordinates[i][0] += 360;
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

export const pulsingDot = (map: maplibre.Map, size: number): void => {
    /** Create a pulsing dot that can be used by symbol styles.
     * Set `icon-image` to ``pulsing-dot` under the `layout` attribute of the style.
     * @param {maplibre.Map} map - The map to add the pulsing dot to.
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
                context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
                context.fill();

                // Draw the inner circle.
                context.beginPath();
                context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
                context.fillStyle = 'rgba(255, 100, 100, 0.7)';
                context.strokeStyle = 'white';
                context.lineWidth = 2 + 4 * (1 - t);
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
