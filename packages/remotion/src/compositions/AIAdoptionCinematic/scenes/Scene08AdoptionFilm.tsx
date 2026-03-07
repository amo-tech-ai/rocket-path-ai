import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Sequence,
} from 'remotion';

const RANKINGS = [
    { label: 'Technology & SaaS', value: 88 },
    { label: 'Financial Services', value: 75 },
    { label: 'Healthcare', value: 55 },
    { label: 'Retail & E-commerce', value: 50 },
    { label: 'Professional Services', value: 45 },
    { label: 'Manufacturing', value: 40 },
    { label: 'Logistics & Supply Chain', value: 31 },
    { label: 'Marketing & Media', value: 28 },
    { label: 'Energy & Climate', value: 15 },
    { label: 'Education', value: 8 },
];

const FlourishBar: React.FC<{
    label: string;
    value: number;
    delay: number;
    index: number;
}> = ({ label, value, delay, index }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const growSpr = spring({
        frame: frame - delay,
        fps,
        config: { damping: 14, mass: 0.8, stiffness: 100 },
    });

    const width = interpolate(growSpr, [0, 1], [0, value]);
    const counter = Math.floor(interpolate(growSpr, [0, 1], [0, value]));

    const isTop3 = index < 3;
    const isBottom3 = index > 6;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                marginBottom: '16px',
                opacity: interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: 'clamp' }),
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '18px',
                    color: isBottom3 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.9)',
                    fontWeight: 500,
                }}
            >
                <span>{label}</span>
                <span style={{ fontWeight: 800, color: isTop3 ? '#2EC4FF' : isBottom3 ? 'rgba(255,255,255,0.4)' : '#fff' }}>
                    {counter}%
                </span>
            </div>
            <div
                style={{
                    height: '8px',
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${width}%`,
                        background: 'linear-gradient(90deg, #1A9FFF 0%, #2EC4FF 100%)',
                        borderRadius: '4px',
                        position: 'relative',
                        opacity: isBottom3 ? 0.5 : 1,
                        boxShadow: isTop3 ? '0 0 10px rgba(46, 196, 255, 0.2)' : 'none',
                    }}
                >
                    {growSpr > 0.95 && (
                        <div
                            style={{
                                position: 'absolute',
                                right: '-2px',
                                top: '-2px',
                                width: '4px',
                                height: '12px',
                                background: '#2EC4FF',
                                boxShadow: '0 0 8px #2EC4FF',
                                borderRadius: '2px',
                                opacity: interpolate(growSpr, [0.95, 1], [0, 1]),
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export const Scene08AdoptionFilm: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height, durationInFrames } = useVideoConfig();

    // Timeline
    // Slide 1: 0 - 240
    // Transition: 240 - 270
    // Slide 2: 270 - 480

    const slide1Opacity = interpolate(frame, [240, 260], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const slide1Offset = interpolate(frame, [240, 270], [0, -100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    const slide2Opacity = interpolate(frame, [260, 280], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const cameraPush = interpolate(frame, [240, 480], [1, 1.05], { extrapolateLeft: 'clamp' });

    // Slide 1 Header
    const s1HeaderEntry = spring({ frame, fps, config: { damping: 20 } });

    // Slide 2 Components
    const s2Entry = frame - 270;
    const s2HeaderSpr = spring({ frame: s2Entry, fps, config: { damping: 20 } });
    const s2BarsSpr = spring({ frame: s2Entry - 30, fps, config: { damping: 15 } });
    const s2GapSpr = spring({ frame: s2Entry - 70, fps, config: { damping: 12 } });

    const s2FinalLineOpacity = interpolate(frame, [420, 450], [0, 1], { extrapolateLeft: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: '#050B18', overflow: 'hidden' }}>
            {/* Shared Background */}
            <AbsoluteFill style={{ transform: `scale(${cameraPush})` }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #0C1F3A 0%, #050B18 100%)' }} />
                <AbsoluteFill style={{ opacity: 0.05 }}>
                    <svg width="100%" height="100%">
                        <pattern id="gridSubtle" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#gridSubtle)" />
                    </svg>
                </AbsoluteFill>
            </AbsoluteFill>

            {/* Slide 1 Content */}
            {frame < 270 && (
                <AbsoluteFill style={{ opacity: slide1Opacity, transform: `translateX(${slide1Offset}px)`, padding: '80px 100px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px', opacity: s1HeaderEntry }}>
                        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>
                            Industry Rankings · 2024–2025
                        </div>
                        <h1 style={{ fontSize: '64px', fontWeight: 800, color: '#fff', margin: 0 }}>
                            Who's Actually Using AI?
                        </h1>
                    </div>

                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        {RANKINGS.map((item, i) => (
                            <FlourishBar key={item.label} label={item.label} value={item.value} delay={40 + i * 6} index={i} />
                        ))}
                    </div>
                </AbsoluteFill>
            )}

            {/* Slide 2 Content */}
            {frame >= 240 && (
                <AbsoluteFill style={{ opacity: slide2Opacity, padding: '100px' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', opacity: s2HeaderSpr, marginBottom: '100px' }}>
                        <h1 style={{ fontSize: '72px', fontWeight: 800, color: '#fff' }}>The Adoption Gap</h1>
                    </div>

                    {/* Comparison Columns */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1, padding: '0 100px' }}>
                        {/* Tech 88% */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }}>
                            <div style={{ fontSize: '100px', fontWeight: 900, color: '#2EC4FF', marginBottom: 20 }}>
                                {Math.floor(interpolate(s2BarsSpr, [0, 1], [0, 88]))}%
                            </div>
                            <div style={{ height: interpolate(s2BarsSpr, [0, 1], [0, 400]), width: '60px', background: 'linear-gradient(to top, #1A9FFF, #2EC4FF)', borderRadius: '30px', boxShadow: '0 0 30px rgba(46, 196, 255, 0.4)' }} />
                            <div style={{ marginTop: 20, fontSize: '24px', fontWeight: 500, color: '#fff' }}>Technology</div>
                        </div>

                        {/* Gap Indicator */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: s2GapSpr, transform: `scale(${interpolate(s2GapSpr, [0, 1], [0.8, 1])})` }}>
                            <div style={{ fontSize: '120px', fontWeight: 900, color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>11×</div>
                            <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 4 }}>The Gap</div>

                            {/* Mini stats */}
                            <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
                                <div style={{ opacity: interpolate(frame, [380, 400], [0, 1], { extrapolateLeft: 'clamp' }) }}>
                                    <span style={{ color: '#2EC4FF', fontWeight: 800, fontSize: '28px' }}>55→75%</span>
                                    <span style={{ color: 'rgba(255,255,255,0.6)', marginLeft: 15 }}>Gen AI Jump</span>
                                </div>
                                <div style={{ opacity: interpolate(frame, [400, 420], [0, 1], { extrapolateLeft: 'clamp' }) }}>
                                    <span style={{ color: '#2EC4FF', fontWeight: 800, fontSize: '28px' }}>92%</span>
                                    <span style={{ color: 'rgba(255,255,255,0.6)', marginLeft: 15 }}>Increased Use</span>
                                </div>
                            </div>
                        </div>

                        {/* Edu 8% */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }}>
                            <div style={{ fontSize: '100px', fontWeight: 900, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
                                {Math.floor(interpolate(s2BarsSpr, [0, 1], [0, 8]))}%
                            </div>
                            <div style={{ height: interpolate(s2BarsSpr, [0, 1], [0, 40]), width: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px' }} />
                            <div style={{ marginTop: 20, fontSize: '24px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>Education</div>
                        </div>
                    </div>

                    {/* Final Line */}
                    <AbsoluteFill style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '100px', opacity: s2FinalLineOpacity }}>
                        <div style={{ fontSize: '32px', fontWeight: 500, color: '#fff', textAlign: 'center', letterSpacing: 1 }}>
                            The adoption gap is becoming a <strong>performance gap.</strong>
                        </div>
                    </AbsoluteFill>
                </AbsoluteFill>
            )}

            {/* Suble Vignette */}
            <AbsoluteFill style={{ background: 'radial-gradient(circle, transparent 70%, rgba(5, 11, 24, 0.4) 100%)', pointerEvents: 'none' }} />
        </AbsoluteFill>
    );
};
