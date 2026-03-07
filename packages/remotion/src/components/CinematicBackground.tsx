import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

export const CinematicBackground: React.FC<{
    src: string;
    opacity: number;
    scale: number;
    rotateY: number;
    translateY: number;
}> = ({ src, opacity, scale, rotateY, translateY }) => {
    // The dark gradient overlay
    const linearGradient = 'linear-gradient(to bottom, #070A10 0%, #0B1630 100%)';

    // The soft radial vignette overlay
    const radialVignette =
        'radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.55) 100%)';

    return (
        <AbsoluteFill style={{ background: linearGradient }}>
            {/* Base Globe Layer */}
            <AbsoluteFill
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Img
                    src={staticFile(src)}
                    style={{
                        opacity: opacity,
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        transform: `scale(${scale}) rotateY(${rotateY}deg) translateY(${translateY}px)`,
                        transformOrigin: 'center center',
                    }}
                />
            </AbsoluteFill>

            {/* Vignette Layer */}
            <AbsoluteFill style={{ background: radialVignette }} />
        </AbsoluteFill>
    );
};
