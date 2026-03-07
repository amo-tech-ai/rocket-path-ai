import React from 'react';
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { ActLabel, TypewriterText, FadeIn } from '../../../components/SharedUtils';

export const RoadmapTimeline: React.FC<{
    nodes: any[];
    pathEvolveDuration: number;
    pathGlowAtEnd: boolean;
}> = ({ nodes, pathEvolveDuration, pathGlowAtEnd }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Draw path
    const pathLength = interpolate(frame, [0, pathEvolveDuration], [0, 100], { extrapolateRight: 'clamp' });

    // Is it at the end?
    const isComplete = frame > pathEvolveDuration + 60;
    const boxShadow = isComplete && pathGlowAtEnd ? '0 0 40px rgba(16,185,129,0.5)' : 'none';

    return (
        <div style={{ position: 'relative', width: '100%', height: 400, marginTop: 100, padding: '0 100px' }}>

            {/* Background path line */}
            <div style={{
                position: 'absolute',
                top: 200,
                left: 100,
                right: 100,
                height: 4,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 2
            }} />

            {/* Progress path line */}
            <div style={{
                position: 'absolute',
                top: 200,
                left: 100,
                width: `calc(${pathLength}% - 200px)`,
                height: 4,
                backgroundColor: isComplete ? '#10B981' : '#FFFFFF',
                borderRadius: 2,
                boxShadow,
                transition: 'background-color 0.5s'
            }} />

            {/* Nodes */}
            <div style={{ position: 'absolute', top: 0, left: 100, right: 100, bottom: 0, display: 'flex', justifyContent: 'space-between' }}>
                {nodes.map((node, i) => {
                    const delay = node.delay;
                    const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
                    const scale = interpolate(progress, [0, 1], [0, 1]);
                    const opacity = interpolate(progress, [0, 1], [0, 1]);
                    const nodePulse = node.pulse ? Math.sin(frame / 5) * 0.1 + 1.1 : 1;
                    const finalScale = scale * (node.pulse ? nodePulse : 1);

                    return (
                        <div key={i} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: 200,
                            position: 'relative',
                            opacity,
                            transform: `scale(${finalScale})`
                        }}>
                            {/* Year Label */}
                            <div style={{
                                position: 'absolute',
                                top: 80,
                                fontSize: 32,
                                fontWeight: 800,
                                color: node.color,
                                textShadow: `0 0 20px ${node.color}40`
                            }}>
                                {node.year}
                            </div>

                            {/* Node dot */}
                            <div style={{
                                position: 'absolute',
                                top: 190,
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                backgroundColor: '#0A1628',
                                border: `4px solid ${node.color}`,
                                boxShadow: `0 0 16px ${node.color}80`,
                                zIndex: 10
                            }} />

                            {/* Text Card */}
                            <div style={{
                                position: 'absolute',
                                top: 240,
                                textAlign: 'center',
                                color: '#FFFFFF',
                                fontSize: node.fontSize || 22,
                                fontWeight: 600,
                                lineHeight: 1.4
                            }}>
                                {node.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const CostDropCallout: React.FC<{
    from: number;
    to: number;
    unit: string;
    multiplier: string;
    fromColor: string;
    toColor: string;
}> = ({ from, to, unit, multiplier, fromColor, toColor }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Gravity fall for the number
    const fallProgress = spring({ frame: frame - 20, fps, config: { damping: 12, mass: 1.5 } });

    const displayValue = Math.round(interpolate(fallProgress, [0, 1], [from, to]));
    const scale = interpolate(fallProgress, [0, 0.2, 1], [1, 2, 1], { extrapolateRight: 'clamp' });
    const color = frame > 40 ? toColor : fromColor;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                <div style={{ fontSize: 120, fontWeight: 900, color, transform: `scale(${scale})`, textShadow: `0 0 40px ${color}40` }}>
                    ${displayValue}
                </div>
                <div style={{ fontSize: 32, color: '#94A3B8', fontWeight: 500 }}>
                    {unit}
                </div>
            </div>

            <Sequence from={50} layout="none">
                <FadeIn duration={15}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: toColor, backgroundColor: `${toColor}20`, padding: '8px 24px', borderRadius: 32, marginTop: -10 }}>
                        {multiplier} cheaper
                    </div>
                </FadeIn>
            </Sequence>
        </div>
    );
};

export const CTABlock: React.FC<{
    logo: boolean;
    tagline: string;
    buttons: any[];
    springConfig: any;
}> = ({ tagline, buttons, springConfig }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const progress = spring({ frame, fps, config: springConfig });
    const scale = interpolate(progress, [0, 1], [0.8, 1]);
    const opacity = interpolate(progress, [0, 1], [0, 1]);

    return (
        <div style={{
            position: 'absolute',
            bottom: 120,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity,
            transform: `scale(${scale})`
        }}>
            <div style={{ fontSize: 72, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: 16 }}>
                Startup<span style={{ color: '#3B82F6' }}>AI</span>
            </div>
            <div style={{ fontSize: 24, color: '#94A3B8', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 48 }}>
                {tagline}
            </div>

            <div style={{ display: 'flex', gap: 24 }}>
                {buttons.map((btn, i) => (
                    <div key={i} style={{
                        padding: '20px 48px',
                        fontSize: 24,
                        fontWeight: 700,
                        borderRadius: 8,
                        backgroundColor: btn.variant === 'primary' ? '#3B82F6' : 'transparent',
                        color: btn.variant === 'primary' ? '#FFFFFF' : '#94A3B8',
                        border: btn.variant === 'primary' ? 'none' : '2px solid #94A3B8',
                    }}>
                        {btn.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const SourcesBar: React.FC<{ text: string, color: string, fontSize: number }> = ({ text, color, fontSize }) => (
    <div style={{ position: 'absolute', bottom: 30, width: '100%', textAlign: 'center', color, fontSize, letterSpacing: '0.05em' }}>
        {text}
    </div>
);

export const FutureScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#0A1628', fontFamily: 'Inter, sans-serif' }}>
            <Sequence from={0} durationInFrames={30}>
                <ActLabel number="05" title="THE FUTURE" subtitle="What's next" />
            </Sequence>

            <Sequence from={60}>
                <RoadmapTimeline
                    pathEvolveDuration={30}
                    pathGlowAtEnd={true}
                    nodes={[
                        { year: "2025", label: "Agentic AI Mainstream", color: "#3B82F6", delay: 0 },
                        { year: "2026", label: "Pilot Trap Breaks", color: "#3B82F6", delay: 30 },
                        { year: "2027", label: "Governance = Table Stakes", color: "#F59E0B", delay: 45 },
                        { year: "2028", label: "Winners Pull Away", color: "#F59E0B", delay: 60 },
                        { year: "2030", label: "$1.6T+ Market", color: "#10B981", delay: 75, pulse: true, fontSize: 36 }
                    ]}
                />
            </Sequence>

            <Sequence from={165}>
                <FadeIn>
                    <CostDropCallout
                        from={280}
                        to={1}
                        unit="per million ops"
                        multiplier="280×"
                        fromColor="#EF4444"
                        toColor="#10B981"
                    />
                </FadeIn>
            </Sequence>

            {/* Primary Message */}
            <Sequence from={240}>
                <FadeIn>
                    <div style={{ position: 'absolute', top: 300, width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ backgroundColor: '#0A1628', padding: '20px 40px', zIndex: 20 }}>
                            <TypewriterText
                                text="The organizations that win next won't just adopt AI — they'll rebuild operations around it."
                                speed={2}
                                position="center"
                                style={{ fontSize: 36, fontWeight: 600, color: '#FFFFFF', textAlign: 'center', maxWidth: 1000, lineHeight: 1.4 }}
                            />
                        </div>
                    </div>
                </FadeIn>
            </Sequence>

            {/* CTA */}
            <Sequence from={330}>
                <AbsoluteFill style={{ backgroundColor: '#0A1628', zIndex: 10 }}>
                    <CTABlock
                        logo={true}
                        tagline="Validate your AI strategy"
                        buttons={[
                            { label: "Validate Your Idea", href: "/validator", variant: "primary" },
                            { label: "Explore Reports", href: "/blog", variant: "ghost" }
                        ]}
                        springConfig={{ damping: 200 }}
                    />

                    <Sequence from={30}>
                        <FadeIn>
                            <SourcesBar
                                text="Sources: McKinsey, OECD, PwC, BCG, Stanford HAI, OpenAI, Bloomberg"
                                color="#94A3B8"
                                fontSize={14}
                            />
                        </FadeIn>
                    </Sequence>
                </AbsoluteFill>
            </Sequence>

        </AbsoluteFill>
    );
};
