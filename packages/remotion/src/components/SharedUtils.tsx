import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from 'remotion';

export const FadeIn: React.FC<{ children: React.ReactNode; duration?: number }> = ({
    children,
    duration = 30
}) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, duration], [0, 1], {
        extrapolateRight: 'clamp',
    });

    return (
        <div style={{ opacity, width: '100%', height: '100%' }}>
            {children}
        </div>
    );
};

export const TypewriterText: React.FC<{
    text: string;
    speed?: number; // frames per character
    style?: React.CSSProperties;
    position?: 'center' | 'bottom' | 'top';
}> = ({ text, speed = 1.5, style, position = 'center' }) => {
    const frame = useCurrentFrame();

    // Calculate how many characters should be visible
    const charsShown = Math.floor(frame / speed);
    const textToShow = text.slice(0, Math.max(0, charsShown));

    const verticalAlign = position === 'center' ? 'center' : position === 'top' ? 'flex-start' : 'flex-end';

    return (
        <div style={{
            display: 'flex',
            alignItems: verticalAlign,
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            ...style
        }}>
            <span>{textToShow}</span>
        </div>
    );
};

export const SlideUp: React.FC<{
    children: React.ReactNode;
    springConfig?: any;
}> = ({ children, springConfig = { damping: 200 } }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const progress = spring({
        frame,
        fps,
        config: springConfig,
    });

    const translateY = interpolate(progress, [0, 1], [100, 0]);
    const opacity = interpolate(progress, [0, 1], [0, 1]);

    return (
        <div style={{
            transform: `translateY(${translateY}px)`,
            opacity,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {children}
        </div>
    );
};

export const ActLabel: React.FC<{
    number: string;
    title: string;
    subtitle: string;
}> = ({ number, title, subtitle }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const slideProgress = spring({
        frame,
        fps,
        config: { damping: 200 }
    });

    const xOffset = interpolate(slideProgress, [0, 1], [-50, 0]);
    const opacity = interpolate(slideProgress, [0, 1], [0, 1]);

    return (
        <AbsoluteFill style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0A1628',
            color: 'white',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                transform: `translateX(${xOffset}px)`,
                opacity,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <div style={{
                    fontSize: 24,
                    letterSpacing: '0.25em',
                    color: '#3B82F6', // PRIMARY
                    marginBottom: 16,
                    fontFamily: 'monospace'
                }}>
                    ACT {number}
                </div>
                <div style={{
                    fontSize: 72,
                    fontWeight: 800,
                    marginBottom: 24
                }}>
                    {title}
                </div>
                <div style={{
                    fontSize: 32,
                    color: '#94A3B8', // TEXT_DIM
                    fontWeight: 400
                }}>
                    {subtitle}
                </div>
            </div>
        </AbsoluteFill>
    );
};
