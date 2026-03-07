import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface StatCardProps {
    value: string;
    label: string;
    progress: number;
    delay: number;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, progress, delay }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entry = spring({
        frame: frame - delay,
        fps,
        config: {
            damping: 20,
        },
    });

    const translateY = interpolate(entry, [0, 1], [40, 0]);
    const opacity = interpolate(entry, [0, 1], [0, 1]);

    // Progress ring animation
    const progressSpring = spring({
        frame: frame - delay - 10,
        fps,
        config: {
            damping: 15,
        },
    });

    const currentProgress = interpolate(progressSpring, [0, 1], [0, progress]);

    // SVG Ring Parameters
    const size = 260;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity,
                transform: `translateY(${translateY}px)`,
                width: '100%',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: size,
                    height: size,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 40,
                    borderRadius: '50%',
                    boxShadow: '0 0 40px rgba(46, 196, 255, 0.1)',
                }}
            >
                {/* Background Ring */}
                <svg
                    width={size}
                    height={size}
                    style={{
                        position: 'absolute',
                        transform: 'rotate(-90deg)',
                    }}
                >
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="rgba(107, 114, 128, 0.1)"
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress Ring */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="#2EC4FF"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - Math.min(currentProgress, 1))}
                        strokeLinecap="round"
                        style={{
                            filter: 'drop-shadow(0 0 8px rgba(46, 196, 255, 0.6))',
                        }}
                    />
                    {/* Overflow rings for 3.7x */}
                    {progress > 1 && currentProgress > 1 && (
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius - strokeWidth - 4}
                            fill="transparent"
                            stroke="#35F2A6"
                            strokeWidth={strokeWidth - 2}
                            strokeDasharray={2 * Math.PI * (radius - strokeWidth - 4)}
                            strokeDashoffset={2 * Math.PI * (radius - strokeWidth - 4) * (1 - Math.min(currentProgress - 1, 1))}
                            strokeLinecap="round"
                            style={{
                                filter: 'drop-shadow(0 0 5px rgba(53, 242, 166, 0.5))',
                            }}
                        />
                    )}
                    {progress > 2 && currentProgress > 2 && (
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius - (strokeWidth + 4) * 2}
                            fill="transparent"
                            stroke="#2EC4FF"
                            strokeWidth={strokeWidth - 4}
                            strokeDasharray={2 * Math.PI * (radius - (strokeWidth + 4) * 2)}
                            strokeDashoffset={2 * Math.PI * (radius - (strokeWidth + 4) * 2) * (1 - Math.min(currentProgress - 2, 1))}
                            strokeLinecap="round"
                        />
                    )}
                </svg>

                <div
                    style={{
                        color: '#fff',
                        fontSize: 64,
                        fontWeight: 800,
                        fontFamily: 'Inter, sans-serif',
                        textShadow: '0 0 20px rgba(46, 196, 255, 0.4)',
                        letterSpacing: '-2px',
                    }}
                >
                    {value}
                </div>
            </div>

            <div
                style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: 24,
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    textAlign: 'center',
                    maxWidth: 240,
                    lineHeight: 1.4,
                }}
            >
                {label}
            </div>
        </div>
    );
};
