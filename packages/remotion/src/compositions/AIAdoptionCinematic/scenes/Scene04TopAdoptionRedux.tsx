import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';

const DATASET = [
    { label: 'Technology & SaaS', value: 88, brightness: 1 },
    { label: 'Financial Services', value: 75, brightness: 0.8 },
    { label: 'Healthcare', value: 55, brightness: 0.7 },
    { label: 'Retail & E-commerce', value: 50, brightness: 0.6 },
    { label: 'Professional Services', value: 45, brightness: 0.5 },
];

const GlassBar: React.FC<{
    label: string;
    value: number;
    delay: number;
    brightness: number;
}> = ({ label, value, delay, brightness }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Spring with overshoot
    const growSpr = spring({
        frame: frame - delay,
        fps,
        config: {
            damping: 12,
            mass: 0.8,
            stiffness: 100,
        },
    });

    const width = interpolate(growSpr, [0, 1], [0, value]);

    // Counter animation
    const counter = Math.floor(interpolate(growSpr, [0, 1], [0, value]));

    // Breathing glow effect after settle
    const breathe = Math.sin((frame - delay - 60) / 20) * 0.2 + 0.8;
    const isSettled = frame > delay + 60;
    const finalGlow = isSettled ? breathe : 1;

    return (
        <div
            style={{
                width: '100%',
                marginBottom: '32px',
                display: 'flex',
                flexDirection: 'column',
                opacity: interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: 'clamp' }),
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: '12px',
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                <span
                    style={{
                        fontSize: '22px',
                        fontWeight: 500,
                        color: 'rgba(255, 255, 255, 0.85)',
                    }}
                >
                    {label}
                </span>
                <span
                    style={{
                        fontSize: '32px',
                        fontWeight: 800,
                        color: `rgba(46, 196, 255, ${0.7 + 0.3 * brightness})`,
                        textShadow: `0 0 ${20 * brightness}px rgba(46, 196, 255, 0.4)`,
                    }}
                >
                    {counter}%
                </span>
            </div>

            <div
                style={{
                    height: '24px',
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    position: 'relative',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
            >
                {/* The Bar Fill */}
                <div
                    style={{
                        height: '100%',
                        width: `${width}%`,
                        background: 'linear-gradient(90deg, #1A9FFF 0%, #2EC4FF 100%)',
                        borderRadius: '12px',
                        position: 'relative',
                        boxShadow: `0 0 ${30 * brightness * finalGlow}px rgba(46, 196, 255, ${0.3 * brightness})`,
                    }}
                >
                    {/* Inner Glow/Highlight */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '2px',
                            left: '2px',
                            right: '2px',
                            height: '40%',
                            background: 'rgba(255,255,255,0.15)',
                            borderRadius: '6px',
                        }}
                    />

                    {/* Tip Pulse/Glow */}
                    {growSpr > 0.1 && (
                        <div
                            style={{
                                position: 'absolute',
                                right: '-8px',
                                top: '-8px',
                                width: '40px',
                                height: '40px',
                                background: `radial-gradient(circle, #2EC4FF 0%, transparent 70%)`,
                                opacity: 0.6 * finalGlow * brightness,
                                filter: 'blur(4px)',
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export const Scene04TopAdoptionRedux: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height, durationInFrames } = useVideoConfig();

    // Header Animations
    const headSpr = spring({
        frame,
        fps,
        config: { damping: 20 },
    });
    const lineGrow = interpolate(frame, [20, 50], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // Background Sweeps and Textures
    const sweepPos = interpolate(frame % 120, [0, 120], [-width, width * 2]);
    const finalHoldScale = interpolate(frame, [200, 300], [1, 1.03], { extrapolateLeft: 'clamp' });
    const globalGlow = interpolate(frame, [200, 300], [0, 0.2], { extrapolateLeft: 'clamp' });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: '#050B18',
                overflow: 'hidden',
                transform: `scale(${finalHoldScale})`,
            }}
        >
            {/* Grid Texture */}
            <AbsoluteFill style={{ opacity: 0.1 }}>
                <svg width="100%" height="100%">
                    <defs>
                        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </AbsoluteFill>

            {/* Oversized Background AI Typography */}
            <AbsoluteFill
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                }}
            >
                <span
                    style={{
                        fontSize: '800px',
                        fontWeight: 900,
                        color: '#fff',
                        opacity: 0.03,
                        filter: 'blur(20px)',
                        letterSpacing: '-40px',
                    }}
                >
                    AI
                </span>
            </AbsoluteFill>

            {/* Vertical Light Sweep */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: sweepPos,
                    width: '300px',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(46, 196, 255, 0.05), transparent)',
                    transform: 'skewX(-20deg)',
                }}
            />

            {/* Central Radial Light depth */}
            <div
                style={{
                    position: 'absolute',
                    left: '10%',
                    top: '20%',
                    width: '80%',
                    height: '70%',
                    background: 'radial-gradient(circle, rgba(26, 159, 255, 0.05) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />

            {/* Main Content */}
            <AbsoluteFill style={{ padding: '80px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Header */}
                <div
                    style={{
                        textAlign: 'center',
                        opacity: headSpr,
                        transform: `translateY(${interpolate(headSpr, [0, 1], [20, 0])}px)`,
                        marginBottom: '80px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '16px',
                            fontWeight: 300,
                            color: 'rgba(255, 255, 255, 0.5)',
                            letterSpacing: '4px',
                            textTransform: 'uppercase',
                            marginBottom: '8px',
                        }}
                    >
                        Industry Research · 2026
                    </div>
                    <h1
                        style={{
                            fontSize: '64px',
                            fontWeight: 800,
                            color: '#fff',
                            margin: 0,
                            letterSpacing: '-1.5px',
                        }}
                    >
                        Top 5 Industries by AI Adoption
                    </h1>
                    <div
                        style={{
                            width: `${lineGrow}%`,
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent, #2EC4FF, transparent)',
                            marginTop: '20px',
                            marginRight: 'auto',
                            marginLeft: 'auto',
                        }}
                    />
                </div>

                {/* Dash-style Horizontal Guide Lines */}
                <div style={{ position: 'absolute', top: '350px', left: '100px', right: '100px', bottom: '100px', pointerEvents: 'none' }}>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                top: `${(i / 5) * 100}%`,
                                width: '100%',
                                height: '1px',
                                background: 'rgba(255, 255, 255, 0.03)',
                            }}
                        />
                    ))}
                </div>

                {/* The Bars */}
                <div
                    style={{
                        width: '100%',
                        maxWidth: '1000px',
                        zIndex: 1,
                    }}
                >
                    {DATASET.map((item, i) => (
                        <GlassBar
                            key={item.label}
                            label={item.label}
                            value={item.value}
                            delay={40 + i * 8}
                            brightness={item.brightness}
                        />
                    ))}
                </div>
            </AbsoluteFill>

            {/* Global Finish Glow */}
            <AbsoluteFill
                style={{
                    background: 'rgba(46, 196, 255, 0.1)',
                    opacity: globalGlow,
                    pointerEvents: 'none',
                    mixBlendMode: 'screen',
                }}
            />
        </AbsoluteFill>
    );
};
