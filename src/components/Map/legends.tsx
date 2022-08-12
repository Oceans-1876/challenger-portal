import React from 'react';

export const getLegendFromStyle = (style: Partial<maplibregl.LayerSpecification>) => {
    switch (style.type) {
        case 'fill':
            return (
                <svg width={20} height={20}>
                    <rect
                        width="100%"
                        height="100%"
                        fill={style.paint?.['fill-color']?.toString() || '#fff'}
                        opacity={parseFloat(style.paint?.['fill-opacity']?.toString() || '0')}
                    />
                </svg>
            );
        default:
            console.warn('Unsupported style type:', style.type);
            return null;
    }
};
