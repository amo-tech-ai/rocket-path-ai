import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';

const SECTORS = [
    {
        label: 'Technology & SaaS',
        value: '88%',
        text: ['Copilot writes 46% of code.', 'Einstein handles 1B+ predictions daily.', 'AI agents resolve tickets end-to-end.'],
        metrics: [{ val: '88%', lab: 'Regular AI use' }, { val: '39%', lab: 'EBIT impact' }, { val: '3×', lab: 'Agent scaling leaders' }],
    },
    {
        label: 'Financial Services',
        value: '75%',
        text: ['AI contract analysis in seconds.', 'Fraud detection <1 second.', '$2T robo-advisor assets.'],
        metrics: [{ val: '75%', lab: 'Adoption' }, { val: '50%', lab: 'Resolution time cut' }, { val: '#2', lab: 'Highest adoption sector' }],
    },
    {
        label: 'Healthcare',
        value: '55%',
        text: ['AI detects disease at clinical-grade accuracy.', 'AI trial matching.', 'Automated pathology.'],
        metrics: [{ val: '80%', lab: 'Testing AI' }, { val: '25%', lab: 'Cost reduction' }, { val: '-90%', lab: 'Maintenance time' }],
    },
    {
        label: 'Retail & E-commerce',
        value: '50%',
        text: ['Recommendation engines drive 35% sales.', 'AI personalization.', 'Inventory prediction.'],
        metrics: [{ val: '+15%', lab: 'Revenue' }, { val: '+15%', lab: 'Conversion lift' }, { val: '53%', lab: 'AI search usage' }],
    },
    {
        label: 'Manufacturing',
        value: '40%',
        text: ['AI twins simulate factories.', 'Predictive maintenance.', 'Planning automation.'],
        metrics: [{ val: '+31%', lab: 'Productivity' }, { val: '€190M', lab: 'Savings' }, { val: '77%', lab: 'Implementation rate' }],
    },
    {
        label: 'Logistics & Supply Chain',
        value: '31%',
        text: ['Route optimization.', 'Bridge inspection AI.', 'Autonomous rides.'],
        metrics: [{ val: '-60%', lab: 'Inspection time' }, { val: '20–30%', lab: 'Errors' }, { val: '150K+', lab: 'Rides/week' }],
    },
];

const SectorCard: React.FC<{ sector: typeof SECTORS[0]; delay: number; active?: boolean }> = ({ sector, delay, active }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const op = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: 'clamp' });
    const scale = spring({ frame: frame - delay, fps, config: { damping: 12 } });

    return (
        <div
            style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: op,
                transform: `scale(${interpolate(scale, [0, 1], [0.8, 1])})`,
            }}
        >
            <div style={{ fontSize: '48px', fontWeight: 900, color: '#2EC4FF', marginBottom: '10px' }}>{sector.value}</div>
            <div style={{ fontSize: '14px', color: '#fff', fontWeight: 500, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>{sector.label}</div>
        </div>
    );
};

export const Scene09SectorDeepDives: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height, durationInFrames } = useVideoConfig();

    // Timeline 0–720
    // 0–180: Grid Reveal
    // 180–210: Transition 1
    // 210–570: Deep Dives (6 sectors * 60 frames = 360 frames)
    // 570–600: Transition 2
    // 600–720: Closing Insight

    const gridOpacity = interpolate(frame, [180, 210], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const gridScale = interpolate(frame, [180, 210], [1, 1.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: '#050B18', fontFamily: 'Inter, sans-serif' }}>
            {/* Shared Deep Space BG */}
            <AbsoluteFill>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #050B18 0%, #0B1E3A 100%)' }} />
                <AbsoluteFill style={{ opacity: 0.03 }}>
                    <svg width="100%" height="100%">
                        <pattern id="gridLarge9" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#gridLarge9)" />
                    </svg>
                </AbsoluteFill>
            </AbsoluteFill>

            {/* SCENE 1: GRID (0-210) */}
            {frame < 210 && (
                <AbsoluteFill style={{ opacity: gridOpacity, transform: `scale(${gridScale})`, padding: '80px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div style={{ fontSize: '16px', fontWeight: 300, color: 'rgba(255,255,255,0.6)', letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '10px' }}>Sector Intelligence Deep Dives</div>
                        <h1 style={{ fontSize: '64px', fontWeight: 800, color: '#fff', margin: 0 }}>What AI Looks Like Inside Each Sector</h1>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '40px', flex: 1 }}>
                        {SECTORS.map((s, i) => (
                            <SectorCard key={s.label} sector={s} delay={20 + i * 6} />
                        ))}
                    </div>
                </AbsoluteFill>
            )}

            {/* SCENE 2: ROTATING DEEP DIVES (210-570) */}
            {frame >= 210 && frame < 600 && (
                <AbsoluteFill style={{ padding: '100px' }}>
                    {SECTORS.map((s, i) => {
                        const start = 210 + i * 60;
                        const end = start + 60;
                        if (frame < start || frame >= end) return null;

                        const localFrame = frame - start;
                        const slideOp = interpolate(localFrame, [0, 10, 50, 60], [0, 1, 1, 0]);
                        const slideX = interpolate(localFrame, [0, 10, 50, 60], [50, 0, 0, -50]);

                        return (
                            <AbsoluteFill key={s.label} style={{ opacity: slideOp, transform: `translateX(${slideX}px)`, padding: '100px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                {/* Left: Title & Text */}
                                <div style={{ flex: 1.2 }}>
                                    <div style={{ fontSize: '120px', fontWeight: 900, color: '#2EC4FF', lineHeight: 1 }}>{s.value}</div>
                                    <h2 style={{ fontSize: '48px', fontWeight: 800, color: '#fff', marginBottom: '40px' }}>{s.label}</h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {s.text.map((t, ti) => (
                                            <div key={ti} style={{ fontSize: '24px', color: 'rgba(255,255,255,0.8)', borderLeft: '3px solid #2EC4FF', paddingLeft: '20px' }}>{t}</div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Metrics Stack */}
                                <div style={{ flex: 0.8, display: 'flex', flexDirection: 'column', gap: '40px', paddingLeft: '80px' }}>
                                    {s.metrics.map((m, mi) => (
                                        <div key={mi} style={{ opacity: interpolate(localFrame, [10 + mi * 5, 20 + mi * 5], [0, 1], { extrapolateLeft: 'clamp' }) }}>
                                            <div style={{ fontSize: '56px', fontWeight: 900, color: '#fff' }}>{m.val}</div>
                                            <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px' }}>{m.lab}</div>
                                        </div>
                                    ))}
                                </div>
                            </AbsoluteFill>
                        );
                    })}
                </AbsoluteFill>
            )}

            {/* SCENE 3: CLOSING (600-720) */}
            {frame >= 570 && (
                <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: interpolate(frame, [570, 600], [0, 1]) }}>
                    <div style={{ textAlign: 'center', maxWidth: '1000px' }}>
                        <h1 style={{ fontSize: '80px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>High adoption does not equal highest return.</h1>
                        <div style={{ fontSize: '32px', color: '#2EC4FF', fontWeight: 600, marginBottom: '60px', opacity: interpolate(frame, [620, 650], [0, 1]) }}>
                            Manufacturing at 40% adoption<br />
                            → 31% labor productivity gains.
                        </div>
                        <div style={{ fontSize: '42px', fontWeight: 300, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', opacity: interpolate(frame, [660, 690], [0, 1]) }}>
                            “AI value depends on workflow redesign,<br />
                            not adoption rate alone.”
                        </div>
                    </div>
                </AbsoluteFill>
            )}

            {/* Vignette Overlay */}
            <AbsoluteFill style={{ background: 'radial-gradient(circle, transparent 70%, rgba(5,11,24,0.5) 100%)', pointerEvents: 'none' }} />
        </AbsoluteFill>
    );
};
