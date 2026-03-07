import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Sequence,
} from 'remotion';

const DATA = [
    { rank: 1, label: 'ICT', val: 65, range: '62–65%' },
    { rank: 2, label: 'Financial Services', val: 60, range: '54–60%' },
    { rank: 3, label: 'Professional Services', val: 45, range: '40–45%' },
    { rank: 4, label: 'Retail & Consumer Goods', val: 45, range: '35–45%' },
    { rank: 5, label: 'Manufacturing', val: 35, range: '29–35%' },
    { rank: 6, label: 'Healthcare', val: 30, range: '22–30%' },
    { rank: 7, label: 'Telecommunications', val: 30, range: '25–30%' },
    { rank: 8, label: 'Energy / Utilities', val: 30, range: '20–30%' },
    { rank: 9, label: 'Transportation & Logistics', val: 25, range: '18–25%' },
    { rank: 10, label: 'Travel & Hospitality', val: 20, range: '15–20%' },
    { rank: 11, label: 'Construction', val: 12, range: '10–12%' },
];

const INSIGHTS = [
    { title: 'ICT', text: 'Heavy GenAI integration across dev, cloud, cybersecurity.' },
    { title: 'Financial Services', text: 'Fraud reduction 30–40%.' },
    { title: 'Manufacturing', text: 'Predictive maintenance reduces downtime 30–50%.' },
    { title: 'Healthcare', text: 'Diagnostics accuracy improved up to 20%.' },
];

const BarItem: React.FC<{
    rank: number;
    label: string;
    value: number;
    range: string;
    index: number;
    delay: number;
}> = ({ rank, label, value, range, index, delay }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entry = spring({
        frame: frame - delay,
        fps,
        config: { damping: 12, mass: 0.8 },
    });

    const barWidth = interpolate(entry, [0, 1], [0, value]);
    const counter = Math.floor(interpolate(entry, [0, 1], [0, value]));

    const isTop3 = rank <= 3;
    const isBottom3 = rank >= 9;

    const brightness = isBottom3 ? 0.6 : 1;
    const glow = isTop3 ? 1 : 0.5;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                marginBottom: '10px',
                opacity: interpolate(entry, [0, 1], [0, brightness]),
                transform: `translateX(${interpolate(entry, [0, 1], [-20, 0])}px)`,
            }}
        >
            <div style={{ width: '40px', fontSize: '18px', fontWeight: 800, color: '#2EC4FF', opacity: 0.8 }}>{rank}</div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontFamily: 'Inter, sans-serif' }}>
                    <span style={{ fontSize: '16px', fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>{label}</span>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>{counter}%</span>
                </div>
                <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', position: 'relative' }}>
                    <div
                        style={{
                            height: '100%',
                            width: `${barWidth}%`,
                            background: 'linear-gradient(90deg, #1A9FFF 0%, #2EC4FF 100%)',
                            borderRadius: '4px',
                            position: 'relative',
                            boxShadow: isTop3 ? `0 0 15px rgba(46, 196, 255, ${0.4 * glow})` : 'none',
                        }}
                    >
                        {entry > 0.9 && (
                            <div
                                style={{
                                    position: 'absolute',
                                    right: '-3px',
                                    top: '-3px',
                                    width: '6px',
                                    height: '14px',
                                    background: '#2EC4FF',
                                    boxShadow: `0 0 10px #2EC4FF`,
                                    borderRadius: '3px',
                                    opacity: interpolate(entry, [0.9, 1], [0, 1]),
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Scene10IndustryLeaderboard: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height, durationInFrames } = useVideoConfig();

    // Global scaling camera push-in for final scene
    const cameraPush = interpolate(frame, [540, 600], [1, 1.03], { extrapolateLeft: 'clamp' });

    // Background Sweep
    const sweepX = interpolate(frame % 150, [0, 150], [-500, width + 500]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#050B18', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
            {/* BACKGROUND LAYER */}
            <AbsoluteFill style={{ transform: `scale(${cameraPush})` }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #050B18 0%, #0B1E3A 100%)' }} />
                {/* Grid Texture */}
                <AbsoluteFill style={{ opacity: 0.04 }}>
                    <svg width="100%" height="100%">
                        <pattern id="gridLarge10" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#gridLarge10)" />
                    </svg>
                </AbsoluteFill>
                {/* Light Sweep */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: sweepX,
                        width: '200px',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(46, 196, 255, 0.03), transparent)',
                        transform: 'skewX(-20deg)',
                    }}
                />
            </AbsoluteFill>

            {/* SCENE 1: TITLE INTRO (0-4s) */}
            <Sequence from={0} durationInFrames={150}>
                <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 100px' }}>
                    <div
                        style={{
                            opacity: interpolate(frame, [0, 20, 130, 150], [0, 1, 1, 0]),
                            transform: `translateY(${interpolate(frame, [0, 20], [20, 0], { extrapolateLeft: 'clamp' })}px)`,
                        }}
                    >
                        <div style={{ fontSize: '18px', fontWeight: 300, color: 'rgba(255,255,255,0.7)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '15px' }}>
                            Global Industry Rankings · 2025
                        </div>
                        <h1 style={{ fontSize: '72px', fontWeight: 800, color: '#fff', margin: '0 0 20px 0', letterSpacing: '-1.5px' }}>
                            Top Industries by AI Adoption
                        </h1>
                        <div
                            style={{
                                width: interpolate(frame, [15, 45], [0, 400], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                                height: '2px',
                                background: 'linear-gradient(90deg, transparent, #2EC4FF, transparent)',
                                margin: '0 auto 30px auto',
                            }}
                        />
                        <p style={{ fontSize: '24px', color: 'rgba(255,255,255,0.6)', maxWidth: '800px', margin: '0 auto' }}>
                            Enterprise deployment and production-scale AI usage.
                        </p>
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* SCENE 2: LEADERBOARD (4-14s) overlaying everything */}
            <Sequence from={120} durationInFrames={480}>
                <AbsoluteFill style={{ padding: '80px 100px' }}>
                    {/* Dim leaderboard in Scene 3 (starts at frame 420, which is local 300) */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            opacity: interpolate(frame, [120, 140], [0, 1], { extrapolateLeft: 'clamp' }),
                            transition: 'opacity 0.5s ease',
                        }}
                    >
                        {/* RANKED LIST (LEFT 60%) */}
                        <div
                            style={{
                                flex: 1.5,
                                display: 'flex',
                                flexDirection: 'column',
                                opacity: interpolate(frame, [420, 440], [1, 0.4], { extrapolateLeft: 'clamp' }),
                            }}
                        >
                            <div style={{ fontSize: '14px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '30px', letterSpacing: 2 }}>
                                Current Production Leadership
                            </div>
                            {DATA.map((item, i) => (
                                <BarItem key={item.label} rank={item.rank} label={item.label} value={item.val} range={item.range} index={i} delay={140 + i * 6} />
                            ))}
                        </div>

                        {/* SIDE PANEL (RIGHT 40%) - SCENE 3 CONTENT (14-18s) */}
                        <div style={{ flex: 1, paddingLeft: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            {INSIGHTS.map((insight, i) => {
                                const insDelay = 420 + i * 15;
                                const insOpacity = interpolate(frame, [insDelay, insDelay + 20], [0, 1], { extrapolateLeft: 'clamp' });
                                const insTranslate = interpolate(frame, [insDelay, insDelay + 20], [20, 0], { extrapolateLeft: 'clamp' });

                                return (
                                    <div
                                        key={insight.title}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            backdropFilter: 'blur(20px)',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            padding: '24px',
                                            marginBottom: '20px',
                                            opacity: insOpacity,
                                            transform: `translateY(${insTranslate}px)`,
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                        }}
                                    >
                                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#2EC4FF', marginBottom: '8px', textTransform: 'uppercase' }}>{insight.title}</div>
                                        <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{insight.text}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* SCENE 4: STRATEGIC CLOSE (18-20s) */}
            <Sequence from={540} durationInFrames={60}>
                <AbsoluteFill
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        backgroundColor: 'rgba(5, 11, 24, 0.8)',
                        backdropFilter: 'blur(10px)',
                        opacity: interpolate(frame, [540, 560], [0, 1]),
                    }}
                >
                    <div style={{ maxWidth: '900px' }}>
                        <h2 style={{ fontSize: '56px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>AI intensity varies widely by sector.</h2>
                        <p style={{ fontSize: '28px', color: 'rgba(255,255,255,0.7)', fontWeight: 300 }}>
                            Technology leads adoption —<br />
                            <span style={{ color: '#fff', fontWeight: 500 }}>but operational ROI depends on deployment depth.</span>
                        </p>
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* Subtle Vignette */}
            <AbsoluteFill style={{ background: 'radial-gradient(circle, transparent 65%, rgba(5, 11, 24, 0.5) 100%)', pointerEvents: 'none' }} />
        </AbsoluteFill>
    );
};
