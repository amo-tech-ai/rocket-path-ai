import React from 'react';
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { ActLabel } from '../../../components/SharedUtils';

// Simplified treemap using predefined CSS grid areas
export const AnimatedTreemap: React.FC<{
    data: any[];
    stagger: number;
    highlightId: string;
    highlightFrame: number;
    exampleRevealFrame: number;
}> = ({ data, stagger, highlightId, highlightFrame, exampleRevealFrame }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Grid layout pre-calculated
    const gridAreas: Record<string, string> = {
        tech: '1 / 1 / 4 / 3',
        finance: '1 / 3 / 3 / 5',
        healthcare: '3 / 3 / 5 / 4',
        retail: '3 / 4 / 5 / 5',
        professional: '1 / 5 / 3 / 6',
        manufacturing: '4 / 1 / 6 / 3',
        logistics: '5 / 3 / 6 / 4',
        marketing: '5 / 4 / 6 / 5',
        energy: '3 / 5 / 5 / 6',
        education: '5 / 5 / 6 / 6',
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 0.8fr 0.8fr 0.6fr',
            gridTemplateRows: '1fr 1fr 1fr 0.8fr 0.6fr',
            gap: 8,
            width: '100%',
            height: 600,
            padding: '40px 100px 0 100px',
            position: 'relative'
        }}>
            {data.map((item, i) => {
                const delay = i * stagger;

                const scale = spring({
                    frame: frame - delay,
                    fps,
                    config: { damping: 200 }
                });

                const opacity = interpolate(scale, [0, 1], [0, 1]);

                const isHighlight = item.id === highlightId && frame > highlightFrame;
                const borderGlow = isHighlight ? `0 0 20px ${item.color}` : 'none';
                const zIndex = isHighlight ? 10 : 1;

                const revealExample = frame > exampleRevealFrame && item.example;
                const exampleOpacity = Math.max(0, Math.min(1, (frame - exampleRevealFrame) / 15));

                return (
                    <div key={item.id} style={{
                        gridArea: gridAreas[item.id] || 'auto',
                        backgroundColor: `${item.color}20`,
                        border: `2px solid ${item.color}`,
                        borderRadius: 8,
                        transform: `scale(${scale})`,
                        opacity,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20,
                        boxShadow: borderGlow,
                        zIndex,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ color: item.color, fontSize: 36, fontWeight: 800 }}>
                            {item.value}%
                        </div>
                        <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 600, textAlign: 'center', marginTop: 8 }}>
                            {item.label}
                        </div>

                        {isHighlight && item.badge && (
                            <Sequence from={highlightFrame} layout="none">
                                <div style={{
                                    position: 'absolute',
                                    top: -12,
                                    right: -12,
                                    backgroundColor: item.color,
                                    color: '#0A1628',
                                    padding: '4px 8px',
                                    borderRadius: 4,
                                    fontSize: 12,
                                    fontWeight: 800,
                                    transform: `scale(${spring({ frame: frame - highlightFrame, fps, config: { damping: 14 } })})`
                                }}>
                                    {item.badge}
                                </div>
                            </Sequence>
                        )}

                        {revealExample && (
                            <div style={{
                                position: 'absolute',
                                bottom: 12,
                                left: 12,
                                right: 12,
                                fontSize: 14,
                                color: '#94A3B8',
                                backgroundColor: 'rgba(10, 22, 40, 0.8)',
                                padding: '8px',
                                borderRadius: 4,
                                opacity: exampleOpacity,
                                textAlign: 'center'
                            }}>
                                {item.example}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export const KPIStrip: React.FC<{ stats: any[] }> = ({ stats }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const slideProgress = spring({
        frame,
        fps,
        config: { damping: 200 }
    });

    const translateY = interpolate(slideProgress, [0, 1], [100, 0]);
    const opacity = interpolate(slideProgress, [0, 1], [0, 1]);

    return (
        <div style={{
            position: 'absolute',
            bottom: 60,
            left: 100,
            right: 100,
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: '#111D33',
            padding: '24px 40px',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.1)',
            transform: `translateY(${translateY}px)`,
            opacity
        }}>
            {stats.map((stat, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}>{stat.value}</div>
                    <div style={{ fontSize: 14, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                </div>
            ))}
        </div>
    );
};

export const MapScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#0A1628', fontFamily: 'Inter, sans-serif' }}>
            <Sequence from={0} durationInFrames={30}>
                <ActLabel number="02" title="THE MAP" subtitle="Who's where" />
            </Sequence>

            <Sequence from={60}>
                <AnimatedTreemap
                    data={[
                        { id: "tech", label: "Technology & SaaS", value: 88, color: '#10B981', example: "GitHub Copilot: 46% of code" },
                        { id: "finance", label: "Financial Services", value: 75, color: '#10B981', example: "Mastercard: $20B fraud prevented" },
                        { id: "healthcare", label: "Healthcare", value: 55, color: '#3B82F6', example: "Mayo Clinic: 93% accuracy" },
                        { id: "retail", label: "Retail & E-commerce", value: 50, color: '#3B82F6', example: "Walmart: hourly demand" },
                        { id: "professional", label: "Professional Services", value: 45, color: '#3B82F6', example: "Allen & Overy: 80% faster" },
                        { id: "manufacturing", label: "Manufacturing", value: 40, color: '#F59E0B', example: "€190M/yr savings", badge: "HIGHEST UPSIDE" },
                        { id: "logistics", label: "Logistics", value: 31, color: '#6B7280' },
                        { id: "marketing", label: "Marketing & Media", value: 28, color: '#6B7280' },
                        { id: "energy", label: "Energy & Climate", value: 15, color: '#6B7280' },
                        { id: "education", label: "Education", value: 8, color: '#6B7280' }
                    ]}
                    stagger={5}
                    highlightId="manufacturing"
                    highlightFrame={240}
                    exampleRevealFrame={360}
                />
            </Sequence>

            <Sequence from={450}>
                <KPIStrip
                    stats={[
                        { value: "11×", label: "Tech vs Education gap" },
                        { value: "88%→8%", label: "adoption range" },
                        { value: "34%", label: "Marketing leads Gen AI" },
                        { value: "$33.9B", label: "Gen AI startup funding" }
                    ]}
                />
            </Sequence>
        </AbsoluteFill>
    );
};
