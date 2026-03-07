import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface RadarData {
    label: string;
    leader: number;
    laggard: number;
}

export const RadarChart: React.FC<{ data: RadarData[]; delay: number }> = ({ data, delay }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const spr = spring({
        frame: frame - delay,
        fps,
        config: { damping: 15 },
    });

    const size = 600;
    const center = size / 2;
    const maxRadius = size * 0.4;
    const angleStep = (Math.PI * 2) / data.length;

    // Helper to calculate coordinates
    const getPoint = (radius: number, index: number) => {
        const angle = index * angleStep - Math.PI / 2;
        return {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle),
        };
    };

    // Generate the polygon points for leader and laggard
    const generatePoints = (key: 'leader' | 'laggard') => {
        return data
            .map((item, i) => {
                const val = item[key];
                // Normalize 1.0 - 1.6 to 0.4 - 1.0 of maxRadius
                const normalizedRadius = ((val - 0.8) / 0.8) * maxRadius;
                const currentRadius = interpolate(spr, [0, 1], [0, normalizedRadius]);
                const pt = getPoint(currentRadius, i);
                return `${pt.x},${pt.y}`;
            })
            .join(' ');
    };

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size}>
                {/* Background grid */}
                {[0.2, 0.4, 0.6, 0.8, 1].map((r) => (
                    <polygon
                        key={r}
                        points={data.map((_, i) => {
                            const pt = getPoint(maxRadius * r, i);
                            return `${pt.x},${pt.y}`;
                        }).join(' ')}
                        fill="transparent"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="1"
                    />
                ))}

                {/* Axes */}
                {data.map((item, i) => {
                    const pt = getPoint(maxRadius, i);
                    return (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={pt.x}
                            y2={pt.y}
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Laggard Area */}
                <polygon
                    points={generatePoints('laggard')}
                    fill="rgba(107, 114, 128, 0.3)"
                    stroke="#6B7280"
                    strokeWidth="2"
                    opacity={spr}
                />

                {/* Leader Area */}
                <polygon
                    points={generatePoints('leader')}
                    fill="rgba(53, 242, 166, 0.2)"
                    stroke="#35F2A6"
                    strokeWidth="3"
                    opacity={spr}
                    style={{ filter: 'drop-shadow(0 0 10px rgba(53, 242, 166, 0.5))' }}
                />

                {/* Axis Labels */}
                {data.map((item, i) => {
                    const pt = getPoint(maxRadius + 40, i);
                    return (
                        <text
                            key={i}
                            x={pt.x}
                            y={pt.y}
                            fill="white"
                            fontSize="14"
                            fontWeight="700"
                            textAnchor="middle"
                            fontFamily="Inter, sans-serif"
                            style={{ opacity: spr }}
                        >
                            {item.label}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};
