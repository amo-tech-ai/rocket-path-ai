import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const DividerLine: React.FC<{ delay: number }> = ({ delay }) => {
    const frame = useCurrentFrame();

    const width = interpolate(frame, [delay, delay + 30], [0, 100], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    return (
        <div
            style={{
                width: `${width}%`,
                height: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                opacity,
                marginTop: 60,
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
            }}
        />
    );
};
