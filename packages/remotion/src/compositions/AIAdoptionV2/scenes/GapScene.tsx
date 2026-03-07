import React from 'react';
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { ActLabel } from '../../../components/SharedUtils';

// Simplified split screen comparison
export const SplitScreen: React.FC<{
    left: any;
    right: any;
    collapseAtFrame: number;
}> = ({ left, right, collapseAtFrame }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Draw divider
    const dividerHeight = interpolate(frame, [0, 30], [0, 100], { extrapolateRight: 'clamp' });
    const opacity = interpolate(frame, [collapseAtFrame, collapseAtFrame + 30], [1, 0], { extrapolateRight: 'clamp' });

    const renderSide = (data: any, isRight: boolean) => {
        return (
            <div style={{ flex: 1, padding: '0 80px', opacity }}>
                <h2 style={{ color: data.headerColor, fontSize: 32, fontWeight: 700, marginBottom: 64, textAlign: 'center' }}>
                    {data.header}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
                    {data.bars.map((bar: any, i: number) => {
                        const delay = bar.delay + 30; // After header
                        const progress = spring({
                            frame: frame - delay,
                            fps,
                            config: { damping: 200 }
                        });
                        const height = interpolate(progress, [0, 1], [0, bar.value]);

                        return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                                <div style={{ width: 120, fontSize: 48, fontWeight: 800, color: data.headerColor, textAlign: 'right' }}>
                                    {Math.round(interpolate(progress, [0, 1], [0, bar.value]))}%
                                </div>
                                <div style={{ flex: 1, height: 64, backgroundColor: '#111D33', borderRadius: 8, overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${height}%`,
                                        height: '100%',
                                        backgroundColor: data.headerColor,
                                        borderRadius: 8
                                    }} />
                                </div>
                                <div style={{ width: 240, fontSize: 18, color: '#FFFFFF', fontWeight: 500, lineHeight: 1.4 }}>
                                    {bar.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', width: '100%', height: '100%', paddingTop: 120, position: 'relative' }}>
            {renderSide(left, false)}

            {/* Center divider */}
            <div style={{
                position: 'absolute',
                top: 160,
                bottom: 120,
                left: '50%',
                width: 2,
                backgroundColor: 'rgba(255,255,255,0.1)',
                height: `${dividerHeight}%`,
                opacity
            }} />

            {renderSide(right, true)}
        </div>
    );
};

export const StackedBar: React.FC<{
    segments: any[];
    highlightPulse: boolean;
}> = ({ segments }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Pulse animation for the highlighted segment
    const pulse = Math.sin(frame / 5) * 0.2 + 0.8; // Oscillation between 0.6 and 1.0

    return (
        <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 360,
            paddingLeft: 160,
            paddingRight: 160
        }}>
            <div style={{ display: 'flex', width: '100%', height: 120, borderRadius: 16, overflow: 'hidden' }}>
                {segments.map((seg, i) => {
                    const delay = i * 20;
                    const progress = spring({
                        frame: frame - delay,
                        fps,
                        config: { damping: 200 }
                    });

                    const width = interpolate(progress, [0, 1], [0, seg.value]);
                    const opacity = seg.highlight ? pulse : 1;

                    return (
                        <div key={i} style={{
                            width: `${width}%`,
                            height: '100%',
                            backgroundColor: seg.color,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity,
                            borderRight: i < segments.length - 1 ? '4px solid #0A1628' : 'none'
                        }}>
                            <div style={{ fontSize: 36, fontWeight: 800, color: '#0A1628' }}>
                                {Math.round(interpolate(progress, [0, 1], [0, seg.value]))}%
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Labels below */}
            <div style={{ display: 'flex', width: '100%', marginTop: 32 }}>
                {segments.map((seg, i) => {
                    const labelOpacity = interpolate(frame - (i * 20) - 20, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
                    return (
                        <div key={i} style={{ width: `${seg.value}%`, opacity: labelOpacity, textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>{seg.label}</div>
                            <div style={{ fontSize: 14, color: seg.color, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                                {seg.sublabel}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const InsightQuote: React.FC<{ text: string; source?: string; position?: 'center' | 'bottom'; fontSize?: number }> = ({
    text,
    source,
    position = 'center',
    fontSize = 36
}) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
    const bottom = position === 'bottom' ? 80 : 'auto';
    const top = position === 'center' ? '40%' : 'auto';

    return (
        <div style={{
            position: 'absolute',
            width: '100%',
            bottom,
            top,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity
        }}>
            <div style={{
                maxWidth: 1000,
                textAlign: 'center',
                padding: '0 40px'
            }}>
                <div style={{
                    fontSize,
                    fontStyle: 'italic',
                    color: '#FFFFFF',
                    lineHeight: 1.4,
                    fontWeight: 300
                }}>
                    "{text}"
                </div>
                {source && (
                    <div style={{ marginTop: 24, fontSize: 18, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        — {source}
                    </div>
                )}
            </div>
        </div>
    );
};

export const GapScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#0A1628', fontFamily: 'Inter, sans-serif' }}>
            <Sequence from={0} durationInFrames={30}>
                <ActLabel number="03" title="THE GAP" subtitle="Adoption ≠ Results" />
            </Sequence>

            <Sequence from={60}>
                <SplitScreen
                    collapseAtFrame={240}
                    left={{
                        header: "WHAT EXECUTIVES SAY",
                        headerColor: "#3B82F6",
                        bars: [
                            { value: 80, label: "AI met expectations", delay: 0 },
                            { value: 92, label: "Increased AI usage", delay: 60 },
                            { value: 75, label: "Feel AI makes them faster", delay: 120 }
                        ]
                    }}
                    right={{
                        header: "WHAT DATA SHOWS",
                        headerColor: "#F59E0B",
                        bars: [
                            { value: 74, label: "No tangible returns", delay: 0 },
                            { value: 39, label: "Bottom-line impact", delay: 60 },
                            { value: 56, label: "Zero benefit from Gen AI", delay: 120 }
                        ]
                    }}
                />
            </Sequence>

            <Sequence from={300}>
                <StackedBar
                    highlightPulse={true}
                    segments={[
                        { value: 10, label: "Algorithms & Models", color: "#6B7280", sublabel: "WHERE MOST OBSESS" },
                        { value: 20, label: "Technology & Data", color: "#3B82F6", sublabel: "Necessary but insufficient" },
                        { value: 70, label: "People & Process", color: "#F59E0B", highlight: true, sublabel: "WHERE VALUE LIVES" }
                    ]}
                />
            </Sequence>

            <Sequence from={360}>
                <InsightQuote
                    text="AI delivers value when workflows change, not when tools are added."
                    source="BCG"
                    position="bottom"
                />
            </Sequence>
        </AbsoluteFill>
    );
};
